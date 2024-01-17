# Welcome to Astro-GhostCMS

Astro minimum Version: **Astro v4.0**

This addon uses the `@tryghost/content-api` and creates astro friendly functions to interface between ghost and astro.

*This package contains a independent copy of the tryghost content-api.js that is used to establish the connection so this package dose not depend on `@tryghost/content-api` package.*

## Astro Integration Mode

In this mode, the addon will not be just an API, but will be a full Route takeover, there is plans to add more themes in time, but for now there is only the base Casper theme based on Ghost's main Theme.

```
# NOT READY YET DO NOT USE
astro add @matthiesenxyz/astro-ghostcms
```

## Manual Installation

```
npm i @matthiesenxyz/astro-ghostcms
```

Must create `.env` with the following:

```env
CONTENT_API_KEY=a33da3965a3a9fb2c6b3f63b48
CONTENT_API_URL=https://ghostdemo.matthiesen.xyz
```

**When you deploy your install dont forget to set the above ENVIRONMENT VARIABLES!**

## Manual Function Usage Examples:

### getGhostPosts() - Get list of posts

```astro
---
// IMPORT {GET} GhostPosts Function
import { getGhostPosts } from '@matthiesenxyz/astro-ghostcms';
// GET LIST OF ALL POSTS
const ghostPosts = await getGhostPosts();
---
```

### getGhostRecentPosts(setLimit?) - Get Recent Posts (setLimit={6})

```astro
---
// IMPORT {GET} GhostFeaturedPosts Function
import { getGhostRecentPosts } from "@matthiesenxyz/astro-ghostcms";
// CREATE INTERFACE TO PASS 'setLimit' for POST LIMIT
interface Props { 
  setLimit?:number;
}
// IF 'setLimit' IS NOT DEFINED AS PROP THEN MAKE IT DEFAULT TO 'undefined'
const { setLimit = undefined } = Astro.props 
// GET POSTS with Limit
const ghostPosts = await getGhostRecentPosts(setLimit);
---
```

### getGhostFeaturedPosts(setLimit?) - Get Featured Posts (setLimit={1})

```astro
---
// IMPORT {GET} GhostFeaturedPosts Function
import { getGhostFeaturedPosts } from "@matthiesenxyz/astro-ghostcms";
// CREATE INTERFACE TO PASS 'setLimit' for POST LIMIT
interface Props { 
  setLimit?:number;
}
// IF 'setLimit' IS NOT DEFINED AS PROP THEN MAKE IT DEFAULT TO 'undefined'
const { setLimit = undefined } = Astro.props 
// GET POSTS with Limit
const ghostPosts = await getGhostFeaturedPosts(setLimit);
---
```

### getGhostPostbySlug(slug) - Get Post by Slug

```astro
---
// IMPORT {GET} GhostPostbySlug Function
import  { getGhostPostbySlug }  from '@matthiesenxyz/astro-ghostcms';
// GET SLUG from /blog/[slug]
const { slug } = Astro.params;
// GET CURRENT POST BY PASSING SLUG TO FUNCTION
const ghostPost = await getGhostPostbySlug(slug);
---
```

### getGhostPostsbyTag(slug) - Get Posts list by Tag slug

```astro
---
// IMPORT {GET} GhostPostsbyTag, and GhostTagbySlug Functions
import { getGhostPostsbyTag, getGhostTagbySlug } from '@matthiesenxyz/astro-ghostcms';
// GET SLUG from /blog/tag/[slug]
const { slug } = Astro.params;
// GET TAG BY SLUG TO DISPLAY TAG INFO
const ghostTag = await getGhostTagbySlug(slug);
// GET POSTS FILTERED BY TAG SLUG
const ghostPosts = await getGhostPostsbyTag(slug)
---
```

### getGhostTags() - Get list of tags

```astro
---
// IMPORT {GET} GhostTags Function
import { getGhostTags } from "@matthiesenxyz/astro-ghostcms";
// GET LIST OF ALL TAGS
const ghostTags = await getGhostTags();
---
```

### getGhostAuthors() - Get list of Authors

```astro
---
// IMPORT {GET} GhostAuthors Function
import { getGhostAuthors } from "@matthiesenxyz/astro-ghostcms";
// GET LIST OF ALL AUTHORS
const ghostAuthors = await getGhostAuthors();
---
```

### getGhostPages() - Get list of Pages

```astro
---
// IMPORT {GET} GhostAuthors Function
import { getGhostPages } from "@matthiesenxyz/astro-ghostcms";
// GET LIST OF ALL AUTHORS
const ghostPages = await getGhostPages();
---
```

### getGhostPage(slug) - Get page by slug

```astro
---
// IMPORT {GET} GhostPostbySlug Function
import  { getGhostPage }  from '@matthiesenxyz/astro-ghostcms';
// GET SLUG from /blog/[slug]
const { slug } = Astro.params;
// GET CURRENT POST BY PASSING SLUG TO FUNCTION
const ghostpage = await getGhostPage(slug);
---
```

### getGhostSettings() - Get Settings for GhostCMS

```astro
---
// IMPORT {GET} GhostAuthors Function
import { getGhostSettings } from "@matthiesenxyz/astro-ghostcms";
// GET LIST OF ALL AUTHORS
const ghostSettings = await getGhostSettings();
---
```
