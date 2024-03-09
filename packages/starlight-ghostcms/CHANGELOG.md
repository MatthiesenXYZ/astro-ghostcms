# @matthiesenxyz/starlight-ghostcms

## 0.1.3

### Patch Changes

- 205738c: fix bug, and resolved config issue that was now will allow users to pass the ghostURL within their `astro.config.mjs`

## 0.1.2

### Patch Changes

- 2724119: Migrate to `astro-remote` for internal processing of GhostCMS HTML. No user changes required.

## 0.1.1

### Patch Changes

- f921005: Bump dependencies:

  - vite from to
  - @eliancodes/brutal-ui from to
  - typescript from to
  - ultrahtml from to
  - @fontsource-variable/inter from to
  - astro-seo from to
  - astro from to
  - sass from to
  - @astrojs/starlight from to
  - sharp from to

## 0.1.0

### Minor Changes

- 9ec2a61: Bumb GhostCMS API, No user facing breaking changes.

  NEW:

  - You can now set a `route: "blog"` in your `astro.config.mjs` to change the default `/<route>` to your blog/posts

## 0.0.7

### Patch Changes

- cb979d5: Adds 2 new pages, Authors, and about page(Link will disappear if you dont have the default ghost about page with slug "about"). Also adds auto links from ghost settings for twitter and facebook if not set my the user in starlight.

## 0.0.6

### Patch Changes

- 40d6454: add rss feeds, also adds a link in the socials based on the astro `site` config option

## 0.0.5

### Patch Changes

- 95171f3: fixed spelling issues in package.json

## 0.0.4

### Patch Changes

- 4a89195: fix deps

## 0.0.3

### Patch Changes

- dc92877: add Missing license

## 0.0.2

### Patch Changes

- a0aa3b5: Initial Public Release, Added Readme, Basics Working, Ready Set GO!
