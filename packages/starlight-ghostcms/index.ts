import type { StarlightPlugin, StarlightUserConfig } from '@astrojs/starlight/types'
import type { AstroIntegrationLogger } from 'astro'
import { type StarlightGhostConfig, validateConfig } from './src/schemas/config'
import { vitePluginStarlightGhostConfig } from './src/integrations/vite'
import { facebook, getSettings, invariant, twitter } from './src/utils/api'

const settings = await getSettings()

export type { StarlightGhostConfig }

export default function starlightGhostCMS(userConfig?: StarlightGhostConfig): StarlightPlugin {
    const config: StarlightGhostConfig = validateConfig(userConfig)
    invariant(settings, "Settings not available... check your api key/url")

    return {
      name: '@matthiesenxyz/starlight-ghostcms-plugin',
      hooks: {
        setup({ astroConfig, addIntegration, config: starlightConfig, logger, updateConfig: updateStarlightConfig }) {
            updateStarlightConfig({
                social: {
                    ...starlightConfig.social,
                    rss: `${astroConfig.site}/rss.xml`,
                    twitter: twitter(settings.twitter?settings.twitter:""),
                    facebook: facebook(settings.facebook?settings.facebook:""),
                },
                components: {
                    ...starlightConfig.components,
                    ...overrideStarlightComponent(starlightConfig.components, logger, 'MarkdownContent'),
                    ...overrideStarlightComponent(starlightConfig.components, logger, 'Sidebar'),
                    ...overrideStarlightComponent(starlightConfig.components, logger, "SiteTitle"),
                }
            })

            addIntegration({
                name: '@matthiesenxyz/starlight-ghostcms',
                hooks: {
                    'astro:config:setup': ({ injectRoute, updateConfig }) => {
                        injectRoute({
                            pattern: '/blog',
                            entrypoint: '@matthiesenxyz/starlight-ghostcms/routes/index.astro',
                            prerender: true,
                        })
                        injectRoute({
                            pattern: '/blog/[slug]',
                            entrypoint: '@matthiesenxyz/starlight-ghostcms/routes/[slug].astro',
                            prerender: true,
                        })
                        injectRoute({
                            pattern: '/blog/about',
                            entrypoint: '@matthiesenxyz/starlight-ghostcms/routes/about.astro',
                            prerender: true,
                        })
                        injectRoute({
                            pattern: '/blog/authors',
                            entrypoint: '@matthiesenxyz/starlight-ghostcms/routes/authors.astro',
                        })
                        injectRoute({
                            pattern: '/rss.xml',
                            entrypoint: '@matthiesenxyz/starlight-ghostcms/routes/rss.xml.ts'
                        })

                        updateConfig({
                            vite: {
                                plugins: [vitePluginStarlightGhostConfig(config)],
                            },
                        })
                    }
                }
            })
        }
      },
    }
}

function overrideStarlightComponent(
    components: StarlightUserConfig['components'],
    logger: AstroIntegrationLogger,
    component: keyof NonNullable<StarlightUserConfig['components']>,
  ) {
    if (components?.[component]) {
      logger.warn(`It looks like you already have a \`${component}\` component override in your Starlight configuration.`)
      logger.warn(`To use \`starlight-ghostcms\`, remove the override for the \`${component}\` component.\n`)
      logger.warn("This Warning can be ignored if you know what your doing ;)")
  
      return {}
    }
  
    return {
      [component]: `@matthiesenxyz/starlight-ghostcms/overrides/${component}.astro`,
    }
  }