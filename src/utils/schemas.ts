import { boolean, string, z } from 'astro/zod';

export const SitemapSchema = z.object({
  /** EXAMPLE: ['https://example-1.com', 'https://example-2.com] 
   * @REFERENCE https://docs.astro.build/en/guides/integrations-guide/sitemap/#custompages
  */
  customPages: z.string().array().optional(),
  /** EXAMPLE: 10000
   * @REFERENCE https://docs.astro.build/en/guides/integrations-guide/sitemap/#entrylimit
   */
  entryLimit: z.number().optional()
})

const RobotsPolicySchema = z.object({
  /** You must provide a name of the automatic client (search engine crawler).
   * @ Wildcards are allowed.
   */
  userAgent: z.string(),
  /** Allowed paths for crawling */
  allow: z.string().or(string().array()).optional(),
  /** Disallowed paths for crawling */
  disallow: z.string().or(string().array()).optional(),
  /** Indicates that the page's URL contains parameters that should be ignored during crawling. 
   * @ Maximum string length is limited to 500.
  */
  cleanParam: z.string().or(string().array()).optional(),
  /** Minimum interval (in secs) for the crawler to wait after loading one page, before starting other */
  crawlDelay: z.number().optional()
})

export const RobotsTxtSchema = z.object({
  /** @EXAMPLE1 host: true - automatically resolve using the site option from Astro config
   * @EXAMPLE2 host: 'example.com'
   */
  host: z.string().or(boolean()).optional(),
  /** @EXAMPLE1 sitemap: "https://example.com/sitemap-0.xml"
   * @EXAMPLE2 sitemap: ['https://example.com/sitemap-0.xml','https://example.com/sitemap-1.xml']
   * @EXAMPLE3 sitemap: false - If you want to get the robots.txt file without the Sitemap: ... entry, set the sitemap parameter to false.
   */
  sitemap: z.string().or(boolean()).or(string().array()).optional(),
  /** astrojs/sitemap and astro-sitemap integrations have the sitemap-index.xml as their primary output. That is why the default value of sitemapBaseFileName is set to sitemap-index.
   * @EXAMPLE sitemapBaseFileName: 'custom-sitemap'
   */
  sitemapBaseFileName: z.string().optional(),
  /** SET POLICY RULES */
  policy: RobotsPolicySchema.array().optional(),
})
