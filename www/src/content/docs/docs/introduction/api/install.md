---
title: API Only Mode - Install
description: API Only Mode - Install
---

# API Mode Install

In this mode the integration will not deploy routes at all.  you will have to build your own website to utilize the exported functions listed below.

```sh
npm i @matthiesenxyz/astro-ghostcms
```

You must also create 2 environment variables in a `.env` file with the following:

```ansi frame="code" title=".env"
[1;31mCONTENT_API_KEY[0m=[33ma33da3965a3a9fb2c6b3f63b48
[1;31mCONTENT_API_URL[0m=[33mhttps://ghostdemo.matthiesen.xyz
```

***When you deploy your install dont forget to set the above ENVIRONMENT VARIABLES!***

Then Change your astro config option in `astro.config.ts` to looks like this:

```ts frame="code" title="astro.config.ts"
import { defineConfig } from "astro/config";
import GhostCMS from '@matthiesenxyz/astro-ghostcms';

export default defineConfig({
  site: "https://YOUR-DOMAIN-HERE.com",
  // THIS WILL DISABLE DEFAULT ROUTE INJECT
  integrations: [ GhostCMS({ disableRouteInjection: true })],
});
```