import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import ghostcms from "@matthiesenxyz/astro-ghostcms";

// https://astro.build/config
export default defineConfig({
	site: "https://demo.astro-ghostcms.xyz/",
	integrations: [tailwind(),
		ghostcms({
			disable404: false,
			disableRSS: false,
			disableRouteInjection: false,
			disableConsoleOutput: false,
			theme: "@matthiesenxyz/astro-ghostcms-theme-catpuccin-dark",
			ghostURL: "https://ghostdemo.matthiesen.xyz",
		})
	],
});
