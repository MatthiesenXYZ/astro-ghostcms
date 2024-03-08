import {
    createResolver,
    defineIntegration,
} from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { z } from "astro/zod";
import { type StarlightGhostConfig } from "../schemas/config";
import astroGists from "@matthiesenxyz/astro-gists";

export default defineIntegration({
    name: "@matthiesenxyz/starlight-ghostcms",
    optionsSchema: z.custom<StarlightGhostConfig>(),
    plugins: [...corePlugins],
    setup({ options }) {
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