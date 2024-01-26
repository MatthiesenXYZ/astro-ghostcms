import { defineConfig } from 'astro/config';
import GhostCMS from "@matthiesenxyz/astro-ghostcms";

// https://astro.build/config
export default defineConfig({
  site: "https://demo.astro-ghostcms.xyz/",
  integrations: [GhostCMS({
    ghostURL: 'https://ghostdemo.matthiesen.xyz'
  })]
});
