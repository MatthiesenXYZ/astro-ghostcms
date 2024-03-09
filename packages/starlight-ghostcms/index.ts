import type { StarlightPlugin, StarlightUserConfig } from "@astrojs/starlight/types";
import type { AstroIntegrationLogger } from "astro";
import { type StarlightGhostConfig, validateConfig } from "./src/schemas/config";
import starlightGhostcms from "./src/integrations/starlight-ghostcms";

export type { StarlightGhostConfig };

export default function starlightGhostCMS(
	userConfig?: StarlightGhostConfig,
): StarlightPlugin {
	const config: StarlightGhostConfig = validateConfig(userConfig);

	return {
		name: "@matthiesenxyz/starlight-ghostcms-plugin",
		hooks: {
			setup({
				astroConfig,
				addIntegration,
				config: starlightConfig,
				logger,
				updateConfig: updateStarlightConfig,
			}) {
				// Add the Starlight-GhostCMS integration
				addIntegration(starlightGhostcms(config));

				// Update the Starlight config with the GhostCMS config
				updateStarlightConfig({
					social: {
						...starlightConfig.social,
						...overrideRSS(starlightConfig.social, astroConfig.site),
					},
					components: {
						...starlightConfig.components,
						...overrideStarlightComponent(
							starlightConfig.components,
							logger,
							"MarkdownContent",
						),
						...overrideStarlightComponent(
							starlightConfig.components,
							logger,
							"Sidebar",
						),
						...overrideStarlightComponent(
							starlightConfig.components,
							logger,
							"SiteTitle",
						),
					},
				});
			},
		},
	};
}


function overrideRSS(
	socials: StarlightUserConfig["social"], 
	url: string | undefined
	) { 
		if (socials?.rss) { return {}; }
		if (url === undefined) { return undefined; }
		return { rss: `${url}/rss.xml` };
}

function overrideStarlightComponent(
	components: StarlightUserConfig["components"],
	logger: AstroIntegrationLogger,
	component: keyof NonNullable<StarlightUserConfig["components"]>,
) {
	if (components?.[component]) {
		logger.warn(
			`It looks like you already have a \`${component}\` component override in your Starlight configuration.`,
		);
		logger.warn(
			`To use \`starlight-ghostcms\`, remove the override for the \`${component}\` component.\n`,
		);
		logger.warn("This Warning can be ignored if you know what your doing ;)");

		return {};
	}

	return {
		[component]: `@matthiesenxyz/starlight-ghostcms/overrides/${component}.astro`,
	};
}
