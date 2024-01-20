import type { AstroIntegration } from "astro";
import type { SafeParseError, SafeParseSuccess } from "astro/zod";
import { UserConfigSchema, type UserConfig } from "./src/utils/UserConfigSchema";
import { ghostSitemap, ghostRobots } from "./src/integrations";
import { loadEnv } from 'vite';
import { fromZodError } from "zod-validation-error";
import sitemap from '@astrojs/sitemap';
import robotsTxt from "astro-robots-txt";

// LOAD ENVIRONMENT VARIABLES
const mode = 'all'; 
const prefixes = 'CONTENT_API';
const env = loadEnv(mode, process.cwd(), prefixes);

// SET LOCAL PACKAGE NAME
const pkg = '@matthiesenxyz/astro-ghostcms';

export default function GhostCMS(options: UserConfig): AstroIntegration {
    let UserConfig:UserConfig
    return {
        name: pkg,
        hooks: {
            'astro:config:setup': async ({
                command,
                isRestart,
                injectRoute,
                config,
                updateConfig,
                logger,
            }) => {
                // Check For ENV Variables
                logger.info("Checking for Environment Variables...")

                // CHECK FOR API KEY
                if(env.CONTENT_API_KEY === undefined){
                    logger.error("CONTENT_API_KEY Missing from .env")
                }
                // CHECK FOR API URL
                if(env.CONTENT_API_URL === undefined){
                    logger.error("CONTENT_API_URL Missing from .env")
                }

                // CHECK USER CONFIG
                logger.info("Checking Config...")
                const o = UserConfigSchema.safeParse(options || {}) as SafeParseSuccess<UserConfig>;
                if (!o.success) {
                    const validationError = fromZodError((o as unknown as SafeParseError<UserConfig>).error);
                    logger.error(`Config Error - ${ validationError }`);
                    throw validationError;
                }
                const entry = o.data.theme;

                // THEME SELECTOR
                if (entry === pkg) {
                    logger.info("Injecting Theme: astro-ghostcms-basetheme");
                } else {
                    logger.info(`Injecting Theme: ${entry}`);
                }

                // INJECT ROUTES
                logger.info("Injecting Routes...");

                injectRoute({
                    pattern: '/',
                    entrypoint: `${entry}/index.astro`
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

                // IMPORT INTEGRATIONS & INTEGRATION ROUTES
                const int = [...config.integrations];

                // IMPORT INTEGRATION: @ASTROJS/RSS
                logger.info("Injecting Integration Route: @astrojs/rss");
                injectRoute({
                    pattern: '/rss.xml',
                    entrypoint: `${pkg}/rss.xml.js`
                });

                // IMPORT INTEGRATION: @ASTROJS/SITEMAP
                logger.info("Checking for @astrojs/sitemap");
				if (!int.find(({ name }) => name === '@astrojs/sitemap')) {
                    logger.info("Injecting Integration: @astrojs/sitemap");
					int.push(sitemap());
				} else {
                    logger.info("Already Imported by User: @astrojs/sitemap");
                }

                // IMPORT INTEGRATION: ASTRO-ROBOTS-TXT
                logger.info("Checking for astro-robots-txt");
				if (!int.find(({ name }) => name === 'astro-robots-txt')) {
                    logger.info("Injecting Integration: astro-robots-txt");
					int.push(robotsTxt());
				} else {
                    logger.info("Already Imported by User: astro-robots-txt");
                }
                
                try {
                    updateConfig({
                        integrations: [sitemap(),robotsTxt()]
                    })
                } catch (e) {
                    logger.error(e as string)
                    throw e
                }

            },
            'astro:config:done': async ({ logger }) => {
                logger.info('GhostCMS Injection Complete.  Integration is now ready.');
            }
        }
    }
}
