import sitemap, { type SitemapOptions } from '@astrojs/sitemap';
import { UserConfig } from '../utils/UserConfigSchema';

export function getSitemapConfig(opts: UserConfig): SitemapOptions {
	const { sitemap } = opts
	const sitemapConfig: SitemapOptions = {};
	if (sitemap?.entryLimit){
		sitemapConfig.entryLimit = sitemap.entryLimit;
	}
	if (sitemap?.customPages){
		sitemapConfig.customPages = sitemap.customPages;
	}
	return sitemapConfig;
}

/**
 * A wrapped version of the `@astrojs/sitemap` integration for GhostCMS.
 */
export default function ghostSitemap(opts: UserConfig) {
	return sitemap(getSitemapConfig(opts));
}