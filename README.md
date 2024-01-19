# Welcome to Astro-GhostCMS

- [Live Demo](https://demo.astro-ghostcms.xyz/) of the Astro-GhostCMS integration in action!
- [Live Demo - Unlighthouse Test](https://test.demo.astro-ghostcms.xyz) for a Automatically updated Lighthouse test from every deploy!
- [Live Demo's Repo](https://github.com/MatthiesenXYZ/astro-ghostcms-demo) for an example of how the setup looks.

Astro minimum Version: **Astro v4.0**

This Integration is 2 parts.  Firstly, there is the API portion that uses the `@tryghost/content-api` to create the link between astro and GhostCMS.  From there we move to the Second Part, which is a theme pre-programmed to pull ALL of its data from GhostCMS iteself instead of storing any data locally outside of Build.

- *This package contains a independent copy of the tryghost content-api.js that is used to establish the connection so this package dose not depend on `@tryghost/content-api` package.*
- If you are looking for a more Customizable option please check [astro-ghostcms-basetheme](https://github.com/MatthiesenXYZ/astro-ghostcms-basetheme) 
- This project is not setup for SSR in Integration mode.  As such is will most likely not function properly in that mode. You will need to build your own project around the API or customize the *basetheme* linked above.

# Astro Integration Mode

In this mode, the addon will not be just an API, but will be a full Route takeover, there is plans to add more themes in time, but for now there is only the base Casper theme based on Ghost's main Theme.

## Astro Add Installation

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
import sitemap from "@astrojs/sitemap"; //optional but recommended
import GhostCMS from '@matthiesenxyz/astro-ghostcms';

// https://astro.build/config
export default defineConfig({
  site: "https://YOUR-DOMAIN-HERE.com"
  integrations: [sitemap(), GhostCMS()],
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
| `/[slug]`             | Post or Page                              |
| `/author/[slug]`      | Author page with related posts            |
| `/authors`            | All the authors                           |
| `/tag[slug]`          | Tag page with related posts               |
| `/tags`               | All the tags                              |
| `/archives/[...page]` | All the posts, paginated                  |


# Manual Function Mode (DIY MODE)

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

For more information please check our website: [Astro-GhostCMS.xyz](https://astro-ghostcms.xyz)
