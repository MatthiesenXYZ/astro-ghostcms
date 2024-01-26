import { defineConfig } from "astro/config";
import ghostcms from "@matthiesenxyz/astro-ghostcms";

// https://astro.build/config
export default defineConfig({
	site: "https://demo.astro-ghostcms.xyz/",
	integrations: [ ghostcms({
		ghostURL: "https://ghostdemo.matthiesen.xyz"
	})],
});
