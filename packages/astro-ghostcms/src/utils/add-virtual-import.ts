/** MIT License

Copyright (c) 2024 Florian Lefebvre

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */
import type { HookParameters } from "astro";
import type { Plugin } from "vite";
import { addVitePlugin } from "./add-vite-plugin.js";

const resolveVirtualModuleId = <T extends string>(id: T): `\0${T}` => {
	return `\0${id}`;
};

const createVirtualModule = (name: string, content: string): Plugin => {
	const pluginName = `vite-plugin-${name}`;

	return {
		name: pluginName,
		resolveId(id) {
			if (id === name) {
				return resolveVirtualModuleId(id);
			}
		},
		load(id) {
			if (id === resolveVirtualModuleId(name)) {
				return content;
			}
		},
	};
};

/**
 * Creates a Vite virtual module and updates the Astro config.
 * Virtual imports are useful for passing things like config options, or data computed within the integration.
 *
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.content
 * @param {import("astro").HookParameters<"astro:config:setup">["updateConfig"]} params.updateConfig
 *
 * @see https://astro-integration-kit.netlify.app/utilities/add-virtual-import/
 *
 * @example
 * ```ts
 * // my-integration/index.ts
 * import { addVirtualImport } from "astro-integration-kit";
 *
 * addVirtualImport(
 *   name: 'virtual:my-integration/config',
 *   content: `export default ${ JSON.stringify({foo: "bar"}) }`,
 *   updateConfig
 * );
 * ```
 *
 * This is then readable anywhere else in your integration:
 *
 * ```ts
 * // myIntegration/src/component/layout.astro
 * import config from "virtual:my-integration/config";
 *
 * console.log(config.foo) // "bar"
 * ```
 */
export const addVirtualImport = ({
	name,
	content,
	updateConfig,
}: {
	name: string;
	content: string;
	updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
}) => {
	addVitePlugin({
		plugin: createVirtualModule(name, content),
		updateConfig,
	});
};