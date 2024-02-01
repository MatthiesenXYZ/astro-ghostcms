import { defineConfig } from "astro/config";
import ghostcms from "@matthiesenxyz/astro-ghostcms";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	site: "https://catppuccindark-demo.astro-ghostcms.xyz/",
	integrations: [tailwind(),
		ghostcms({
			theme: "@matthiesenxyz/astro-ghostcms-catppuccin",
			ghostURL: "https://ghostdemo.matthiesen.xyz",
		})
	],
});
