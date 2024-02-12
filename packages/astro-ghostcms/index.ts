import type { AstroIntegration } from "astro";
import type { SafeParseError, SafeParseSuccess } from "astro/zod";
import { UserConfigSchema } from "./src/schemas";
import type { UserConfig } from "./types";
import ghostSitemap from "./src/integrations/sitemap";
import ghostRobots from "./src/integrations/robots-txt";
import { loadEnv } from 'vite';
import { fromZodError } from "./src/utils/zod-validation/fromZodError.js";
import { addVirtualImport } from "./src/utils/add-virtual-import";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fse from "fs-extra";
import latestVersion from "./src/utils/latestVersion.js";

/** INTERNAL CONSTANTS */
const IC = {
    /** INTERNAL PACKAGE NAME */
    PKG:'@matthiesenxyz/astro-ghostcms',
    /** INTERNAL PACKAGE NAME (THEME) */
    DT:'@matthiesenxyz/astro-ghostcms-theme-default',
    /** INTERNAL STRING */
    CHECK_ENV:"Checking for Environment Variables...",
    /** SET ENV GRABBER MODE */
    MODE: 'all',
    /** SET ENV GRABBER PREFIXES */
    PREFIXES: 'CONTENT_API',
    /** INTERNAL STRING */
    KEY_MISSING:"CONTENT_API_KEY Missing from .env/environment variables",
    /** INTERNAL STRING */
    URL_MISSING:"CONTENT_API_URL Missing from .env/environment variables or ghostURL under the integration settings in `astro.config.mjs`",
    /** INTERNAL STRING */
    IT:"Injecting Theme: ",
    /** INTERNAL STRING */
    IDR:"Injecting Default Routes...",
    /** INTERNAL STRING */
    ITR:"Injecting Default Theme Routes...",
    /** INTERNAL STRING */
    IRD:"Route Injection Disabled - Skipping...",
    /** INTERNAL STRING */
    IIR:"Injecting Integration Route: ",
    /** INTERNAL STRING */
    II:"Injecting Integration: ",
    /** INTERNAL STRING */
    AIbU:"Already Imported by User: ",
    /** INTERNAL STRING */
    CF:"Checking for ",
    /** INTERNAL STRING */
    CONFSETUPDONE:"Step Complete",
    /** INTERNAL STRING */
    F0FR: "Inject `/404` Route",
    /** INTERNAL STRING */
    RSS: "Injecting `/rss.xml` Route and `@astrojs/rss` Integration",
    /** INTERNAL STRING */
    NOURL: "No Ghost URL defined in User Config: Falling back to environment variables.",
    /** INTERNAL STRING */
    id404: "404 Injection Disabled",
    /** INTERNAL STRING */
    idRSS: "RSS Injection Disabled",
    /** INTERNAL STRING */
    satori_e: "Injecting Satori-OpenGraph Generator",
    /** INTERNAL STRING */
    satori_d: "Satori Injection disabled"
}

/** CONTENT API ENVIRONMENT VARIABLES */
const ENV = loadEnv(IC.MODE, process.cwd(), IC.PREFIXES);

/** Astro-GhostCMS Integration
 * @ For more information and to see the docs check
 * @see https://astro-ghostcms.xyz
 */
export default function GhostCMS(options: UserConfig): AstroIntegration {
    return {
        name: "astro-ghostcms",
        hooks: {
            'astro:config:setup': async ({ injectRoute, config, updateConfig, logger, }) => {
                // DEFINE LOGGERS
                const logConfigCheck = logger.fork("astro-ghostcms/config:check")
                const logConfigSetup = logger.fork("astro-ghostcms/config:setup")

                // CHECK USER CONFIG AND MAKE AVAILBLE TO INTEGRATIONS
                logConfigCheck.info("Checking Config...")
                const GhostUserConfig = UserConfigSchema.safeParse(options || {}) as SafeParseSuccess<UserConfig>;
                if (!GhostUserConfig.success) {
                    const validationError = fromZodError((GhostUserConfig as unknown as SafeParseError<UserConfig>).error);
                    logConfigCheck.error(`Config Error - ${ validationError }`);
                    throw Error("");
                }
                const GhostConfig = GhostUserConfig.data;
                const GCD = {
                    theme:  GhostConfig.theme,
                    dRI: GhostConfig.disableRouteInjection,
                    dCO: GhostConfig.disableConsoleOutput,
                    SM: GhostConfig.sitemap,
                    RTXT: GhostConfig.robotstxt,
                    gSite: GhostConfig.ghostURL,
                    dRSS: GhostConfig.disableRSS,
                    d404: GhostConfig.disable404,
                    dOG: GhostConfig.disableSatoriOG
                }

                // Check For ENV Variables
                if(!GCD.dCO) {logConfigCheck.info(IC.CHECK_ENV)}
                if(ENV.CONTENT_API_KEY === undefined){
                    logConfigCheck.error(IC.KEY_MISSING);
                    throw IC.KEY_MISSING;
                }
                if(GCD.gSite === undefined){
                    logConfigCheck.warn(IC.NOURL)
                    if(ENV.CONTENT_API_URL === undefined){
                        logConfigCheck.error(IC.URL_MISSING);
                        throw IC.URL_MISSING; }
                }

                if(!GCD.dRI){
                    // THEME SELECTOR
                    if ( GCD.theme === IC.DT ) { 
                        if( !GCD.dCO ) { logConfigCheck.info( IC.IT + IC.DT )} 
                    } else { 
                        if( !GCD.dCO ) { logConfigCheck.info( IC.IT + GCD.theme )} 
                    }
                    // INJECT ROUTES
                    //// DEFAULT PROGRAM ROUTES
                    if( !GCD.dCO ) { logConfigSetup.info( IC.IDR )}
                    if( !GCD.d404 ){
                        if( !GCD.dCO ) { logConfigSetup.info( IC.F0FR )}
                        injectRoute({ 
                            pattern: '/404', 
                            entrypoint: `${IC.PKG}/404.astro` 
                        });
                    } else { if( !GCD.dCO ) { logConfigSetup.info(IC.id404)}}
                    
                    if( !GCD.dRSS ) {
                        if( !GCD.dCO ) { logConfigSetup.info( IC.RSS )}
                        injectRoute({ 
                            pattern: '/rss-style.xsl', 
                            entrypoint: `${IC.PKG}/rss-style.xsl.ts` 
                        });
                        injectRoute({ 
                            pattern: '/rss.xml', 
                            entrypoint: `${IC.PKG}/rss.xml.ts` 
                        });
                    } else { if( !GCD.dCO ) { logConfigSetup.info(IC.idRSS)}}

                    if ( !GCD.dOG ) {
                        if( !GCD.dCO ) { logConfigSetup.info( IC.satori_e )}
                        injectRoute({ 
                            pattern: '/open-graph/[slug].png', 
                            entrypoint: `${IC.PKG}/open-graph/[slug].png.ts` 
                        });
                        injectRoute({ 
                            pattern: '/open-graph/index.png', 
                            entrypoint: `${IC.PKG}/open-graph/index.png.ts` 
                        });
                        injectRoute({ 
                            pattern: '/open-graph/authors.png', 
                            entrypoint: `${IC.PKG}/open-graph/authors.png.ts` 
                        });
                        injectRoute({ 
                            pattern: '/open-graph/author/[slug].png', 
                            entrypoint: `${IC.PKG}/open-graph/author/[slug].png.ts` 
                        });
                        injectRoute({ 
                            pattern: '/open-graph/tags.png', 
                            entrypoint: `${IC.PKG}/open-graph/tags.png.ts` 
                        });
                        injectRoute({ 
                            pattern: '/open-graph/tag/[slug].png', 
                            entrypoint: `${IC.PKG}/open-graph/tag/[slug].png.ts` 
                        });
                    } else { if( !GCD.dCO ) { logConfigSetup.info( IC.satori_d )}}

                    // THEME ROUTES
                    if( !GCD.dCO ) { logConfigSetup.info( IC.ITR )}

                    injectRoute({ 
                        pattern: '/', 
                        entrypoint: `${GCD.theme}/index.astro` 
                    });
                    injectRoute({ 
                        pattern: '/[slug]', 
                        entrypoint: `${GCD.theme}/[slug].astro` 
                    });
                    injectRoute({ 
                        pattern: '/tags', 
                        entrypoint: `${GCD.theme}/tags.astro` 
                    });
                    injectRoute({ 
                        pattern: '/authors', 
                        entrypoint: `${GCD.theme}/authors.astro` 
                    })
                    injectRoute({ 
                        pattern: '/tag/[slug]', 
                        entrypoint: `${GCD.theme}/tag/[slug].astro` 
                    });
                    injectRoute({ 
                        pattern: '/author/[slug]', 
                        entrypoint: `${GCD.theme}/author/[slug].astro` 
                    });
                    injectRoute({ 
                        pattern: '/archives/[...page]', 
                        entrypoint: `${GCD.theme}/archives/[...page].astro` 
                    });

                } else { if( !GCD.dCO ) { logConfigSetup.info( IC.IRD )} }

                // IMPORT INTEGRATIONS & INTEGRATION ROUTES
                const integrations = [...config.integrations];

                // IMPORT INTEGRATION: @ASTROJS/SITEMAP
                if( !GCD.dCO ) { logConfigSetup.info( `${IC.CF}@astrojs/sitemap` )}
				if (!integrations.find(({ name }) => name === '@astrojs/sitemap' )) {
                    if( !GCD.dCO ) { logConfigSetup.info( `${IC.II}@astrojs/sitemap` )}
					integrations.push(ghostSitemap(GCD.SM));
				} else { if( !GCD.dCO ) { logConfigSetup.info( `${IC.AIbU}@astrojs/sitemap` )}
                };

                // IMPORT INTEGRATION: ASTRO-ROBOTS-TXT
                if( !GCD.dCO ) { logConfigSetup.info( `${IC.CF}astro-robots-txt` )}
				if (!integrations.find(({ name }) => name === 'astro-robots-txt' )) {
                    if( !GCD.dCO ) { logConfigSetup.info( `${IC.II}astro-robots-txt` )}
					integrations.push(ghostRobots(GCD.RTXT));
				} else {
                    if( !GCD.dCO ) { logConfigSetup.info( `${IC.AIbU}astro-robots-txt` )}
                };

                // FINAL STEP TO KEEP INTEGRATION LIVE
                try { updateConfig( {
                    // UPDATE ASTRO CONFIG WITH INTEGRATED INTEGRATIONS
                    integrations: [
                        ghostSitemap(GCD.SM),
                        ghostRobots(GCD.RTXT)
                    ],
                    vite: {
                        optimizeDeps: { exclude: ["@resvg/resvg-js"] }
                    }
                }) } catch ( e ) {
                    logConfigSetup.error( e as string );
                    throw e;
                };

                addVirtualImport({
                    name: 'virtual:@matthiesenxyz/astro-ghostcms/config',
                    content: `export default ${ JSON.stringify(GhostUserConfig.data) }`,
                    updateConfig
                })

            },
            'astro:config:done': async ({ logger }) => {
                // Config Done
                const logConfigDone = logger.fork("astro-ghostcms/config:done");
                const pJSON = await fse.readJson(path.resolve(fileURLToPath(import.meta.url), "..", 'package.json'));
                const pkgVer = pJSON.version;
                logConfigDone.info(`Config Done. Current Version: v${pkgVer}`);
            },
            'astro:server:setup': async ({ logger }) => {
                // Dev Server Start
                const logServerSetup = logger.fork("astro-ghostcms/server:setup");
                const logCurrentVersion = logger.fork("astro-ghostcms/current-version");
                const logNpmVersion = logger.fork("astro-ghostcms/npm-pub-version");
                const logCheck = logger.fork("astro-ghostcms/check");
                const pJSON = await fse.readJson(path.resolve(fileURLToPath(import.meta.url), "..", 'package.json'));
                const pkgVer = pJSON.version;
                const npmVER = await latestVersion(IC.PKG);
                if (pkgVer !== npmVER ) {
                    logCurrentVersion.warn(`Current Installed Version is v${pkgVer}`);
                    logNpmVersion.warn(`Latest Published Version is v${npmVER}`);
                    logCheck.warn("Please consider updating.");
                }
                logServerSetup.info("Setting up Astro-GhostCMS server for Development!");
            },
            'astro:server:start': async ({ logger }) => {
                // Server Start
                const logServerStart = logger.fork("astro-ghostcms/server:start");
                logServerStart.info("Astro-GhostCMS Integration Ready!");
            },
            'astro:build:done': async ({ logger }) => {
                // Build Done
                const logBuildDone = logger.fork("astro-ghostcms/build:done");
                const logCurrentVersion = logger.fork("astro-ghostcms/current-version");
                const logNpmVersion = logger.fork("astro-ghostcms/npm-pub-version");
                const logCheck = logger.fork("astro-ghostcms/check");
                const pJSON = await fse.readJson(path.resolve(fileURLToPath(import.meta.url), "..", 'package.json'));
                const pkgVer = pJSON.version;
                const npmVER = await latestVersion(IC.PKG);
                if (pkgVer !== npmVER ) {
                    logCurrentVersion.warn(`Current Installed Version is v${pkgVer}`);
                    logNpmVersion.warn(`Latest Published Version is v${npmVER}`);
                    logCheck.warn("Please consider updating.");
                }
                logBuildDone.info(`Build Complete, Integration Now ready for Production. Astro-GhostCMS v${pkgVer}`);
            }
        }
    }
}