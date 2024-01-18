import type { AstroIntegration } from "astro"
import { SafeParseError, SafeParseSuccess, ZodError } from "astro/zod"
import { UserConfigSchema, type UserConfig } from "./src/utils/UserConfigSchema"

export default function GhostCMS(options: UserConfig): AstroIntegration {
    return {
        name: '@matthiesenxyz/astro-ghostcms',
        hooks: {
            'astro:config:setup': async ({
                injectRoute,
                logger,
            }) => {
                
                const o = UserConfigSchema.safeParse(options || {}) as SafeParseSuccess<UserConfig>

                if (!o.success) {
                    const validationError = fromZodError((o as unknown as SafeParseError<UserConfig>).error)

                    logger.error(`Config Error - ${ validationError }`)

                    throw validationError
                }

                const entry = o.data.theme

                logger.info("Injecting Route: /")
                injectRoute({
                    pattern: '/',
                    entrypoint: `${entry}/index.astro`
                })

                logger.info("Injecting Route: /[slug]")
                injectRoute({
                    pattern: '/[slug]',
                    entrypoint: `${entry}/[slug].astro`
                })

                logger.info("Injecting Route: /tags")
                injectRoute({
                    pattern: '/tags',
                    entrypoint: `${entry}/tags.astro`
                })

                logger.info("Injecting Route: /authors")
                injectRoute({
                    pattern: '/authors',
                    entrypoint: `${entry}/authors.astro`
                })

                logger.info("Injecting Route: /tag/[slug]")
                injectRoute({
                    pattern: '/tag/[slug]',
                    entrypoint: `${entry}/tag/[slug].astro`
                })

                logger.info("Injecting Route: /author/[slug]")
                injectRoute({
                    pattern: '/author/[slug]',
                    entrypoint: `${entry}/author/[slug].astro`
                })
                logger.info("Injecting Route: /archives/[...page]")
                injectRoute({
                    pattern: '/archives/[...page]',
                    entrypoint: `${entry}/archives/[...page].astro`
                })

            },
            'astro:config:done': async ({ logger }) => {
                logger.info('GhostCMS Routes Injected.  Integration is now ready.')
            }
        }
    }
}

function fromZodError(error: ZodError<{ theme: string }>) {
    throw new Error("Function not implemented.")
}
