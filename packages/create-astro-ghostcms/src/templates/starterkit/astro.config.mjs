import GhostCMS from '@matthiesenxyz/astro-ghostcms';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    // CHANGE THIS TO MATCH YOUR EXTERNAL DOMAIN
    site: "http://localhost:4321",
    integrations: [
        // Includes GhostCMS API, @astrojs/rss, @astrojs/sitemap, and astro-robots-txt
        GhostCMS({
            // This Option Disables all default theme injection and allows DIY mode.
            disableRouteInjection: true,
            // Enable this to disable the extra console logs
            disableConsoleOutput: false
        })
    ]
});
