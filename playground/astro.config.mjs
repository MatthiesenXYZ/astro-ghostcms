import { defineConfig } from "astro/config";
import ghostcms from "@matthiesenxyz/astro-ghostcms";

// https://astro.build/config
export default defineConfig({
	site: "https://demo.astro-ghostcms.xyz/",
	integrations: [ 
		ghostcms({
			disableConsoleOutput: true,
			disableRouteInjection: false,
			theme: "@matthiesenxyz/astro-ghostcms-theme-default",
			ghostURL: "https://ghostdemo.matthiesen.xyz",
		})
	],
});
