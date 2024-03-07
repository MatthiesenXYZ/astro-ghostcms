---
"@matthiesenxyz/astro-ghostcms": minor
---

This is a HUGE internal update, Our integration is now built on [`Astro-Integration-Kit`](https://github.com/florian-lefebvre/astro-integration-kit) to give better control over the entire `Astro-GhostCMS` Eco-System.

# Breaking Changes:
- NEW USER CONFIG! Some of the options have changed! Please check the Readme for a current version of the available options!
- Thats it! Some how even though this is almost an entire rebuild, There is no other USER breaking changes aside from the new more advanced config!

# Updates:
- Moved from `@ts-ghost/core-api` to `@ts-ghost/content-api` as it provides the same functions as the standard core-api but pre-wrapped with a nice `HTTPClientFactory` instead of `HTTPClient`.
- Updated a ton of Dependencies that Dependabot was reporting as needed updated.
