// Node Modules
import path from "node:path";
import { fileURLToPath } from "node:url";
import fse from "fs-extra";

// Utils
import { createResolver, defineIntegration } from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { AstroError } from "astro/errors";
import c from "picocolors";
import { loadEnv } from "vite";
import latestVersion from "./utils/latestVersion";

// External Integrations
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";

import ghostRSS from "./integrations/rssfeed";
// Internal Integrations
import ghostOGImages from "./integrations/satoriog";
import ghostThemeProvider from "./integrations/themeprovider";

// Load environment variables
const ENV = loadEnv("all", process.cwd(), "CONTENT_API");

// Import User Configuration Zod Schema
import { GhostUserConfigSchema } from "./schemas/userconfig";
import type { string } from "astro/zod";

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
				// Set up verbose logging
				const verbose = options.verbose;
				// Configure Loggers
				const GhostLogger = logger.fork(c.bold(c.blue("👻 Astro-GhostCMS")));
				const GhostENVLogger = logger.fork(
					`${c.bold(c.blue("👻 Astro-GhostCMS"))}${c.gray("/")}${c.blue(
						"ENV Check",
					)}`,
				);
				// Configure Integration Loggers & verbose logging
				const GhostIntegrationLogger = logger.fork(
					`${c.bold(c.blue("👻 Astro-GhostCMS"))}${c.gray("/")}${c.blue(
						"Integrations",
					)}`,
				);
				const intLogInfo = (message:string) => {
					if (verbose) {
						GhostIntegrationLogger.info(message);
					}
				};

				// Configure Route Logger & verbose logging
				const GhostRouteLogger = logger.fork(
					`${c.bold(c.blue("👻 Astro-GhostCMS"))}${c.gray("/")}${c.blue(
						"Router",
					)}`,
				);
				const routeLogInfo = (message:string) => {
					if (verbose) {
						GhostRouteLogger.info(message);
					}
				};


				// Setup Watch Integration for Hot Reload during DEV
				watchIntegration(resolve());
				GhostLogger.info("Initializing @matthiesenxyz/astro-ghostcms...");


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
				if (!options.ThemeProvider?.disableThemeProvider) {
					addIntegration(
						ghostThemeProvider({
							theme: options.ThemeProvider?.theme,
							verbose,
						}),
					);
				} else {
					intLogInfo(c.gray("Theme Provider is disabled"));
				}

				// Satori OG Images
				if (options.enableOGImages) {
					addIntegration(ghostOGImages({ verbose }));
				} else {
					intLogInfo(c.gray("OG Image Provider is disabled"));
				}

				// RSS Feed
				if (options.enableRSSFeed) {
					addIntegration(ghostRSS({ verbose }));
				} else {
					intLogInfo(c.gray("RSS Feed is disabled"));
				}

				// @ASTROJS/SITEMAP
				if (!hasIntegration("@astrojs/sitemap")) {
					intLogInfo(c.bold(c.magenta(`Adding ${c.blue("@astrojs/sitemap")} integration`)));
					addIntegration(sitemap(options.Integrations?.sitemap));
				} else {
					intLogInfo(c.gray("@astrojs/sitemap integration already exists, skipping..."));
				}
				// ASTRO-ROBOTS-TXT
				if (!hasIntegration("astro-robots-txt")) {
					intLogInfo(c.bold(c.magenta(`Adding ${c.blue("astro-robots-txt")} integration`)));
					addIntegration(robotsTxt(options.Integrations?.robotsTxt));
				} else {
					intLogInfo(c.gray("astro-robots-txt integration already exists, skipping..."));
				}

				// Set up default 404 page
				if (!options.disableDefault404) {
					routeLogInfo(c.bold(c.cyan("Setting up default 404 page")));
					injectRoute({
						pattern: "/404",
						entrypoint: `${name}/404.astro`,
						prerender: true,
					});
				} else {
					routeLogInfo(c.gray("Default 404 page is disabled, Skipping..."));
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
				// Configure Loggers
				const GhostLogger = logger.fork(
					`${c.bold(c.blue("👻 Astro-GhostCMS"))}${c.gray("/")}${c.green(
						"CONFIG",
					)}`,
				);

				// Log Configuration Complete
				GhostLogger.info(
					c.bold(c.green("Integration Setup & Configuration Complete")),
				);
			},
			"astro:server:start": async ({ logger }) => {
				// Configure Loggers
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

				// Get the latest version of Astro-GhostCMS
				const currentNPMVersion = await latestVersion(
					"@matthiesenxyz/astro-ghostcms",
				);

				// Get the local version of Astro-GhostCMS
				const packageJson = await fse.readJson(
					path.resolve(fileURLToPath(import.meta.url), "../../package.json"),
				);
				const localVersion = packageJson.version;

				// Log the version check
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
				// Configure Loggers
				const GhostLogger = logger.fork(
					`${c.bold(c.blue("👻 Astro-GhostCMS"))}${c.gray("/")}${c.bold(
						c.green("BUILD"),
					)}`,
				);

				// Log Build Complete
				GhostLogger.info(
					c.bold(c.magenta("Running Astro-GhostCMS in Production mode 🚀")),
				);
			},
		};
	},
});
