import { z } from "astro/zod";

export const SitemapSchema = z.object({
    /** EXAMPLE: ['https://example-1.com', 'https://example-2.com] 
     * REFERENCE https://docs.astro.build/en/guides/integrations-guide/sitemap/#custompages
    */
    customPages: z.string().array().optional(),
    /** EXAMPLE: 10000
     * REFERENCE https://docs.astro.build/en/guides/integrations-guide/sitemap/#entrylimit
     */
    entryLimit: z.number().optional()
  })