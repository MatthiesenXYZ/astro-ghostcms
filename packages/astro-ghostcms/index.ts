import type { AstroIntegration } from "astro";
import type { SafeParseError, SafeParseSuccess } from "astro/zod";
import { UserConfigSchema, type UserConfig } from "./src/schemas";
import { ghostSitemap, ghostRobots } from "./src/integrations";
import { loadEnv } from 'vite';
import { fromZodError } from "zod-validation-error";
import { viteGhostCMS } from "./src/virtual";

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
    URL_MISSING:"CONTENT_API_URL Missing from .env/environment variables",
    /** INTERNAL STRING */
    IT:"Injecting Theme: ",
    /** INTERNAL STRING */
    IDR:"Injecting Default Routes...",
    /** INTERNAL STRING */
    IR:"Injecting Default Theme Routes...",
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
 * @ https://astro-ghostcms.xyz
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
                const o = UserConfigSchema.safeParse(options || {}) as SafeParseSuccess<UserConfig>;
                if (!o.success) {
                    const validationError = fromZodError((o as unknown as SafeParseError<UserConfig>).error);
                    logger.error(`Config Error - ${ validationError }`);
                    throw validationError;
                }

                /** INTERNAL USERCONFIG ALIAS */
                const uconf = o.data;
                /** CONFIG OPTION: ROUTE INJECTION */
                const injection = uconf.disableRouteInjection;
                /** CONFIG OPTION: THEME */
                const entry = uconf.theme;
                /** CONFIG OPTION: CONSOLE OUTPUT */
                const logs = uconf.disableConsoleOutput;

                // Check For ENV Variables
                if(!logs) {logger.info(IC.CHECK_ENV)}

                // CHECK FOR API KEY
                if(ENV.CONTENT_API_KEY === undefined){
                    logger.error(IC.KEY_MISSING);
                    throw IC.KEY_MISSING;
                }
                // CHECK FOR API URL
                if(ENV.CONTENT_API_URL === undefined){
                    logger.error(IC.URL_MISSING);
                    throw IC.URL_MISSING;
                }

                if(!injection){

                    // THEME SELECTOR
                    if ( entry === IC.DT ) { 
                        if( !logs ) { logger.info( IC.IT + IC.DT )} 
                    } else { 
                        if( !logs ) { logger.info( IC.IT + entry )} 
                    }

                    // INJECT ROUTES

                    // DEFAULT PROGRAM ROUTES
                    if( !logs ) { logger.info( IC.IDR )}

                    if( !logs ) { logger.info( IC.F0FR )}
                    injectRoute({ pattern: '/404', entrypoint: IC.PKG+'/404.astro' });
                    
                    if( !logs ) { logger.info( IC.RSS )}
                    injectRoute({ pattern: '/rss.xml', entrypoint: IC.PKG+'/rss.xml.ts' });

                    // THEME ROUTES
                    if( !logs ) { logger.info( IC.ITR )}

                    injectRoute({ pattern: '/', entrypoint: `${entry}/index.astro` });

                    injectRoute({ pattern: '/[slug]', entrypoint: `${entry}/[slug].astro` });

                    injectRoute({ pattern: '/tags', entrypoint: `${entry}/tags.astro` });

                    injectRoute({ pattern: '/authors', entrypoint: `${entry}/authors.astro` });

                    injectRoute({ pattern: '/tag/[slug]', entrypoint: `${entry}/tag/[slug].astro` });

                    injectRoute({ pattern: '/author/[slug]', entrypoint: `${entry}/author/[slug].astro` });

                    injectRoute({ pattern: '/archives/[...page]', entrypoint: `${entry}/archives/[...page].astro` });

                } else { if( !logs ) { logger.info( IC.IRD )} }

                // IMPORT INTEGRATIONS & INTEGRATION ROUTES
                const int = [...config.integrations];

                // IMPORT INTEGRATION: @ASTROJS/SITEMAP
                if( !logs ) { logger.info( IC.CF + "@astrojs/sitemap" )}
				if ( !int.find( ({ name }) => name === '@astrojs/sitemap' )) {
                    if( !logs ) { logger.info( IC.II + "@astrojs/sitemap" )}
					int.push( ghostSitemap( uconf ));
				} else { if( !logs ) { logger.info( IC.AIbU + "@astrojs/sitemap" )}
                };

                // IMPORT INTEGRATION: ASTRO-ROBOTS-TXT
                if( !logs ) { logger.info( IC.CF + "astro-robots-txt" )}
				if ( !int.find( ({ name }) => name === 'astro-robots-txt' )) {
                    if( !logs ) { logger.info( IC.II + "astro-robots-txt" )}
					int.push( ghostRobots( uconf ));
				} else {
                    if( !logs ) { logger.info( IC.AIbU + "astro-robots-txt" )}
                };

                // FINAL STEP TO KEEP INTEGRATION LIVE
                try { updateConfig( {
                    // UPDATE ASTRO CONFIG WITH INTEGRATED INTEGRATIONS
                    integrations: [ ghostSitemap( uconf ), ghostRobots( uconf ) ],
                    // LOAD VITE AND SETUP viteGhostCMS Configs
                    vite: { plugins: [ viteGhostCMS( uconf, config ) ]},
                }) } catch ( e ) {
                    logger.error( e as string );
                    throw e;
                };

            },
            'astro:config:done': async ({ logger }) => { 
                logger.info(IC.CONFSETUPDONE); 
            }
        }
    }
}
