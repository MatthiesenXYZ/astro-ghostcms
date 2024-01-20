import { z } from 'astro/zod';
import * as S from './schemas';

export const UserConfigSchema = z.object({
    theme: z.string().default('@matthiesenxyz/astro-ghostcms'),
    sitemap: S.SitemapSchema.optional(),
    robotstxt: S.RobotsTxtSchema.optional(),
  });

export type UserConfig = z.infer<typeof UserConfigSchema>