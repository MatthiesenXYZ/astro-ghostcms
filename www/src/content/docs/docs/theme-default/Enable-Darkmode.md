---
title: Enable Darkmode
description: How to enable Dark-Mode on the default theme
---

*Requires `@matthiesenxyz/astro-ghostcms` version 0.1.1 and above*

To enable darkmode on your Astro-Ghost install for the basic theme all you have to do is add a Code_Injection to the Site Header.  Dont know how to do that?  No Problem!  Just look below

- To get started Login to your GhostCMS Admin Dashboard.
- Click the Settings Icon on the bottom left next to your Avatar.
- Scroll down to `Avanced` > `Code injection` and click Open
- In the Site header tab paste the following:

```
<script>document.documentElement.classList.add('dark-mode');</script>
<script>
  document.addEventListener('astro:after-swap', () => {
    document.documentElement.classList.add('dark-mode');
  });
</script>
```

The Above script will enable darkmode, and make it persist with Astro View Transitions.