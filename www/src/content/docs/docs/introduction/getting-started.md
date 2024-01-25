---
title: Getting Started with Astro-GhostCMS
description: Getting Started
---


- [Live Demo](https://demo.astro-ghostcms.xyz/) of the Astro-GhostCMS integration in action!
- [Live Demo - Unlighthouse Test](https://test.demo.astro-ghostcms.xyz) for a Automatically updated Lighthouse test from every deploy!
- [Live Demo's Repo](https://github.com/MatthiesenXYZ/astro-ghostcms/tree/main/demo) for an example of how the setup looks.

Astro minimum Version: **Astro v4.0**

This Integration is 2 parts.  Firstly, there is the API portion that uses the `@tsghost/core-api` to create the link between astro and GhostCMS.  From there we move to the Second Part, which is a theme pre-programmed to pull ALL of its data from GhostCMS iteself instead of storing any data locally outside of Build.

- If you are looking for a more Customizable option please check [astro-ghostcms-basetheme](https://github.com/MatthiesenXYZ/astro-ghostcms-basetheme) 
- The default theme is not setup for SSR in Integration mode.  As such is will most likely not function properly in that mode. You will need to build your own project around the API or customize the *basetheme* linked above.
