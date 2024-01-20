import { z } from 'astro/zod';
import * as S from './schemas';

export const UserConfigSchema = z.object({
    /** OPTIONAL - Theme Selector
     * This option allows the user to replace the included theme with an external npm module */
    theme: z.string().default('@matthiesenxyz/astro-ghostcms'),
    /** OPTIONAL - astrojs/sitemap
     * This option allows the user to configure the included integration 
     * Options shown are the availble options 
     * REFERENCE https://docs.astro.build/en/guides/integrations-guide/sitemap
      */
    sitemap: S.SitemapSchema.optional(),
    /** OPTIONAL - astro-robots-txt 
     * This option allows the user to configure the included integration 
     * Options shown are the availble options
     * REFERENCE https://www.npmjs.com/package/astro-robots-txt#configuration
      */
    robotstxt: S.RobotsTxtSchema.optional(),
  });

export type UserConfig = z.infer<typeof UserConfigSchema>