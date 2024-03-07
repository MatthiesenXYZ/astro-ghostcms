import astroGhostCMS from "@matthiesenxyz/astro-ghostcms";
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";

// https://astro.build/config
export default defineConfig({
	site: "https://example.xyz/",
	trailingSlash: "ignore",
	integrations: [
		UnoCSS({ injectReset: true }),
		astroGhostCMS({
			ghostURL: "https://ghostdemo.matthiesen.xyz",
			ThemeProvider: {
				theme: "@matthiesenxyz/astro-ghostcms-brutal",
			},
		}),
	],
});
