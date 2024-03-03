import { createResolver, defineIntegration } from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { z } from "astro/zod";
import c from "picocolors";

export default defineIntegration({
    name: "@matthiesenxyz/astro-ghostcms-themeprovider",
    optionsSchema: z.object({
        theme: z.string().optional().default("@matthiesenxyz/astro-ghostcms-theme-default"),
		verbose: z.boolean().optional().default(false),
    }),
    plugins: [...corePlugins],
    setup({ options }) {
        const { resolve } = createResolver(import.meta.url);

        return {
            "astro:config:setup": ({ 
                watchIntegration,
                injectRoute,
                logger 
            }) => {
                watchIntegration(resolve())

				const themeLogger = logger.fork(`${c.bold(c.blue('👻 Astro-GhostCMS'))}${c.gray("/")}${c.blue('Theme Provider')}`);

                themeLogger.info(c.bold(c.magenta('Theme Provider enabled. Setting up...')))

				if ( options.verbose) {
					if ( options.theme === "@matthiesenxyz/astro-ghostcms-theme-default" ) {
						themeLogger.info(c.blue('No theme is set, injecting default theme'))
					} else {
						themeLogger.info(`${c.bold(c.cyan("Injecting Theme:"))} ${c.bold(c.underline(c.magenta(options.theme)))}`)
					}
				}

				injectRoute({
					pattern: "/",
					entrypoint: `${options.theme}/index.astro`,
				});

                injectRoute({
					pattern: "/[slug]",
					entrypoint: `${options.theme}/[slug].astro`,
				});

				injectRoute({
					pattern: "/tags",
					entrypoint: `${options.theme}/tags.astro`,
				});

				injectRoute({
					pattern: "/authors",
					entrypoint: `${options.theme}/authors.astro`,
				});

				injectRoute({
					pattern: "/tag/[slug]",
					entrypoint: `${options.theme}/tag/[slug].astro`,
				});

				injectRoute({
					pattern: "/author/[slug]",
					entrypoint: `${options.theme}/author/[slug].astro`,
				});

				injectRoute({
					pattern: "/archives/[...page]",
					entrypoint: `${options.theme}/archives/[...page].astro`,
    			});

            },
            "astro:config:done": ({ logger }) => {
				const themeLogger = logger.fork(`${c.bold(c.blue('👻 Astro-GhostCMS'))}${c.gray("/")}${c.blue('Theme Provider')}`);

				if ( options.verbose ) {
                	themeLogger.info(c.bold(c.green('Provider Setup Complete')))
				}
			}
        }
    }
})