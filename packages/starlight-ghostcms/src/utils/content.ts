import type { z } from 'astro/zod'
import { getCollection, type AstroCollectionEntry } from 'astro:content'
import starlightConfig from 'virtual:starlight/user-config'
import config from 'virtual:starlight-ghost-config'

import type { Author } from '../schemas/authors'

export async function getBlogStaticPaths() {
  const entries = await getBlogEntries()

  const entryPages: StarlightBlogEntry[][] = []

  for (const entry of entries) {
    const lastPage = entryPages.at(-1)

    if (!lastPage || lastPage.length === config.postCount) {
      entryPages.push([entry])
    } else {
      lastPage.push(entry)
    }
  }

  if (entryPages.length === 0) {
    entryPages.push([])
  }

  return entryPages.map((entries, index) => {
    const prevPage = index === 0 ? undefined : entryPages.at(index - 1)
    const nextPage = entryPages.at(index + 1)

    return {
      params: {
        page: index === 0 ? undefined : index + 1,
      },
      props: {
        entries,
        nextLink: nextPage ? { href: `/blog/${index + 2}`, label: 'Older posts' } : undefined,
        prevLink: prevPage ? { href: index === 1 ? '/blog' : `/blog/${index}`, label: 'Newer posts' } : undefined,
      } satisfies StarlightBlogStaticProps,
    }
  })
}

export async function getRecentBlogEntries() {
  const entries = await getBlogEntries()

  return entries.slice(0, config.recentPostCount)
}

export async function getBlogEntry(slug: string): Promise<StarlightBlogEntryPaginated> {
  const entries = await getBlogEntries()

  const entryIndex = entries.findIndex((entry) => entry.slug === slug.replace(/^\//, '').replace(/\/$/, ''))
  const entry = entries[entryIndex]

  if (!entry) {
    throw new Error(`Blog post with slug '${slug}' not found.`)
  }

  const prevEntry = entries[entryIndex - 1]
  const nextEntry = entries[entryIndex + 1]

  return {
    entry,
    nextLink: nextEntry ? { href: `/${nextEntry.slug}`, label: nextEntry.data.title } : undefined,
    prevLink: prevEntry ? { href: `/${prevEntry.slug}`, label: prevEntry.data.title } : undefined,
  }
}

export function getBlogEntryMetadata(entry: StarlightBlogEntry): StarlightBlogEntryMetadata {
  const authors: Author[] = []

  if (!entry.data.authors) {
    authors.push(...Object.values(authors))
  } else {
    authors.push(entry.data.authors)
  }

  return {
    authors,
    date: entry.data.date.toLocaleDateString(starlightConfig.defaultLocale.lang, { dateStyle: 'medium' }),
  }
}

export async function getBlogEntries() {
  const entries = await getCollection<StarlightEntryData>('docs', ({ id }) => {
    return id.startsWith('blog/') && id !== 'blog/index.mdx'
  })

  return entries.sort((a, b) => {
    return b.data.date.getTime() - a.data.date.getTime()
  })
}

export async function getBlogEntryExcerpt(entry: StarlightBlogEntry) {
  if (entry.data.excerpt) {
    return entry.data.excerpt
  }

  const { Content } = await entry.render()

  return Content
}

type StarlightEntryData = z.infer<ReturnType<typeof blogSchema>> & { title: string }
type StarlightEntry = AstroCollectionEntry<StarlightEntryData>

export type StarlightBlogEntry = StarlightEntry & {
  data: {
    date: Date
  }
}

export interface StarlightBlogLink {
  href: string
  label: string
}

export interface StarlightBlogEntryPaginated {
  entry: StarlightBlogEntry
  nextLink: StarlightBlogLink | undefined
  prevLink: StarlightBlogLink | undefined
}

interface StarlightBlogEntryMetadata {
  authors: Author[]
  date: string
}


interface StarlightBlogStaticProps {
  entries: StarlightBlogEntry[]
  nextLink: StarlightBlogLink | undefined
  prevLink: StarlightBlogLink | undefined
}
