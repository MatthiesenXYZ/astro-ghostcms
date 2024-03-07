import {
    createResolver,
    defineIntegration,
} from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { z } from "astro/zod";
import { type StarlightGhostConfig } from "../schemas/config";

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
                injectRoute 
            }) => {
                watchIntegration(resolve());

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