import type { AstroIntegration } from "astro";
import type { SafeParseError, SafeParseSuccess } from "astro/zod";
import { UserConfigSchema } from "./src/schemas";
import type { UserConfig } from "./types";
import ghostSitemap from "./src/integrations/sitemap";
import ghostRobots from "./src/integrations/robots-txt";
import { loadEnv } from 'vite';
import { fromZodError } from "zod-validation-error";
import { addVirtualImport } from "./src/utils/add-virtual-import";

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
    CONFSETUPDONE:"GhostCMS Injection Complete.  Integration is now ready.",
    /** INTERNAL STRING */
    F0FR: "Inject `/404` Route",
    /** INTERNAL STRING */
    RSS: "Injecting `/rss.xml` Route and `@astrojs/rss` Integration"
}

/** CONTENT API ENVIRONMENT VARIABLES */
const ENV = loadEnv(IC.MODE, process.cwd(), IC.PREFIXES);

/** Astro-GhostCMS Integration
 * @ For more information and to see the docs check
 * @see https://astro-ghostcms.xyz
 */
export default function GhostCMS(options: UserConfig): AstroIntegration {
    return {
        name: IC.PKG,
        hooks: {
            'astro:config:setup': async ({
                injectRoute,
                config,
                updateConfig,
                logger,
            }) => {

                // CHECK USER CONFIG AND MAKE AVAILBLE TO INTEGRATIONS
                logger.info("Checking Config...")
                const GhostUserConfig = UserConfigSchema.safeParse(options || {}) as SafeParseSuccess<UserConfig>;
                if (!GhostUserConfig.success) {
                    const validationError = fromZodError((GhostUserConfig as unknown as SafeParseError<UserConfig>).error);
                    logger.error(`Config Error - ${ validationError }`);
                    throw Error("");
                }
                const GhostConfig = GhostUserConfig.data;
                const GCD = {
                    theme:  GhostConfig.theme,
                    dRI: GhostConfig.disableRouteInjection,
                    dCO: GhostConfig.disableConsoleOutput,
                    SM: GhostConfig.sitemap,
                    RTXT: GhostConfig.robotstxt,
                    gSite: GhostConfig.ghostURL
                }

                // Check For ENV Variables
                if(!GCD.dCO) {logger.info(IC.CHECK_ENV)}

                // CHECK FOR API KEY
                if(ENV.CONTENT_API_KEY === undefined){
                    logger.error(IC.KEY_MISSING);
                    throw IC.KEY_MISSING;
                }
                // CHECK FOR API URL
                if(ENV.CONTENT_API_URL === undefined){
                    if(GCD.gSite === undefined){
                        logger.error(IC.URL_MISSING);
                        throw IC.URL_MISSING;
                    }
                }

                if(!GCD.dRI){

                    // THEME SELECTOR
                    if ( GCD.theme === IC.DT ) { 
                        if( !GCD.dCO ) { logger.info( IC.IT + IC.DT )} 
                    } else { 
                        if( !GCD.dCO ) { logger.info( IC.IT + GCD.theme )} 
                    }

                    // INJECT ROUTES

                    // DEFAULT PROGRAM ROUTES
                    if( !GCD.dCO ) { logger.info( IC.IDR )}

                    if( !GCD.dCO ) { logger.info( IC.F0FR )}
                    injectRoute({ 
                        pattern: '/404', 
                        entrypoint: `${IC.PKG}/404.astro` 
                    });
                    
                    if( !GCD.dCO ) { logger.info( IC.RSS )}
                    injectRoute({ 
                        pattern: '/rss.xml', 
                        entrypoint: `${IC.PKG}/rss.xml.ts` 
                    });

                    // THEME ROUTES
                    if( !GCD.dCO ) { logger.info( IC.ITR )}

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
                    });

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

                } else { if( !GCD.dCO ) { logger.info( IC.IRD )} }

                // IMPORT INTEGRATIONS & INTEGRATION ROUTES
                const integrations = [...config.integrations];

                // IMPORT INTEGRATION: @ASTROJS/SITEMAP
                if( !GCD.dCO ) { logger.info( `${IC.CF}@astrojs/sitemap` )}
				if (!integrations.find(({ name }) => name === '@astrojs/sitemap' )) {
                    if( !GCD.dCO ) { logger.info( `${IC.II}@astrojs/sitemap` )}
					integrations.push(ghostSitemap(GCD.SM));
                    
				} else { if( !GCD.dCO ) { logger.info( `${IC.AIbU}@astrojs/sitemap` )}
                };

                // IMPORT INTEGRATION: ASTRO-ROBOTS-TXT
                if( !GCD.dCO ) { logger.info( `${IC.CF}astro-robots-txt` )}
				if (!integrations.find(({ name }) => name === 'astro-robots-txt' )) {
                    if( !GCD.dCO ) { logger.info( `${IC.II}astro-robots-txt` )}
					integrations.push(ghostRobots(GCD.RTXT));
				} else {
                    if( !GCD.dCO ) { logger.info( `${IC.AIbU}astro-robots-txt` )}
                };

                // FINAL STEP TO KEEP INTEGRATION LIVE
                try { updateConfig( {
                    // UPDATE ASTRO CONFIG WITH INTEGRATED INTEGRATIONS
                    integrations: [ ghostSitemap( GCD.SM ), ghostRobots( GCD.RTXT ) ],
                    // LOAD VITE AND SETUP viteGhostCMS Configs
                }) } catch ( e ) {
                    logger.error( e as string );
                    throw e;
                };

                addVirtualImport({
                    name: 'virtual:@matthiesenxyz/astro-ghostcms/config',
                    content: `export default ${ JSON.stringify(GhostUserConfig.data) }`,
                    updateConfig
                })

            },
            'astro:config:done': async ({ logger }) => { 
                logger.info(IC.CONFSETUPDONE); 
            }
        }
    }
}
