# Welcome to Astro-GhostCMS

This addon uses the `@tryghost/content-api` and creates astro friendly functions to interface between ghost and astro.

*This package contains a independent copy of the tryghost content-api.js that is used to establish the connection so this package dose not depend on `@tryghost/content-api` package.*

## Astro Integration Mode *(Planned for V2)*

This is coming soon.  And will allow the user to utilize the prebuilt astro-ghostcms-basetheme to be integrated through this main project.  This feature is not yet setup or integrated.  If you want a easy quick and simple deploy please copy this Template Repo, [astro-ghostcms-basetheme](https://github.com/MatthiesenXYZ/astro-ghostcms-basetheme) This will get you setup and ready to deploy in minutes using this addon!

## Manual Installation

```
npm i @matthiesenxyz/astro-ghostcms
```

Must create `.env` with the following:

```env
CONTENT_API_KEY=
CONTENT_API_URL=
```

**When you deploy your install dont forget to set the above ENVIRONMENT VARIABLES!**

Astro minimum Version: **Astro v4.0**

Dependencies:
- **Axios v1.0** *Will be auto installed*
- **Typescript v5.3.3** *Will be auto installed*

## Function Usage Examples:

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
