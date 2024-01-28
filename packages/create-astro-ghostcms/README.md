# `@matthiesenxyz/create-astro-ghostcms`

Utility to quickly get started with our Integration and astro.

![Demo](./src/assets/create-astro-ghostcms-2024.jan.27.png)

The Default install method requires `pnpm` if you dont have `pnpm` installed you can change this by using the `--pkg-manager <pkg-mngr>` with the Package manager of your choice(i.e npm, yarn). 

```sh
npx @matthiesenxyz/create-astro-ghostcms

# OR

npx @matthiesenxyz/create-astro-ghostcms <template> <project_directory>
```

## Available command args:

```sh
npx @matthiesenxyz/create-astro-ghostcms --<arg>
#	`--help` : Calls internal getHelp Function
#	`--install` : Sets Install Dependencies to 'true'
#	`--git` : Initiates git Repo
#	`--dry` : Shows you what the command will do. (NO CHANGES WILL BE MADE)
#	`--pkg-manager`: Specify your Package manager(i.e. npm, yarn | DEFAULT: pnpm)
```

## Available templates

| Template | Description                                           |
| -------- | ----------------------------------------------------- |
| `basic`  | Basic Setup with astro-ghostcms and theme-default     |
