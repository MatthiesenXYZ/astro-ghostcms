import sitemap, { type SitemapOptions } from '@astrojs/sitemap';
import type { UserConfig } from '../schemas';

export function getSitemapConfig(opts: UserConfig["sitemap"]): SitemapOptions {
	const sitemapConfig: SitemapOptions = {};
	if (opts?.entryLimit){
		sitemapConfig.entryLimit = opts.entryLimit;
	}
	if (opts?.customPages){
		sitemapConfig.customPages = opts.customPages;
	}
	return sitemapConfig;
}

/**
 * A wrapped version of the `@astrojs/sitemap` integration for GhostCMS.
 */
export default function ghostSitemap(opts: UserConfig["sitemap"]) {
	return sitemap(getSitemapConfig(opts));
}