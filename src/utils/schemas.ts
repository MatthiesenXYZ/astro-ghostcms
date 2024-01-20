import { z } from 'astro/zod';

export const SitemapSchema = z.object({
  customPages: z.string().array().optional(),
  entryLimit: z.number().optional()
})

const RobotsPolicySchema = z.object({
  userAgent: z.string(),
  allow: z.string().optional(),
  disallow: z.string().optional(),
  cleanParam: z.string().optional(),
  crawlDelay: z.number().optional()
})

export const RobotsTxtSchema = z.object({
  host: z.string().optional(),
  sitemap: z.string().optional(),
  sitemapBaseFileName: z.string().optional(),
  policy: RobotsPolicySchema.array().optional(),
})
