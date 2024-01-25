import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import { ExpressiveCodeTheme } from '@astrojs/starlight/expressive-code';
import starlight from "@astrojs/starlight";

const houstonFile = './houston-vscode.jsonc';
const houston = fs.readFileSync(
  new URL(houstonFile, import.meta.url),'utf-8');
const houstonTheme = ExpressiveCodeTheme.fromJSONString(houston);

// https://astro.build/config
export default defineConfig({
  site: 'https://astro-ghostcms.xyz',
  integrations: [
    starlight({
      title: 'Astro-GhostCMS',
      logo: {
        src: './src/assets/favicon.svg'
      },
      favicon: 'favicon.svg',
      customCss: [ './src/styles/starlight.css' ],
      expressiveCode: { themes: [ houstonTheme ] },
      social: {
        github: 'https://github.com/MatthiesenXYZ/astro-ghostcms',
      },
      sidebar: [
        { label: 'Docs Home', link: '/docs/' },
        { label: 'Introduction', items: [
            { label: 'Getting Started', link: '/docs/introduction/getting-started' },
            { label: 'Integration Mode', items: [
              { label: 'Quick Install', link: '/docs/introduction/integration/quick' },
              { label: 'Manual Install', link: '/docs/introduction/integration/manual' },
              { label: 'Configuration Options', link: '/docs/introduction/integration/config',
                badge: { text: 'BETA', variant: 'caution' }, }, ], },
            { label: 'API ( DIY ) Mode', items: [
                { label: 'Install', link: '/docs/introduction/api/install' },
                { label: 'Basic API Usage', link: '/docs/introduction/api/usage' }, ], }, ], },
        { label: 'Default Theme Usage', autogenerate: { directory: 'docs/theme-default'}, },
        { label: 'Tutorials', autogenerate: { directory: 'docs/tutorials' }, },
        { label: 'Reference', autogenerate: { directory: 'docs/reference' }, },
      ],
    }),
  ],
});