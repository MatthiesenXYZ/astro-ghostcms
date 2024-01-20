import type { AstroConfig, ViteUserConfig } from 'astro'
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { UserConfig } from './UserConfigSchema'

function resolveVirtualModuleId<T extends string>(id: T): `\0${T}` {
	return `\0${id}`
}

export function viteGhostCMS(
	opts: UserConfig,
	{
		root,
	}: Pick<AstroConfig, 'root' | 'srcDir' | 'trailingSlash'> & {
		build: Pick<AstroConfig['build'], 'format'>
	}
): NonNullable<ViteUserConfig['plugins']>[number] {
	const resolveId = (id: string) =>
		JSON.stringify(id.startsWith('.') ? resolve(fileURLToPath(root), id) : id);

    const modules = {
        'virtual:@matthiesenxyz/astro-ghostcms/user-config': `export default ${ JSON.stringify(opts) }`
    } satisfies Record<string, string>

    /** Mapping names prefixed with `\0` to their original form. */
	const resolutionMap = Object.fromEntries(
		(Object.keys(modules) as (keyof typeof modules)[]).map((key) => [
			resolveVirtualModuleId(key),
			key,
		])
	)

    return {
		name: 'vite-plugin-matthiesenxyz-astro-ghostcms-user-config',
		resolveId(id): string | void {
			if (id in modules) return resolveVirtualModuleId(id)
		},
		load(id): string | void {
			const resolution = resolutionMap[id]
			if (resolution) return modules[resolution]
		},
	}
}