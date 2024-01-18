import type { AstroIntegration } from "astro"

export default function GhostCMS(): AstroIntegration {
    return {
        name: '@matthiesenxyz/astro-ghostcms',
        hooks: {
            'astro:config:setup': async ({
                injectRoute,
                logger,
            }) => {

                logger.info("Injecting Route: /")

                injectRoute({
                    pattern: '/',
                    entrypoint: '@matthiesenxyz/astro-ghostcms/index.astro'
                })

                logger.info("Injecting Route: /[slug]")

                injectRoute({
                    pattern: '/[slug]',
                    entrypoint: '@matthiesenxyz/astro-ghostcms/[slug].astro'
                })

                logger.info("Injecting Route: /tags")

                injectRoute({
                    pattern: '/tags',
                    entrypoint: '@matthiesenxyz/astro-ghostcms/tags.astro'
                })

                logger.info("Injecting Route: /authors")

                injectRoute({
                    pattern: '/authors',
                    entrypoint: '@matthiesenxyz/astro-ghostcms/authors.astro'
                })

                logger.info("Injecting Route: /tag/[slug]")

                injectRoute({
                    pattern: '/tag/[slug]',
                    entrypoint: '@matthiesenxyz/astro-ghostcms/tag/[slug].astro'
                })

                logger.info("Injecting Route: /author/[slug]")

                injectRoute({
                    pattern: '/author/[slug]',
                    entrypoint: '@matthiesenxyz/astro-ghostcms/author/[slug].astro'
                })

                logger.info("Injecting Route: /archives/[...page]")

                injectRoute({
                    pattern: '/archives/[...page]',
                    entrypoint: '@matthiesenxyz/astro-ghostcms/archives/[...page].astro'
                })

                },
            'astro:config:done': async ({
                config,
                logger,
            }) => {
                if (config.output === "server"){
                    logger.error("This integration is not yet ready to be used in 'output: server' mode, to prevent issues please switch to static.")
                } else if (config.output === "hybrid"){
                    logger.error("This integration is not yet ready to be used in 'output: hybrid' mode, to prevent issues please switch to static.")
                }else {
                    logger.info('GhostCMS Routes Injected.  Integration is now ready.')
                }
            }
        }
    }
}