import ghostcms from "@matthiesenxyz/astro-ghostcms";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://demo.astro-ghostcms.xyz/",
	integrations: [
		ghostcms({
			ghostURL: 'https://ghostdemo.matthiesen.xyz',
			ThemeProvider: {
				theme: "@matthiesenxyz/astro-ghostcms-catppuccin",
				astroRemote: {
					enable: true,
				},
			},
			verbose: true,
		}),
	],
});
