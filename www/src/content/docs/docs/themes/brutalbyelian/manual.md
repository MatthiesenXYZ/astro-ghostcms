---
title: Manual Install
description: How to install the Brutal by Elian Theme
---

[Demo](https://brutal-demo.astro-ghostcms.xyz/)

## Install

```sh
# For fresh Install
npm create astro@latest
# Create Empty Install with standard typescript
# Then Delete entire `pages` folder under `/src/`

# Then run the following:

npx astro add @matthiesenxyz/astro-ghostcms

npm i @matthiesenxyz/astro-ghostcms/astro-ghostcms-brutalbyelian @unocss/astro

npm i -D @unocss/reset postcss unocss
```

Then set your `astro.config.ts` to look like this:

```ts frame="code" title="astro.config.ts"
import { defineConfig } from "astro/config";
import ghostcms from "@matthiesenxyz/astro-ghostcms";
import UnoCSS from 'unocss/astro';

// https://astro.build/config
export default defineConfig({
	site: "https://YOURDOMAINHERE.com/",
	trailingSlash: 'ignore',
	integrations: [
		UnoCSS({ injectReset: true }),
		ghostcms({
			theme: "@matthiesenxyz/astro-ghostcms-catppuccin",
			ghostURL: "https://ghostdemo.matthiesen.xyz",
		})
	],
});
```

## Setup UnoCSS

```ts frame="code" title="uno.config.ts"
import brutalTheme from '@matthiesenxyz/astro-ghostcms-brutalbyelian';
import { defineConfig } from 'unocss';

export default defineConfig({
  presets: [ brutalTheme() ],
});

```

## Setup `.env` variables

```ansi frame="code" title=".env"
[1;31mCONTENT_API_KEY[0m=[33ma33da3965a3a9fb2c6b3f63b48
```

***When you deploy your install dont forget to set the above ENVIRONMENT VARIABLES!***

## Created Routes

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
