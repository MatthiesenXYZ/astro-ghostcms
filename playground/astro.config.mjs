import { defineConfig } from "astro/config";
import ghostcms from "@matthiesenxyz/astro-ghostcms";
//import tailwind from "@astrojs/tailwind";
import UnoCSS from 'unocss/astro';

// https://astro.build/config
export default defineConfig({
	site: "https://demo.astro-ghostcms.xyz/",
	integrations: [
		//tailwind(),
		UnoCSS({ injectReset: true }),
		ghostcms({
			disable404: false,
			disableRSS: false,
			disableRouteInjection: false,
			disableConsoleOutput: false,
			theme: "@matthiesenxyz/astro-ghostcms-brutalbyelian",
			ghostURL: "https://ghostdemo.matthiesen.xyz",
		})
	],
});
