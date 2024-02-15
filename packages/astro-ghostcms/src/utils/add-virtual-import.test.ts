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
import { type Mock, afterEach, describe, expect, test, vi } from "vitest";
import { addVirtualImport } from "./add-virtual-import.js";
import { addVitePlugin } from "./add-vite-plugin.js";

vi.mock("./add-vite-plugin");

const pluginNameStub = <T extends string>(name: T): `vite-plugin-${T}` =>
	`vite-plugin-${name}`;

describe("add-virtual-import", () => {
	const name = "test-module";
	const content = "export default {}";

	afterEach(() => {
		vi.clearAllMocks();
	});

	test("It should call `addVitePlugin`", () => {
		const updateConfig = vi.fn();

		addVirtualImport({
			name,
			content,
			updateConfig,
		});

		expect(addVitePlugin).toHaveBeenCalled();
	});

	test("`addVitePlugin` should get called with the correct plugin name", () => {
		const updateConfig = vi.fn();

		addVirtualImport({
			name,
			content,
			updateConfig,
		});

		const expectedName = pluginNameStub(name);

		const { plugin } = (addVitePlugin as Mock).mock.lastCall[0];

		expect(plugin.name).toEqual(expectedName);
	});

	test("Virtual module should resolve correct name", () => {
		const updateConfig = vi.fn();

		addVirtualImport({
			name,
			content,
			updateConfig,
		});

		const { plugin } = (addVitePlugin as Mock).mock.lastCall[0];

		const resolvedVirtualModuleId = plugin.resolveId(name);

		expect(resolvedVirtualModuleId).toEqual(`\0${name}`);
	});
});
