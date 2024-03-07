<img src="https://ghostdemo.matthiesen.xyz/content/images/size/w50/2024/01/logo-1.png" width="64px" />

# Welcome to Astro-GhostCMS

*Ghost is a trademark of [The Ghost Foundation](https://ghost.org/trademark/). This project is not directly related to or provided by The Ghost Foundation and is intended to help create a easier method to utilize their provided API to link a Headless GhostCMS install in to your Astro project.* 

Want to Chat?  Join our [Discord](https://discord.gg/u7NZqUyeAR)

For a full always up to date documentation please checkout [Our Website](https://astro-ghostcms.xyz)

- [Default Theme Demo](https://demo.astro-ghostcms.xyz)
- [Catppuccin Dark Demo](https://catppuccindark-demo.astro-ghostcms.xyz/)
- [Astro-GhostCMS Website](https://astro-ghostcms.xyz) Check the website for the most up-to-date Documentation!
- [Ghost.org](https://ghost.org) Get your own Ghost[^1] Install

*Need help but don't have Github? Email us at [issues@astro-ghostcms.xyz](mailto:issues@astroghostcms.xyz) to create an issue here on github!*

Astro minimum Version: **Astro v4.0**

This Integration is 2 parts.  Firstly, there is the API portion that uses the `@ts-ghost/core-api`[^1] to create the link between astro and GhostCMS.  From there we move to the Second Part, which is a theme pre-programmed to pull ALL of its data from GhostCMS[^1] iteself instead of storing any data locally outside of Build.

- *This package contains a independent copy of the tryghost content-api.js[^1] that is used to establish the connection so this package dose not depend on `@ts-ghost/core-api` package.[^1]*
- If you are looking for a more Customizable option please check [astro-ghostcms-basetheme](https://github.com/MatthiesenXYZ/astro-ghostcms-basetheme) 
- This project is not setup for SSR in Integration mode.  As such is will most likely not function properly in that mode. You will need to build your own project around the API or customize the *basetheme* linked above.

## Astro Integration Mode

In this mode, the addon will not be just an API, but will be a full Route takeover, there is plans to add more themes in time, but for now there is only the base Casper theme based on Ghost's main Theme.

### Astro Add Installation

```sh
# For fresh Install
npm create astro@latest
# Create Empty Install with standard typescript
# Then Delete entire `pages` folder under `/src/`
npx astro add @matthiesenxyz/astro-ghostcms
```
#### Dont forget to set your environment Variables!

You must also create 2 environment variables in a `.env` file with the following:

```env
CONTENT_API_KEY=a33da3965a3a9fb2c6b3f63b48
CONTENT_API_URL=https://ghostdemo.matthiesen.xyz
```
## Manual Installation

```
npm i @matthiesenxyz/astro-ghostcms
```

Then set your astro.config.ts to look like this:

```ts
import { defineConfig } from "astro/config";
import GhostCMS from '@matthiesenxyz/astro-ghostcms';

// https://astro.build/config
export default defineConfig({
  site: "https://YOUR-DOMAIN-HERE.com"
  integrations: [
    GhostCMS({
      // Config Options
      ghostURL: "http://example.com", // Recommended to set here, Can also set in .env as CONTENT_API_URL
      ThemeProvider: { // Allows you to pass config options to our ThemeProvider if enabled.
        disableThemeProvider: false, // OPTIONAL - Default False
        theme: "@matthiesenxyz/astro-ghostcms-theme-default", // OPTIONAL - Default Theme shown.
      };
      disableDefault404: false, // Allows the user to disable the default `/404 page, to be able to create their own under `/src/pages/404.astro`.
      enableRSSFeed: true, // Allows the user to Enable or disable RSS Feed Generation. Default: true
      enableOGImages: true, // Allows the user to Enable or disable OG Image Generation. Default: true
      verbose: false, // Show the full Log output from All parts of Astro-GhostCMS
      Integrations: {
        // This allows user config passthrough from Astro-GhostCMS to the Included Integrations
        robotsTxt: {
          // OPTIONAL
          // ADVANCED USAGE - https://www.npmjs.com/package/astro-robots-txt#configuration
        }, 
        sitemap: {
          // OPTIONAL
          // ADVANCED USAGE - https://docs.astro.build/en/guides/integrations-guide/sitemap
        },
      },
    })
  ],
});
```

#### Dont forget to set your environment Variables!

You must also create 2 environment variables in a `.env` file with the following:

```env
CONTENT_API_KEY=a33da3965a3a9fb2c6b3f63b48
CONTENT_API_URL=https://ghostdemo.matthiesen.xyz
```

**When you deploy your install dont forget to set the above ENVIRONMENT VARIABLES!**

#### Created Routes

The routes are the same as a standard Ghost Blog so you can migrate to Astro easily.

| Route                 | Content                                   |
| --------------------- | ----------------------------------------- |
| `/`                   | Homepage with recents/features Blog Posts |
| `/404`                | 404 Page                                  |
| `/[slug]`             | Post or Page                              |
| `/author/[slug]`      | Author page with related posts            |
| `/authors`            | All the authors                           |
| `/tag[slug]`          | Tag page with related posts               |
| `/tags`               | All the tags                              |
| `/archives/[...page]` | All the posts, paginated                  |
| `/rss.xml`            | All the posts, in a FEED                  |


## Manual Function Mode (DIY MODE)

In this mode the integration will not deploy routes at all.  you will have to build your own website to utilize the exported functions listed below.

```
npm i @matthiesenxyz/astro-ghostcms
```

You must also create 2 environment variables in a `.env` file with the following:

```env
CONTENT_API_KEY=a33da3965a3a9fb2c6b3f63b48
CONTENT_API_URL=https://ghostdemo.matthiesen.xyz
```

**When you deploy your install dont forget to set the above ENVIRONMENT VARIABLES!**

For more information and to see the docs please check our website: [Astro-GhostCMS.xyz](https://astro-ghostcms.xyz)

# Foot Notes & Credits

[^1]: Ghost.org, Ghost.io, Ghost are all trademarks of [The Ghost Foundation](https://ghost.org/). This project is Open Source and not directly related to or provided by The Ghost Foundation and is intended to help create a easier method to utilize their provided JavaScript tools to link a Headless GhostCMS install in to your Astro project.
