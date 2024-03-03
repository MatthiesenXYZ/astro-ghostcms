import type { ViteUserConfig } from "astro";

import type { StarlightGhostConfig } from "../schemas/config.ts";

// Expose the starlight-blog plugin configuration.
export function vitePluginStarlightGhostConfig(
	config: StarlightGhostConfig,
): VitePlugin {
	const moduleId = "virtual:starlight-ghost-config";
	const resolvedModuleId = `\0${moduleId}`;
	const moduleContent = `export default ${JSON.stringify(config)}`;

	return {
		name: "vite-plugin-starlight-ghost-config",
		load(id) {
			return id === resolvedModuleId ? moduleContent : undefined;
		},
		resolveId(id) {
			return id === moduleId ? resolvedModuleId : undefined;
		},
	};
}

type VitePlugin = NonNullable<ViteUserConfig["plugins"]>[number];
