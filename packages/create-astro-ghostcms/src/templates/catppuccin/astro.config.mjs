import tailwind from "@astrojs/tailwind";
import ghostcms from "@matthiesenxyz/astro-ghostcms";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://example.xyz/",
	integrations: [
		tailwind(),
		ghostcms({
			theme: "@matthiesenxyz/astro-ghostcms-catppuccin",
			ghostURL: "https://ghostdemo.matthiesen.xyz",
		}),
	],
});
