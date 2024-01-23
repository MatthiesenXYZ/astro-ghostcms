---
title: Ghost Content API References
description: Ghost Content API References
---

- [Main Content API Docs (ghost.org)](https://ghost.org/docs/content-api/)

## Example of Posts Output

```json frame="code" title="Posts"
{
    "posts": [
        {
            "slug": "welcome-short",
            "id": "5c7ece47da174000c0c5c6d7",
            "uuid": "3a033ce7-9e2d-4b3b-a9ef-76887efacc7f",
            "title": "Welcome",
            "html": "<p>👋 Welcome, it's great to have you here.</p>",
            "comment_id": "5c7ece47da174000c0c5c6d7",
            "feature_image": "https://casper.ghost.org/v2.0.0/images/welcome-to-ghost.jpg",
            "feature_image_alt": null,
            "feature_image_caption": null,
            "featured": false,
            "meta_title": null,
            "meta_description": null,
            "created_at": "2019-03-05T19:30:15.000+00:00",
            "updated_at": "2019-03-26T19:45:31.000+00:00",
            "published_at": "2012-11-27T15:30:00.000+00:00",
            "custom_excerpt": "Welcome, it's great to have you here.",
            "codeinjection_head": null,
            "codeinjection_foot": null,
            "og_image": null,
            "og_title": null,
            "og_description": null,
            "twitter_image": null,
            "twitter_title": null,
            "twitter_description": null,
            "custom_template": null,
            "canonical_url": null,
            "authors": [
                {
                    "id": "5951f5fca366002ebd5dbef7",
                    "name": "Ghost",
                    "slug": "ghost",
                    "profile_image": "https://demo.ghost.io/content/images/2017/07/ghost-icon.png",
                    "cover_image": null,
                    "bio": "The professional publishing platform",
                    "website": "https://ghost.org",
                    "location": null,
                    "facebook": "ghost",
                    "twitter": "@tryghost",
                    "meta_title": null,
                    "meta_description": null,
                    "url": "https://demo.ghost.io/author/ghost/"
                }
            ],
            "tags": [
                {
                    "id": "59799bbd6ebb2f00243a33db",
                    "name": "Getting Started",
                    "slug": "getting-started",
                    "description": null,
                    "feature_image": null,
                    "visibility": "public",
                    "meta_title": null,
                    "meta_description": null,
                    "url": "https://demo.ghost.io/tag/getting-started/"
                }
            ],
            "primary_author": {
                "id": "5951f5fca366002ebd5dbef7",
                "name": "Ghost",
                "slug": "ghost",
                "profile_image": "https://demo.ghost.io/content/images/2017/07/ghost-icon.png",
                "cover_image": null,
                "bio": "The professional publishing platform",
                "website": "https://ghost.org",
                "location": null,
                "facebook": "ghost",
                "twitter": "@tryghost",
                "meta_title": null,
                "meta_description": null,
                "url": "https://demo.ghost.io/author/ghost/"
            },
            "primary_tag": {
                "id": "59799bbd6ebb2f00243a33db",
                "name": "Getting Started",
                "slug": "getting-started",
                "description": null,
                "feature_image": null,
                "visibility": "public",
                "meta_title": null,
                "meta_description": null,
                "url": "https://demo.ghost.io/tag/getting-started/"
            },
            "url": "https://demo.ghost.io/welcome-short/",
            "excerpt": "Welcome, it's great to have you here."
        }
    ]
}
```

## Example of Tags Output

```json frame="code" title="Tags"
{
    "tags": [
        {
            "slug": "getting-started",
            "id": "5ddc9063c35e7700383b27e0",
            "name": "Getting Started",
            "description": null,
            "feature_image": null,
            "visibility": "public",
            "meta_title": null,
            "meta_description": null,
            "og_image": null,
            "og_title": null,
            "og_description": null,
            "twitter_image": null,
            "twitter_title": null,
            "twitter_description": null,
            "codeinjection_head": null,
            "codeinjection_foot": null,
            "canonical_url": null,
            "accent_color": null,
            "url": "https://docs.ghost.io/tag/getting-started/"
        }
    ]
}
```

## Example of Authors Output

```json frame="code" title="Authors"
{
    "authors": [
        {
            "slug": "cameron",
            "id": "5ddc9b9510d8970038255d02",
            "name": "Cameron Almeida",
            "profile_image": "https://docs.ghost.io/content/images/2019/03/1c2f492a-a5d0-4d2d-b350-cdcdebc7e413.jpg",
            "cover_image": null,
            "bio": "Editor at large.",
            "website": "https://example.com",
            "location": "Cape Town",
            "facebook": "example",
            "twitter": "@example",
            "meta_title": null,
            "meta_description": null,
            "url": "https://docs.ghost.io/author/cameron/"
        }
    ]
}
```

## Example of Settings Output

```json frame="code" title="Settings"
{
    "settings": {
        "title": "Ghost",
        "description": "The professional publishing platform",
        "logo": "https://docs.ghost.io/content/images/2014/09/Ghost-Transparent-for-DARK-BG.png",
        "icon": "https://docs.ghost.io/content/images/2017/07/favicon.png",
        "accent_color": null,
        "cover_image": "https://docs.ghost.io/content/images/2019/10/publication-cover.png",
        "facebook": "ghost",
        "twitter": "@tryghost",
        "lang": "en",
        "timezone": "Etc/UTC",
        "codeinjection_head": null,
        "codeinjection_foot": "<script src=\"//rum-static.pingdom.net/pa-5d8850cd3a70310008000482.js\" async></script>",
        "navigation": [
            {
                "label": "Home",
                "url": "/"
            },
            {
                "label": "About",
                "url": "/about/"
            },
            {
                "label": "Getting Started",
                "url": "/tag/getting-started/"
            },
            {
                "label": "Try Ghost",
                "url": "https://ghost.org"
            }
        ],
        "secondary_navigation": [],
        "meta_title": null,
        "meta_description": null,
        "og_image": null,
        "og_title": null,
        "og_description": null,
        "twitter_image": null,
        "twitter_title": null,
        "twitter_description": null,
        "members_support_address": "noreply@docs.ghost.io",
        "url": "https://docs.ghost.io/"
    }
}
```