import { z } from "astro/zod";

const localeKeySchema = z.string().min(1);
enum EnumChangefreq {
  DAILY = "daily",
  MONTHLY = "monthly",
  ALWAYS = "always",
  HOURLY = "hourly",
  WEEKLY = "weekly",
  YEARLY = "yearly",
  NEVER = "never"
}
export const SitemapSchema = z.object({
  filter: z.function().args(z.string()).returns(z.boolean()).optional(),
  customPages: z.string().url().array().optional(),
  i18n: z.object({
      defaultLocale: localeKeySchema,
      locales: z.record(
        localeKeySchema,
        z.string().min(2).regex(/^[a-zA-Z\-]+$/gm, { message: 'Only English alphabet symbols and hyphen allowed', })
      ),
  }).refine((val) => !val || val.locales[val.defaultLocale], {
      message: '`defaultLocale` must exist in `locales` keys',
    }).optional(),
  entryLimit: z.number().nonnegative().optional(),
  serialize: z.function().args(z.any()).returns(z.any()).optional(),
  changefreq: z.nativeEnum(EnumChangefreq).optional(),
  lastmod: z.date().optional(),
  priority: z.number().min(0).max(1).optional(),
})