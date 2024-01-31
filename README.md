<img src="https://repository-images.githubusercontent.com/742727289/d4fb3f65-0d5f-4a1a-9f8b-9b3e2dc90bde" />

Want to Chat?  Join our [Discord](https://discord.gg/u7NZqUyeAR)

For a full always up to date documentation please checkout [Our Website](https://astro-ghostcms.xyz)

- [Default Theme Demo](https://demo.astro-ghostcms.xyz)
- [Catppuccin Dark Demo](https://catppuccindark-demo.astro-ghostcms.xyz/)

## Quick Start

```sh
# Its easy run this command and follow the prompt!
npx @matthiesenxyz/create-astro-ghostcms
```

## Our Supporters:

Want to be listed here? by name or logo? [Signup Here](https://www.buymeacoffee.com/adammatthiesen/membership) for an Astro-GhostCMS Suppoter Membership *(Silver and up get listed here)* Also All Suppoter Memberships get a Discord rank!

## Repo Structure

This repo is structured as a `pnpm` monorepo.  All of our packages can be found under the `packages/` folder.  These are all internal packages or independently published that can be found on [npmjs.com](https://npmjs.com)

In this Repo you will find the Following:

- `demo`: [Demo Site](https://demo.astro-ghostcms.xyz)
- `www`: [Public Site](https://astro-ghostcms.xyz)
- `playground`: Development and Testing
- `packages/`:
  - `create-astro-ghostcms`: CLI Utility to quickly deploy new Astro-GhostCMS projects.
  - `astro-ghostcms`: The main Integration!
  - `astro-ghostcms-theme-default`: The Default theme in integration mode.
  - `astro-ghostcms-catppuccin-dark`: A dark theme made with Catppuccin and TailwindCSS for Astro-GhostCMS Integration Mode.
  - `tsconfig`: *LOCAL* Development package for `@ts-ghost/core-api`.

## Contributing

This is a `pnpm` workspace and requires `pnpm` to function properly

To setup this workspace clone this repo and run the following command:

```sh
pnpm install
```

Then you can run the playground:

```sh
pnpm playground:dev
```

### Notices

*Ghost is a trademark of [The Ghost Foundation](https://ghost.org/trademark/). This project is not directly related to or provided by The Ghost Foundation and is intended to help create a easier method to utilize their provided JavaScript tools to link a Headless GhostCMS install in to your Astro project.* 
