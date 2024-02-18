import { defineConfig } from "astro/config";
import ghostcms from "@matthiesenxyz/astro-ghostcms";
import UnoCSS from 'unocss/astro';

// https://astro.build/config
export default defineConfig({
	site: "https://example.xyz/",
	trailingSlash: 'ignore',
	integrations: [
		UnoCSS({ injectReset: true }),
		ghostcms({
			theme: "@matthiesenxyz/astro-ghostcms-brutalbyelian",
			ghostURL: "https://ghostdemo.matthiesen.xyz",
		})
	],
});
