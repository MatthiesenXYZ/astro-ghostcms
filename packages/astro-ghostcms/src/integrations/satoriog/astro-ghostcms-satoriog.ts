import { createResolver, defineIntegration } from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { z } from "astro/zod";
import c from "picocolors";

export default defineIntegration({
	name: "@matthiesenxyz/astro-ghostcms-satoriog",
	optionsSchema: z.object({
		verbose: z.coerce.boolean().optional(),
	}),
	plugins: [...corePlugins],
	setup({ options }) {
		const { resolve } = createResolver(import.meta.url);

		return {
			"astro:config:setup": ({
				watchIntegration,
				updateConfig,
				injectRoute,
				logger,
			}) => {
				watchIntegration(resolve());

				const SatoriLogger = logger.fork(
					`${c.bold(c.blue("👻 Astro-GhostCMS"))}${c.gray("/")}${c.blue(
						"SatoriOG",
					)}`,
				);

				SatoriLogger.info(
					c.bold(c.magenta("OG Image Integration Enabled. Setting up...")),
				);

				injectRoute({
					pattern: "/open-graph/[slug].png",
					entrypoint: resolve("./routes/[slug].png.ts"),
				});

				injectRoute({
					pattern: "/open-graph/index.png",
					entrypoint: resolve("./routes/index.png.ts"),
				});

				injectRoute({
					pattern: "/open-graph/authors.png",
					entrypoint: resolve("./routes/authors.png.ts"),
				});

				injectRoute({
					pattern: "/open-graph/author/[slug].png",
					entrypoint: resolve("./routes/author/[slug].png.ts"),
				});

				injectRoute({
					pattern: "/open-graph/tags.png",
					entrypoint: resolve("./routes/tags.png.ts"),
				});

				injectRoute({
					pattern: "/open-graph/tag/[slug].png",
					entrypoint: resolve("./routes/tag/[slug].png.ts"),
				});

				updateConfig({
					vite: { optimizeDeps: { exclude: ["@resvg/resvg-js"] } },
				});
			},
			"astro:config:done": ({ logger }) => {
				const SatoriLogger = logger.fork(
					`${c.bold(c.blue("👻 Astro-GhostCMS"))}${c.gray("/")}${c.blue(
						"SatoriOG",
					)}`,
				);
				const verboseLogsInfo = (message:string) => {
					if (options.verbose) {
						SatoriLogger.info(message);
					}
				};

				verboseLogsInfo(c.bold(c.green("OG Image Integration Setup Complete")));
			},
		};
	},
});
