import ghostcms from "@matthiesenxyz/astro-ghostcms";
import { defineConfig } from "astro/config";
//import tailwind from "@astrojs/tailwind";
import UnoCSS from "unocss/astro";

// https://astro.build/config
export default defineConfig({
	site: "https://demo.astro-ghostcms.xyz/",
	integrations: [
		//tailwind(),
		UnoCSS({ injectReset: true }),
		ghostcms({
			ghostURL: "https://ghostdemo.matthiesen.xyz",
			ThemeProvider: {
				theme: "@matthiesenxyz/astro-ghostcms-brutalbyelian",
			},
			fullConsoleLogs: true,
		}),
	],
});
