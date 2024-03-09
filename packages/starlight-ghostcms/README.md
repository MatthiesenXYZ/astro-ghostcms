<img src="https://ghostdemo.matthiesen.xyz/content/images/size/w50/2024/01/logo-1.png" width="64px" />

# Welcome to Starlight-GhostCMS by [Astro-GhostCMS](https://astro-ghostcms.xyz)

Starlight-GhostCMS is a [Starlight](https://starlight.astro.build/) plugin to add a blog to your documentation site.

- Customizable Header link *(Defaults to "Blog")*
- Pulls all the Posts from your GhostCMS install
- Pulls all Authors & Featured Images and adds then to your Posts
- Creates a custom section on your website linkable from the Header

For a full always up to date documentation please checkout [Our Website](https://astro-ghostcms.xyz)

- [Starlight GhostCMS Demo](https://starlightdemo.astro-ghostcms.xyz/)
- [Astro-GhostCMS Website](https://astro-ghostcms.xyz) Check the website for the most up-to-date Documentation!
- [Ghost.org](https://ghost.org) Get your own Ghost[^1] Install

*Need help but don't have Github? Email us at [issues@astro-ghostcms.xyz](mailto:issues@astroghostcms.xyz) to create an issue here on github! Or join our [Discord](https://discord.gg/u7NZqUyeAR)*

Astro minimum Version: **Starlight v0.19 & Astro v4**

## Installation

### Prerequisites: 

1. You will need to have a Starlight Website Setup.  If you dont have one yet, you can follow the ["Getting Started"](https://starlight.astro.build/getting-started) guide in the Starlight docs to create one.
2. You will need a GhostCMS server, and your `CONTENT_API_KEY` & `CONTENT_API_URL`.  Your GhostCMS server must also support the `v5` Version of the GhostAPI.  If you dont already have your Key and Url, you can find out how to get those on the Ghost docs [HERE](https://ghost.org/docs/content-api/)

### Install the plugin

Starlight GhostCMS is a Starlight [plugin](https://starlight.astro.build/reference/plugins/).  Install it using your favorite package manager.  Below is 3 examples of what to run.  **CHOOSE ONE**.

```
npm install @matthiesenxyz/starlight-ghostcms
pnpm add @matthiesenxyz/starlight-ghostcms
yarn add @matthiesenxyz/starlight-ghostcms
```

### Configure the pluign

The Starlight GhostCMS plugin can be configured in your Starlight [configuration](https://starlight.astro.build/reference/configuration/#plugins) in the `astro.config.mjs` file.

```ts
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightGhostCMS from '@matthiesenxyz/starlight-ghostcms';

export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightGhostCMS({
          ghostURL: "https://ghostdemo.matthiesen.xyz"
        })
      ],
      title: 'My Docs',
    }),
  ],
})
```

### Set your GhostCMS ENV Variables

You must also create 2 environment variables in a `.env` file with the following:

```env
CONTENT_API_KEY=a33da3965a3a9fb2c6b3f63b48
CONTENT_API_URL=https://ghostdemo.matthiesen.xyz // ghostURL option in `astro.config.mjs` will take priority. (This is fallback option)
GITHUB_PERSONAL_TOKEN=ghp_ //OPTIONAL - This is for Astro-Gists if you choose to use it!
```

**When you deploy your install dont forget to set the above ENVIRONMENT VARIABLES on your provider!**


For more information and to see the docs please check our website: [Astro-GhostCMS.xyz](https://astro-ghostcms.xyz)

# Foot Notes & Credits

[^1]: Ghost.org, Ghost.io, Ghost are all trademarks of [The Ghost Foundation](https://ghost.org/). This project is Open Source and not directly related to or provided by The Ghost Foundation and is intended to help create a easier method to utilize their provided JavaScript tools to link a Headless GhostCMS install in to your Astro project.

