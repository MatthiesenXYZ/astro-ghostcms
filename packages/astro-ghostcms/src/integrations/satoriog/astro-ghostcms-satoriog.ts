import { createResolver, defineIntegration } from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import c from "picocolors";
import { z } from "astro/zod";

export default defineIntegration({
    name: "@matthiesenxyz/astro-ghostcms-satoriog",
    optionsSchema: z.object({
		verbose: z.boolean().optional().default(false),
    }),
    plugins: [...corePlugins],
    setup({ options }) {
        const { resolve } = createResolver(import.meta.url);

        return {
            "astro:config:setup": ({ 
                watchIntegration, 
                updateConfig,
                injectRoute,
                logger 
            }) => {
                watchIntegration(resolve())

				const SatoriLogger = logger.fork(`${c.bold(c.blue('👻 Astro-GhostCMS'))}${c.gray("/")}${c.blue('SatoriOG')}`);

                SatoriLogger.info(c.bold(c.magenta('OG Image Integration Enabled. Setting up...')))

				const pkgname = "@matthiesenxyz/astro-ghostcms/open-graph"

				injectRoute({
					pattern: "/open-graph/[slug].png",
					entrypoint: `${pkgname}/[slug].png.ts`,
				});

				injectRoute({
					pattern: "/open-graph/index.png",
					entrypoint: `${pkgname}/index.png.ts`,
				});

				injectRoute({
					pattern: "/open-graph/authors.png",
					entrypoint: `${pkgname}/authors.png.ts`,
				});

				injectRoute({
					pattern: "/open-graph/author/[slug].png",
					entrypoint: `${pkgname}/author/[slug].png.ts`,
				});

				injectRoute({
					pattern: "/open-graph/tags.png",
					entrypoint: `${pkgname}/tags.png.ts`,
				});

				injectRoute({
					pattern: "/open-graph/tag/[slug].png",
					entrypoint: `${pkgname}/tag/[slug].png.ts`,
				});

                updateConfig({
                    vite: { optimizeDeps: { exclude: ["@resvg/resvg-js"] } }
                })
            },
            "astro:config:done": ({ logger }) => {
				const SatoriLogger = logger.fork(`${c.bold(c.blue('👻 Astro-GhostCMS'))}${c.gray("/")}${c.blue('SatoriOG')}`);

				if (options.verbose) {
					SatoriLogger.info(c.bold(c.green('OG Image Integration Setup Complete')))
				}
            }
        }
    }
})