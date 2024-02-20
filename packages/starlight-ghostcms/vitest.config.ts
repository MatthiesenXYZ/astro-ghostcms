/// <reference types="vitest" />
/// <reference types="vite/client" />

import tsconfigPaths from "vite-tsconfig-paths";
import { defineProject } from "vitest/config";

export default defineProject({
	plugins: [tsconfigPaths()],
	test: {
		globals: true,
		include: ["./**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		watchExclude: [".*\\/node_modules\\/.*", ".*\\/build\\/.*"],
		exclude: ["node_modules", "dist", ".idea", ".git", ".cache"],
	},
});
