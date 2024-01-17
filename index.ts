import type { AstroIntegration } from "astro"

export default function GhostCMS(): AstroIntegration {
    return {
        name: 'astro-ghostcms',
        hooks: {
            'astro:config:setup': async ({
                injectRoute,
                logger,
            }) => {
                
                injectRoute({
                    pattern: '/',
                    entrypoint: './src/routes/index.astro'
                })

                injectRoute({
                    pattern: '/[slug]',
                    entrypoint: './src/routes/[slug].astro'
                })

                injectRoute({
                    pattern: '/tags',
                    entrypoint: './src/routes/tags.astro'
                })

                injectRoute({
                    pattern: '/authors',
                    entrypoint: './src/routes/authors.astro'
                })

                injectRoute({
                    pattern: '/tag/[slug]',
                    entrypoint: './src/routes/tag/[slug].astro'
                })

                injectRoute({
                    pattern: '/author/[slug]',
                    entrypoint: './src/routes/author/[slug].astro'
                })

                injectRoute({
                    pattern: '/archives/[...page]',
                    entrypoint: './src/routes/archives/[...page].astro'
                })

                logger.info('Astro GhostCMS Plugin Loaded!')
            }
        }
    }
}