import { createResolver, defineIntegration } from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { z } from "astro/zod";
import c from "picocolors";

export default defineIntegration({
	name: "@matthiesenxyz/astro-ghostcms-rss",
	optionsSchema: z.object({
		verbose: z.coerce.boolean().optional(),
	}),
	plugins: [...corePlugins],
	setup({ options }) {
		const { resolve } = createResolver(import.meta.url);

		return {
			"astro:config:setup": ({ watchIntegration, injectRoute, logger }) => {
				watchIntegration(resolve());
				const RSSLogger = logger.fork(
					`${c.bold(c.blue("👻 Astro-GhostCMS"))}${c.gray("/")}${c.blue(
						"RSSGenerator",
					)}`,
				);

				RSSLogger.info(c.bold(c.magenta("RSS Feed Enabled. Setting up...")));

				const rssRoute = "@matthiesenxyz/astro-ghostcms/rss-routes";

				injectRoute({
					pattern: "/rss-style.xsl",
					entrypoint: `${rssRoute}/rss-style.xsl.ts`,
				});

				injectRoute({
					pattern: "/rss.xml",
					entrypoint: `${rssRoute}/rss.xml.ts`,
				});
			},
			"astro:config:done": ({ logger }) => {
				const RSSLogger = logger.fork(
					`${c.bold(c.blue("👻 Astro-GhostCMS"))}${c.gray("/")}${c.blue(
						"RSSGenerator",
					)}`,
				);
				const verboseLogsInfo = (message:string) => {
					if (options.verbose) {
						RSSLogger.info(message);
					}
				};

				verboseLogsInfo(c.bold(c.green("RSS Feed Setup Complete")));
			},
		};
	},
});
