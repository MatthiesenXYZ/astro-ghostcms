import { z } from "astro/zod";

export const SitemapSchema = z.object({
    /** @example ['https://example-1.com', 'https://example-2.com] 
     * @see https://docs.astro.build/en/guides/integrations-guide/sitemap/#custompages
    */
    customPages: z.string().array().optional(),
    /** @example 10000
     * @see https://docs.astro.build/en/guides/integrations-guide/sitemap/#entrylimit
     */
    entryLimit: z.number().optional()
  })