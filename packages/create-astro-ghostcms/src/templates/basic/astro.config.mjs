import GhostCMS from "@matthiesenxyz/astro-ghostcms";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com/",
	integrations: [
		GhostCMS({
			ghostURL: "https://ghostdemo.matthiesen.xyz",
		}),
	],
});
