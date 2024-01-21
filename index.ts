import type { AstroIntegration } from "astro";
import type { SafeParseError, SafeParseSuccess } from "astro/zod";
import { UserConfigSchema, type UserConfig } from "./src/utils/UserConfigSchema";
import { ghostSitemap, ghostRobots } from "./src/integrations";
import { loadEnv } from 'vite';
import { fromZodError } from "zod-validation-error";
import { viteGhostCMS } from "./src/utils/virtual-imports";

// LOAD ENVIRONMENT VARIABLES
const mode = 'all'; 
const prefixes = 'CONTENT_API';
const env = loadEnv(mode, process.cwd(), prefixes);

// INTERNAL CONSTANTS
const pkg = '@matthiesenxyz/astro-ghostcms';
const CHECK_ENV = "Checking for Environment Variables...";
const KEY_MISSING = "CONTENT_API_KEY Missing from .env";
const URL_MISSING = "CONTENT_API_URL Missing from .env";
const IT = "Injecting Theme: "
const IR = "Injecting Routes...";
const IRD = "Route Injection Disabled - Skipping...";
const IIR = "Injecting Integration Route: "
const II = "Injecting Integration: ";
const AIbU = "Already Imported by User: ";
const CF = "Checking for ";
const CONFSETUPDONE = "GhostCMS Injection Complete.  Integration is now ready."

/** Astro-GhostCMS Integration
 * @ For more information and to see the docs check
 * @ https://astro-ghostcms.xyz
 */
export default function GhostCMS(options: UserConfig): AstroIntegration {
    return {
        name: pkg,
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
                const uconf = o.data;
                const injection = uconf.disableRouteInjection;
                const entry = uconf.theme;
                const logs = uconf.disableConsoleOutput;

                // Check For ENV Variables
                if(!logs) {logger.info(CHECK_ENV)}

                // CHECK FOR API KEY
                if(env.CONTENT_API_KEY === undefined){
                    logger.error(KEY_MISSING);
                    throw KEY_MISSING;
                }
                // CHECK FOR API URL
                if(env.CONTENT_API_URL === undefined){
                    logger.error(URL_MISSING);
                    throw URL_MISSING;
                }


                if(!injection){
                    // THEME SELECTOR
                    if (entry === pkg) {
                        if(!logs) {logger.info(IT + pkg)}
                    } else {
                        if(!logs) {logger.info(IT + entry)}
                    }

                    // INJECT ROUTES
                    if(!logs) {logger.info(IR)}

                    injectRoute({
                        pattern: '/',
                        entrypoint: `${entry}/index.astro`
                    });
                    
                    injectRoute({
                        pattern: '/404',
                        entrypoint: `${entry}/404.astro`
                    });

                    injectRoute({
                        pattern: '/[slug]',
                        entrypoint: `${entry}/[slug].astro`
                    });

                    injectRoute({
                        pattern: '/tags',
                        entrypoint: `${entry}/tags.astro`
                    });

                    injectRoute({
                        pattern: '/authors',
                        entrypoint: `${entry}/authors.astro`
                    });

                    injectRoute({
                        pattern: '/tag/[slug]',
                        entrypoint: `${entry}/tag/[slug].astro`
                    });

                    injectRoute({
                        pattern: '/author/[slug]',
                        entrypoint: `${entry}/author/[slug].astro`
                    });

                    injectRoute({
                        pattern: '/archives/[...page]',
                        entrypoint: `${entry}/archives/[...page].astro`
                    });
                } else {
                    if(!logs) {logger.info(IRD)}
                }

                // IMPORT INTEGRATIONS & INTEGRATION ROUTES
                const int = [...config.integrations];

                // IMPORT INTEGRATION: @ASTROJS/RSS
                if(!logs) {logger.info(IIR + "@astrojs/rss")}
                injectRoute({
                    pattern: '/rss.xml',
                    entrypoint: `${pkg}/rss.xml.js`
                });

                // IMPORT INTEGRATION: @ASTROJS/SITEMAP
                if(!logs) {logger.info(CF + "@astrojs/sitemap")}
				if (!int.find(({ name }) => name === '@astrojs/sitemap')) {
                    if(!logs) {logger.info(II + "@astrojs/sitemap")}
					int.push(ghostSitemap(uconf));
				} else {
                    if(!logs) {logger.info(AIbU + "@astrojs/sitemap")}
                };

                // IMPORT INTEGRATION: ASTRO-ROBOTS-TXT
                if(!logs) {logger.info(CF + "astro-robots-txt")}
				if (!int.find(({ name }) => name === 'astro-robots-txt')) {
                    if(!logs) {logger.info(II + "astro-robots-txt")}
					int.push(ghostRobots(uconf));
				} else {
                    if(!logs) {logger.info(AIbU + "astro-robots-txt")}
                };
                try {updateConfig({
                    integrations: [
                        ghostSitemap(uconf),
                        ghostRobots(uconf),
                    ],
                    vite:{plugins:[viteGhostCMS(uconf,config)]},
                }) } catch (e) {
                    logger.error(e as string);
                    throw e;
                };

            },
            'astro:config:done': async ({ logger }) => {
                logger.info(CONFSETUPDONE);
            }
        }
    }
}
