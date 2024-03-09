import {
    createResolver,
    defineIntegration,
} from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { z } from "astro/zod";
import { type StarlightGhostConfig } from "../schemas/config";
import astroGists from "@matthiesenxyz/astro-gists";
import { AstroError } from "astro/errors";
import { loadEnv } from "vite";

// Load environment variables
const ENV = loadEnv("all", process.cwd(), "CONTENT_API");

export default defineIntegration({
    name: "@matthiesenxyz/starlight-ghostcms",
    optionsSchema: z.custom<StarlightGhostConfig>(),
    plugins: [...corePlugins],
    setup({ options, name }) {
        const { resolve } = createResolver(import.meta.url);

        return {
            "astro:config:setup": ({ 
                watchIntegration, 
                addVirtualImports, 
                injectRoute,
                logger,
                addIntegration,
            }) => {
                watchIntegration(resolve());

				// Check for GhostCMS API Key
				if (ENV.CONTENT_API_KEY === undefined) {
					throw new AstroError(
						`${name} CONTENT_API_KEY is not set in environment variables`,
					);
				}

				// Check for GhostCMS URL
				if (options.ghostURL === undefined) {
					logger.warn("ghostURL is not set in user configuration falling back to environment variable");
					if (ENV.CONTENT_API_URL === undefined) {
						throw new AstroError(
							`${name} CONTENT_API_URL is not set in environment variables`,
						);
					}
				}

				// Add the AstroGist integration if enabled
				logger.info("Adding @matthiesenxyz/astro-gists integration ...");
				addIntegration(astroGists());
				logger.info("Note: If you are using Astro-Gists with GhostCMS Make sure to set the `GITHUB_PERSONAL_TOKEN` in your `.env` file. \n Otherwise, you can ignore any error messages related to Astro-Gists.")
				
                addVirtualImports({
                    'virtual:starlight-ghostcms/config': `export default ${JSON.stringify(options)}`,
                });

                const makeRoute = (endpoint: string, entrypoint: string) => {
                    injectRoute({
                        pattern: `/${endpoint}`,
                        entrypoint: resolve(`../routes/${entrypoint}`),
                        prerender: true,
                    });
                };
                const sanitisedRoute = options.route
                .replace(/^\//, '')
                .replace(/\/$/, '');

                makeRoute(`${sanitisedRoute}`,
                "index.astro");
                makeRoute(`${sanitisedRoute}/[slug]`, 
                "[slug].astro");
                makeRoute(`${sanitisedRoute}/about`, 
                "about.astro");
                makeRoute(`${sanitisedRoute}/authors`, 
                "authors.astro");
                makeRoute("rss.xml", 
                "rss.xml.ts");
            }
        }
    }
})