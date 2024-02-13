# Astro GhostCMS Content API HTML Processor

Render remote GhostCMS HTML in Astro with full control over the output.

Powered by [`ultrahtml`](https://github.com/natemoo-re/ultrahtml).

## Rendering Remote Content

The most basic function of `astro-ghostcms-rendercontent` is to convert a string of HTML to Astro friendly HTML. Use the `GhostRender` component.

```astro
---
import { GhostRender } from "@matthiesenxyz/astro-ghostcms-rendercontent";
---

<GhostRender content={post.html} />
```

### Customization

`GhostRender` allows full control over the rendering of output. The `components` option allows you to replace a standard HTML element with a custom component.

```astro
---
import { GhostRender } from "@matthiesenxyz/astro-ghostcms-rendercontent";
import Title from '../components/Title.astro';
---

<!-- Render <h1> as custom <Title> component -->
<GhostRender content={post.html} components={{ h1: Title }} />
```

For examples on how to setup custom components check [examples](./examples/)