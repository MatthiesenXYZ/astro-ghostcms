import { z } from "astro/zod";
import { RobotsTxtSchema } from "./robots.ts";
import { SitemapSchema } from "./sitemap.ts";

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
	/** OPTIONAL - Disable the theme provider
	 * @default false
	 */
	disableThemeProvider: z.boolean().optional().default(false),
	ThemeProvider: z.object({
		/** OPTIONAL - Set the theme you want to use
		 * @default "@matthiesenxyz/astro-ghostcms-theme-default"
		 */
		theme: z.string().optional().default("@matthiesenxyz/astro-ghostcms-theme-default"),
	}).optional(),
	/** Allows the user to disable the provided 404 page */
	disableDefault404: z.boolean().optional().default(false),
	/** Allows the user to disable the provided RSS Feed */
	enableRSSFeed: z.boolean().optional().default(true),
	/** Allows the user to Enable or Disable the default Satori OG Image Generation
	 * @default true
	 */
	enableOGImages: z.boolean().optional().default(true),
	/** OPTIONAL - astrojs/sitemap
	 * This option allows the user to configure the included integration
	 * Options shown are the availble options
	 * REFERENCE https://docs.astro.build/en/guides/integrations-guide/sitemap
	 */
	sitemap: SitemapSchema.optional(),
	/** OPTIONAL - astro-robots-txt
	 * This option allows the user to configure the included integration
	 * Options shown are the availble options
	 * REFERENCE https://www.npmjs.com/package/astro-robots-txt#configuration
	 */
	robotstxt: RobotsTxtSchema.optional(),
	/** Allows the user to turn on/off Full Console Logs
	 * @default true
	 */
	fullConsoleLogs: z.boolean().optional().default(false),
});

/** USER CONFIGURATION SCHEMA */
export type GhostUserConfig = z.infer<typeof GhostUserConfigSchema>;
