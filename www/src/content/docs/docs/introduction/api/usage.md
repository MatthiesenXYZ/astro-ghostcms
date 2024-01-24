---
title: API Only Mode - Basic Usage
description: API Only Mode - Basic Usage
---

## Manual Function Usage Examples:

### getBlogPosts

```astro frame="code" title="getBlogPosts()"
---
import { getPosts } from '@matthiesenxyz/astro-ghostcms/api';

const dateOptions = {year:"numeric",month:"long",day:"numeric"}
const posts = await getPosts()
---
{ posts?.map((post) => (
		<a href={`/${post.slug}`}>
			<article class="">
				<Image
					src={post.feature_image}
					alt={post.title}
					width={post.feature_image.width}
					class=""/>
				<h2 class="">{post.title}</h2>

				<p class="">{post.excerpt}</p>
				<p class="">
					{new Date(post.published_at).toLocaleDateString( "en-US",dateOptions )}
				</p>
			</article>
		</a>
	))
}
```