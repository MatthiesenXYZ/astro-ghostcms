import path from "node:path";
import { fileURLToPath } from "node:url";
import { createResolver, defineIntegration } from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { AstroError } from "astro/errors";
import fse from "fs-extra";
import c from "picocolors";
import { loadEnv } from "vite";
import { GhostUserConfigSchema } from "./schemas/userconfig";
import latestVersion from "./utils/latestVersion";

// Import External Integrations
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";

import ghostRSS from "./integrations/rssfeed";
// Import Internal Integrations
import ghostOGImages from "./integrations/satoriog";
import ghostThemeProvider from "./integrations/themeprovider";

// Load environment variables
const ENV = loadEnv("all", process.cwd(), "CONTENT_API");

/** Astro-GhostCMS Integration
 * @description This integration allows you to use GhostCMS as a headless CMS for your Astro project
 * @see https://astro-ghostcms.xyz for the most up-to-date documentation!
 */
export default defineIntegration({
	name: "@matthiesenxyz/astro-ghostcms",
	optionsSchema: GhostUserConfigSchema,
	plugins: [...corePlugins],
	setup({ options, name }) {
		const { resolve } = createResolver(import.meta.url);

		return {
			"astro:config:setup": ({
				watchIntegration,
				hasIntegration,
				addIntegration,
				addVirtualImports,
				addDts,
				injectRoute,
				logger,
			}) => {
				const GhostLogger = logger.fork(c.bold(c.blue("👻 Astro-GhostCMS")));
				const GhostENVLogger = logger.fork(
					`${c.bold(c.blue("👻 Astro-GhostCMS"))}${c.gray("/")}${c.blue(
						"ENV Check",
					)}`,
				);
				const GhostIntegrationLogger = logger.fork(
					`${c.bold(c.blue("👻 Astro-GhostCMS"))}${c.gray("/")}${c.blue(
						"Integrations",
					)}`,
				);
				const GhostRouteLogger = logger.fork(
					`${c.bold(c.blue("👻 Astro-GhostCMS"))}${c.gray("/")}${c.blue(
						"Router",
					)}`,
				);

				watchIntegration(resolve());
				GhostLogger.info("Initializing @matthiesenxyz/astro-ghostcms...");

				const verbose = options.fullConsoleLogs;

				// Check for GhostCMS environment variables
				GhostENVLogger.info(
					c.bold(
						c.yellow(
							"Checking for GhostCMS environment variables & user configuration",
						),
					),
				);
				if (ENV.CONTENT_API_KEY === undefined) {
					GhostENVLogger.error(
						c.bgRed(
							c.bold(
								c.white("CONTENT_API_KEY is not set in environment variables"),
							),
						),
					);
					throw new AstroError(
						`${name} CONTENT_API_KEY is not set in environment variables`,
					);
				}

				if (options.ghostURL === undefined) {
					GhostENVLogger.warn(
						c.bgYellow(
							c.bold(
								c.black(
									"ghostURL is not set in user configuration falling back to environment variable",
								),
							),
						),
					);
					if (ENV.CONTENT_API_URL === undefined) {
						GhostENVLogger.error(
							c.bgRed(
								c.bold(
									c.white(
										"CONTENT_API_URL is not set in environment variables",
									),
								),
							),
						);
						throw new AstroError(
							`${name} CONTENT_API_URL is not set in environment variables`,
						);
					}
				}
				GhostENVLogger.info(
					c.bold(c.green("GhostCMS environment variables are set")),
				);

				// Set up Astro-GhostCMS Integrations
				GhostIntegrationLogger.info(
					c.bold(c.magenta("Configuring Enabled Integrations")),
				);

				// Theme Provider
				if (!options.disableThemeProvider) {
					addIntegration(
						ghostThemeProvider({
							theme: options.ThemeProvider?.theme,
							verbose,
						}),
					);
				} else {
					if (verbose) {
						GhostIntegrationLogger.info(c.gray("Theme Provider is disabled"));
					}
				}

				// Satori OG Images
				if (options.enableOGImages) {
					addIntegration(ghostOGImages({ verbose }));
				} else {
					if (verbose) {
						GhostIntegrationLogger.info(
							c.gray("OG Image Provider is disabled"),
						);
					}
				}

				// RSS Feed
				if (options.enableRSSFeed) {
					addIntegration(ghostRSS({ verbose }));
				} else {
					if (verbose) {
						GhostIntegrationLogger.info(c.gray("RSS Feed is disabled"));
					}
				}

				// @ASTROJS/SITEMAP
				if (!hasIntegration("@astrojs/sitemap")) {
					if (verbose) {
						GhostIntegrationLogger.info(
							c.bold(
								c.magenta(`Adding ${c.blue("@astrojs/sitemap")} integration`),
							),
						);
					}
					addIntegration(sitemap());
				} else {
					if (verbose) {
						GhostIntegrationLogger.info(
							c.gray(
								"@astrojs/sitemap integration already exists, skipping...",
							),
						);
					}
				}
				// ASTRO-ROBOTS-TXT
				if (!hasIntegration("@astro-robots-txt")) {
					if (verbose) {
						GhostIntegrationLogger.info(
							c.bold(
								c.magenta(`Adding ${c.blue("astro-robots-txt")} integration`),
							),
						);
					}
					addIntegration(robotsTxt());
				} else {
					if (verbose) {
						GhostIntegrationLogger.info(
							c.gray(
								"astro-robots-txt integration already exists, skipping...",
							),
						);
					}
				}

				// Set up default 404 page
				if (!options.disableDefault404) {
					if (verbose) {
						GhostRouteLogger.info(
							c.bold(c.cyan("Setting up default 404 page")),
						);
					}
					injectRoute({
						pattern: "/404",
						entrypoint: `${name}/404.astro`,
						prerender: true,
					});
				} else {
					if (verbose) {
						GhostRouteLogger.info(
							c.gray("Default 404 page is disabled, Skipping..."),
						);
					}
				}

				// Add virtual imports for user configuration
				addVirtualImports({
					"virtual:@matthiesenxyz/astro-ghostcms/config": `export default ${JSON.stringify(
						options,
					)}`,
				});

				// Add types for user configuration
				addDts({
					name: "@matthiesenxyz/astro-ghostcms/config",
					content: `declare module "virtual:@matthiesenxyz/astro-ghostcms/config" {
                        const Config: import("../schemas/userconfig").GhostUserConfig;
                        export default Config;
                    }`,
				});
			},
			"astro:config:done": ({ logger }) => {
				const GhostLogger = logger.fork(
					`${c.bold(c.blue("👻 Astro-GhostCMS"))}${c.gray("/")}${c.green(
						"CONFIG",
					)}`,
				);
				GhostLogger.info(
					c.bold(c.green("Integration Setup & Configuration Complete")),
				);
			},
			"astro:server:start": async ({ logger }) => {
				const GhostLogger = logger.fork(
					`${c.bold(c.blue("👻 Astro-GhostCMS"))}${c.gray("/")}${c.bold(
						c.green("DEV"),
					)}`,
				);
				const GhostUpdateLogger = logger.fork(
					`${c.bold(c.blue("👻 Astro-GhostCMS"))}${c.gray("/")}${c.bold(
						c.green("VERSION CHECK"),
					)}`,
				);

				// Start the DEV server
				GhostLogger.info(
					c.bold(c.magenta("Running Astro-GhostCMS in Deveopment mode 🚀")),
				);

				// Check for updates
				const currentNPMVersion = await latestVersion(
					"@matthiesenxyz/astro-ghostcms",
				);
				const packageJson = await fse.readJson(
					path.resolve(fileURLToPath(import.meta.url), "../../package.json"),
				);
				const localVersion = packageJson.version;

				if (currentNPMVersion !== localVersion) {
					GhostUpdateLogger.warn(
						`\n${c.bgYellow(
							c.bold(
								c.black(
									" There is a new version of Astro-GhostCMS available! ",
								),
							),
						)}\n${
							c.bold(c.white(" Current Installed Version: ")) +
							c.bold(c.red(`${localVersion} `))
						} \n ${c.bold(c.white("New Available Version: "))} ${c.green(
							currentNPMVersion,
						)} \n ${c.bold(
							c.white(
								"Please consider updating to the latest version by running: ",
							),
						)} ${c.bold(
							c.green("npm i @matthiesenxyz/astro-ghostcms@latest"),
						)} \n`,
					);
				} else {
					GhostUpdateLogger.info(
						c.bold(c.green(`Astro-GhostCMS is up to date! v${localVersion}`)),
					);
				}
			},
			"astro:build:done": ({ logger }) => {
				const GhostLogger = logger.fork(
					`${c.bold(c.blue("👻 Astro-GhostCMS"))}${c.gray("/")}${c.bold(
						c.green("BUILD"),
					)}`,
				);
				GhostLogger.info(
					c.bold(c.magenta("Running Astro-GhostCMS in Production mode 🚀")),
				);
			},
		};
	},
});
