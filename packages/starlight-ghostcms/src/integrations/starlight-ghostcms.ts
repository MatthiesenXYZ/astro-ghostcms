import {
    createResolver,
    defineIntegration,
} from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { z } from "astro/zod";
import { vitePluginStarlightGhostConfig } from "./vite";
import { type StarlightGhostConfig } from "../schemas/config";

export default defineIntegration({
    name: "@matthiesenxyz/starlight-ghostcms",
    optionsSchema: z.custom<StarlightGhostConfig>(),
    plugins: [...corePlugins],
    setup({ options }) {
        const { resolve } = createResolver(import.meta.url);

        return {
            "astro:config:setup": ({ watchIntegration, updateConfig, injectRoute }) => {
                watchIntegration(resolve());

                updateConfig({
                    vite: {
                        plugins: [vitePluginStarlightGhostConfig(options)],
                    },
                });

                const makeRoute = (endpoint: string, entrypoint: string) => {
                    injectRoute({
                        pattern: `/${endpoint}`,
                        entrypoint: resolve(`../routes/${entrypoint}`),
                        prerender: true,
                    });
                };

                makeRoute(`${options.route}`,
                "index.astro");
                makeRoute(`${options.route}/[slug]`, 
                "[slug].astro");
                makeRoute(`${options.route}/about`, 
                "about.astro");
                makeRoute(`${options.route}/authors`, 
                "authors.astro");
                makeRoute("rss.xml", 
                "rss.xml.ts");
            }
        }
    }
})