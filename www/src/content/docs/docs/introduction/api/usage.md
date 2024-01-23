---
title: API Only Mode - Basic Usage
description: API Only Mode - Basic Usage
---

## Manual Function Usage Examples:

### getGhostPosts() - Get list of posts

```astro frame="code" title="getGhostPosts()"
---
// IMPORT {GET} GhostPosts Function
import { getGhostPosts } from '@matthiesenxyz/astro-ghostcms/api';
// GET LIST OF ALL POSTS
const ghostPosts = await getGhostPosts();
---
```

### getGhostRecentPosts(setLimit?) - Get Recent Posts (setLimit={6})

```astro frame="code" title="getGhostRecentPosts()"
---
// IMPORT {GET} GhostFeaturedPosts Function
import { getGhostRecentPosts } from "@matthiesenxyz/astro-ghostcms/api";
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

```astro frame="code" title="getGhostFeaturedPosts()"
---
// IMPORT {GET} GhostFeaturedPosts Function
import { getGhostFeaturedPosts } from "@matthiesenxyz/astro-ghostcms/api";
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

```astro frame="code" title="getGhostPostbySlug()"
---
// IMPORT {GET} GhostPostbySlug Function
import  { getGhostPostbySlug }  from '@matthiesenxyz/astro-ghostcms/api';
// GET SLUG from /blog/[slug]
const { slug } = Astro.params;
// GET CURRENT POST BY PASSING SLUG TO FUNCTION
const ghostPost = await getGhostPostbySlug(slug);
---
```

### getGhostPostsbyTag(slug) - Get Posts list by Tag slug

```astro frame="code" title="getGhostPostbyTag()"
---
// IMPORT {GET} GhostPostsbyTag, and GhostTagbySlug Functions
import { getGhostPostsbyTag, getGhostTagbySlug } from '@matthiesenxyz/astro-ghostcms/api';
// GET SLUG from /blog/tag/[slug]
const { slug } = Astro.params;
// GET TAG BY SLUG TO DISPLAY TAG INFO
const ghostTag = await getGhostTagbySlug(slug);
// GET POSTS FILTERED BY TAG SLUG
const ghostPosts = await getGhostPostsbyTag(slug)
---
```

### getGhostTags() - Get list of tags

```astro frame="code" title="getGhostTag()"
---
// IMPORT {GET} GhostTags Function
import { getGhostTags } from "@matthiesenxyz/astro-ghostcms/api";
// GET LIST OF ALL TAGS
const ghostTags = await getGhostTags();
---
```

### getGhostAuthors() - Get list of Authors

```astro frame="code" title="getGhostAuthors()"
---
// IMPORT {GET} GhostAuthors Function
import { getGhostAuthors } from "@matthiesenxyz/astro-ghostcms/api";
// GET LIST OF ALL AUTHORS
const ghostAuthors = await getGhostAuthors();
---
```

### getGhostPages() - Get list of Pages

```astro frame="code" title="getGhostPages()"
---
// IMPORT {GET} GhostAuthors Function
import { getGhostPages } from "@matthiesenxyz/astro-ghostcms/api";
// GET LIST OF ALL AUTHORS
const ghostPages = await getGhostPages();
---
```

### getGhostPage(slug) - Get page by slug

```astro frame="code" title="getGhostPage()"
---
// IMPORT {GET} GhostPostbySlug Function
import  { getGhostPage }  from '@matthiesenxyz/astro-ghostcms/api';
// GET SLUG from /blog/[slug]
const { slug } = Astro.params;
// GET CURRENT POST BY PASSING SLUG TO FUNCTION
const ghostpage = await getGhostPage(slug);
---
```

### getGhostSettings() - Get Settings for GhostCMS

```astro frame="code" title="getGhostSettings()"
---
// IMPORT {GET} GhostAuthors Function
import { getGhostSettings } from "@matthiesenxyz/astro-ghostcms/api";
// GET LIST OF ALL AUTHORS
const ghostSettings = await getGhostSettings();
---
```