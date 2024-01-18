import type { AstroIntegration } from "astro"

export default function GhostCMS(): AstroIntegration {
    return {
        name: '@matthiesenxyz/astro-ghostcms',
        hooks: {
            'astro:config:setup': async ({
                injectRoute,
                logger,
            }) => {
                
                injectRoute({
                    pattern: '/',
                    entrypoint: '@matthiesenxyz/astro-ghostcms/index.astro'
                })

                injectRoute({
                    pattern: '/[slug]',
                    entrypoint: '@matthiesenxyz/astro-ghostcms/[slug].astro'
                })

                injectRoute({
                    pattern: '/tags',
                    entrypoint: '@matthiesenxyz/astro-ghostcms/tags.astro'
                })

                injectRoute({
                    pattern: '/authors',
                    entrypoint: '@matthiesenxyz/astro-ghostcms/authors.astro'
                })

                injectRoute({
                    pattern: '/tag/[slug]',
                    entrypoint: '@matthiesenxyz/astro-ghostcms/tag/[slug].astro'
                })

                injectRoute({
                    pattern: '/author/[slug]',
                    entrypoint: '@matthiesenxyz/astro-ghostcms/author/[slug].astro'
                })

                injectRoute({
                    pattern: '/archives/[...page]',
                    entrypoint: '@matthiesenxyz/astro-ghostcms/archives/[...page].astro'
                })

                logger.info('Astro GhostCMS Plugin Loaded!')
            }
        }
    }
}