import fse from "fs-extra";
import { createResolver, defineIntegration } from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { AstroError } from "astro/errors";
import type { AstroIntegration } from "astro";
import c from "picocolors";
import { loadEnv } from "vite";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";

// Internal Imports
import { GhostUserConfigSchema } from "./schemas/userconfig";
import ghostRSS from "./integrations/rssfeed";
import ghostOGImages from "./integrations/satoriog";
import ghostThemeProvider from "./integrations/themeprovider";
import latestVersion from "./utils/latestVersion";

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
				injectRoute,
				logger,
			}) => {
				// Set up verbose logging
				const verbose = options.verbose;

				// Configure Loggers
				const GhostLogger = logger.fork(c.bold(c.blue("👻 Astro-GhostCMS")));

				const loggerTagged = (message: string) => {
					return logger.fork(`${c.bold(c.blue("👻 Astro-GhostCMS"))}${c.gray("/")}${c.blue(message)}`)
				}

				// Configure ENV Logger
				const GhostENVLogger = loggerTagged("ENV Check");

				// Configure Integration Loggers & verbose logging
				const GhostIntegrationLogger = loggerTagged("Integrations");

				// Configure Route Logger & verbose logging
				const GhostRouteLogger = loggerTagged("Router");

				// Log Info Helper
				const intLogInfo = (message:string) => {
					if (verbose) {
						GhostIntegrationLogger.info(message);
					}
				};

				// Log Route Info Helper
				const routeLogInfo = (message:string) => {
					if (verbose) {
						GhostRouteLogger.info(message);
					}
				};

				// Local Integration Helper
				const localIntegration = (enabled: boolean, name: string, integration: AstroIntegration) => {
					if (enabled) {
						addIntegration(integration);
					} else {
						intLogInfo(c.gray(`${name} integration is disabled`));
					}
				}
				
				// Check External Integration Helper
				const checkIntegration = (name: string, integration: AstroIntegration) => {
					if (!hasIntegration(name)) {
						intLogInfo(c.bold(c.magenta(`Adding ${c.blue(name)} integration`)));
						addIntegration(integration);
					} else {
						intLogInfo(c.gray(`${name} integration already exists, skipping...`));
					}
				}

				// Inject Route Helper
				const routeHelper = (routename: string, enabled: boolean, pattern: string, entrypoint: string) => {
					if (enabled) {
						routeLogInfo(c.bold(c.cyan(`Setting up ${routename} route`)));
						injectRoute({
							pattern: pattern,
							entrypoint: `${name}${entrypoint}`,
							prerender: true,
						});
					} else {
						routeLogInfo(c.gray(`${routename} route is disabled, Skipping...`));
					}
				}

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

				// Check for GhostCMS API Key
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

				// Check for GhostCMS URL
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

				// Setup GhostCMS Theme Provider
				localIntegration(
					!options.ThemeProvider.disableThemeProvider,
					"Theme Provider",
					ghostThemeProvider({
						theme: options.ThemeProvider.theme,
						verbose,
					})
				);

				// Setup GhostCMS OG Image Provider
				localIntegration(
					options.enableOGImages,
					"Satori OG Images",
					ghostOGImages({ verbose })
				);
				
				// Setup GhostCMS RSS Feed Provider
				localIntegration(
					options.enableRSSFeed,
					"RSS Feed",
					ghostRSS({ verbose })
				);

				// Setup @astrojs/sitemap Integration
				checkIntegration(
					"@astrojs/sitemap",
					sitemap(options.Integrations.sitemap)
					);

				// Setup astro-robots-txt Integration
				checkIntegration(
					"astro-robots-txt", 
					robotsTxt(options.Integrations.robotsTxt)
					);

				// Setup Default 404 Page
				routeHelper(
					"Default 404 Page",
					!options.disableDefault404,
					"/404",
					"/404.astro"
				);

				// Add virtual imports for user configuration
				addVirtualImports({
					"virtual:@matthiesenxyz/astro-ghostcms/config": `export default ${JSON.stringify(
						options,
					)}`,
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
				const loggerTagged = (message: string) => {
					return logger.fork(`${c.bold(c.blue("👻 Astro-GhostCMS"))}${c.gray("/")}${c.green(message)}`)
				}
				// Configure Loggers
				const GhostLogger = loggerTagged("DEV");

				const GhostUpdateLogger = loggerTagged("VERSION CHECK");

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
				const packageJson = await fse.readJson(resolve("../package.json"));
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
