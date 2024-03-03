import { z } from "astro/zod";
import type { RobotsTxtOptions } from "astro-robots-txt";
import type { SitemapOptions } from "@astrojs/sitemap";

export const GhostUserConfigSchema = z.object({
	/** OPTIONAL - Either set the URL in your .env or put it here
	 * @example
	 * // https://astro.build/config
	 * export default defineConfig({
	 *   integrations: [
	 *     ghostcms({
	 *       ghostURL: "https://ghostdemo.matthiesen.xyz"
	 *     })
	 *   ],
	 * }); */
	ghostURL: z.string().url().optional(),
	ThemeProvider: z
		.object({
			/** OPTIONAL - Disable the theme provider
			 * @default false
			 */
			disableThemeProvider: z.boolean().optional().default(false),
			/** OPTIONAL - Set the theme you want to use
			 * @default "@matthiesenxyz/astro-ghostcms-theme-default"
			 */
			theme: z
				.string()
				.optional()
				.default("@matthiesenxyz/astro-ghostcms-theme-default"),
		})
		.optional(),
	/** Allows the user to disable the provided 404 page */
	disableDefault404: z.boolean().optional().default(false),
	/** Allows the user to disable the provided RSS Feed */
	enableRSSFeed: z.boolean().optional().default(true),
	/** Allows the user to Enable or Disable the default Satori OG Image Generation
	 * @default true
	 */
	enableOGImages: z.boolean().optional().default(true),
	/** Allows the user to turn on/off Full Console Logs
	 * @default true
	 */
	fullConsoleLogs: z.boolean().optional().default(false),
	/** Optional - astro-robots-txt
	 * This option allows the user to configure the included integration
	 * Options shown are the availble options
	 * @see https://www.npmjs.com/package/astro-robots-txt#configuration
	 */
	robotsTxt: z.custom<RobotsTxtOptions>().optional(),
	/** OPTIONAL - astrojs/sitemap
	 * This option allows the user to configure the included integration
	 * Options shown are the availble options
	 * @see https://docs.astro.build/en/guides/integrations-guide/sitemap
	 */
	sitemap: z.custom<SitemapOptions>().optional(),
});

/** USER CONFIGURATION SCHEMA */
export type GhostUserConfig = z.infer<typeof GhostUserConfigSchema>;
