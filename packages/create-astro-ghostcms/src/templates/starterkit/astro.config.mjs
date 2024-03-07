import GhostCMS from "@matthiesenxyz/astro-ghostcms";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	// CHANGE THIS TO MATCH YOUR EXTERNAL DOMAIN
	site: "http://localhost:4321",
	integrations: [
		// Includes GhostCMS API, @astrojs/rss, @astrojs/sitemap, and astro-robots-txt
		GhostCMS({
			ghostURL: "https://ghostdemo.matthiesen.xyz",
			ThemeProvider: {
				disableThemeProvider: true,
			},
			disableDefault404: true,
			enableRSSFeed: false,
			enableOGImages: false,
			verbose: false,
		}),
	],
});
