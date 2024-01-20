import { z } from 'astro/zod';

export const UserConfigSchema = z.object({
    theme: z.string().default('@matthiesenxyz/astro-ghostcms'),
    rssStyle: z.string().optional()
  });

export type UserConfig = z.infer<typeof UserConfigSchema>