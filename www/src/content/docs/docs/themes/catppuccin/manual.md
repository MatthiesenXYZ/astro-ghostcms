---
title: Manual Install
description: How to install the Catppuccin theme
---

[Demo](https://catppuccindark-demo.astro-ghostcms.xyz/)

## Install

```sh
# For fresh Install
npm create astro@latest
# Create Empty Install with standard typescript
# Then Delete entire `pages` folder under `/src/`

# Then run the following:

npx astro add @matthiesenxyz/astro-ghostcms tailwind

npm i @matthiesenxyz/astro-ghostcms/astro-ghostcms-catppuccin
```

Then set your `astro.config.ts` to look like this:

```ts frame="code" title="astro.config.ts"
import { defineConfig } from "astro/config";
import ghostcms from "@matthiesenxyz/astro-ghostcms";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	site: "https://YOURDOMAINHERE.com/",
	integrations: [tailwind(),
		ghostcms({
			theme: "@matthiesenxyz/astro-ghostcms-catppuccin",
			ghostURL: "https://ghostdemo.matthiesen.xyz",
		})
	],
});
```

## Setup Tailwind

There are multiple color options with Catppuccin.  This theme defaults to one of the 3 darker themes.  The themes in order are 

- Latte (Light) 
- Frappe (Light Dark)
- Macchiato (Dark Light) *DEFAULT*
- Mocha (Darkest)

### To use Default options just call the theme's Node Module

```ts frame="code" title="tailwind.config.cjs"
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@matthiesenxyz/astro-ghostcms-catppuccin')] 
};
```

### To use Specific options call the theme's Node Module `/` the color option lowercase

```ts frame="code" title="tailwind.config.cjs"
/** @type {import('tailwindcss').Config} */
module.exports = {
	// OTHER OPTIONS ARE: `/frappe`, `/macchiato`, or `/mocha`
	presets: [require('@matthiesenxyz/astro-ghostcms-catppuccin/latte')] 
};
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
