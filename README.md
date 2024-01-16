# Welcome to Astro-GhostCMS

This addon uses the `@tryghost/content-api` and creates astro friendly functions to interface between ghost and astro.

This package contains a independent copy of the tryghost content-api.js that is used to establish the connection so this package dose not depend on `@tryghost/content-api` package.

## Installation

```
npm i @matthiesenxyz/astro-ghostcms
```

Must create `.env` with the following:

```env
CONTENT_API_KEY=
CONTENT_API_URL=
```

Astro minimum Version: **Astro v4.0**

Dependencies:
- **Axios v1.0** *Will be auto installed*
- **Typescript v5.3.3** *Will be auto installed*

## Work In Progress README (*More Information will be provided as time goes on...*)

Basic Usage:

```
import { getGhostPosts } from "@matthiesenxyz/astro-ghostcms";
```

- getGhostPosts() - Get list of posts
- getGhostRecentPosts(setLimit?) - Get Recent Posts (setLimit={6})
- getGhostFeaturedPosts(setLimit?) - Get Featured Posts (setLimit={1})
- getGhostPostbySlug(slug) - Get Post by Slug
- getGhostPostsbyTag(slug) - Get Posts list by Tag slug
- getGhostTags() - Get list of tags
- getGhostTagbySlug(slug) - Get Tag by slug
- getGhostAuthors() - Get list of Authors
- getGhostPages() - Get list of Pages
- getGhostPage(slug) - Get page by slug
- getGhostSettings() - Get Settings for GhostCMS