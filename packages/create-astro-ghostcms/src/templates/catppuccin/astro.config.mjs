import tailwind from "@astrojs/tailwind";
import astroGhostCMS from "@matthiesenxyz/astro-ghostcms";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://example.xyz/",
	integrations: [
		tailwind(),
		astroGhostCMS({
			ghostURL: "https://ghostdemo.matthiesen.xyz",
			ThemeProvider: {
				theme: "@matthiesenxyz/astro-ghostcms-catppuccin",
			},
		}),
	],
});
