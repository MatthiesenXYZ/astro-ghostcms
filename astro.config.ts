import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import GhostCMS from './index';

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap(), GhostCMS()],
});
