import starlight from "@astrojs/starlight";
import starlightGhostCMS from "@matthiesenxyz/starlight-ghostcms";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "http://localhost:4321",
	integrations: [
		starlight({
			title: "My Docs",
			plugins: [
				starlightGhostCMS({
					ghostURL: "https://ghostdemo.matthiesen.xyz",
					title: "Demo Blog",
					rssDescription: "Starlight Playground",
					route: "blog",
				}),
			],
			social: {
				github: "https://github.com/withastro/starlight",
			},
			sidebar: [
				{
					label: "Guides",
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: "Example Guide", link: "/guides/example/" },
					],
				},
				{
					label: "Reference",
					autogenerate: { directory: "reference" },
				},
			],
		}),
	],
});
