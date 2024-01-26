import sitemap, { type SitemapOptions } from '@astrojs/sitemap';
import type { UserConfig } from '../schemas';

export function getSitemapConfig(opts: UserConfig["sitemap"]): SitemapOptions {
	const sitemapConfig: SitemapOptions = {};
	if (opts?.filter){
		sitemapConfig.filter = opts.filter;
	}
	if (opts?.changefreq){
		sitemapConfig.changefreq = opts.changefreq;
	}
	if (opts?.entryLimit){
		sitemapConfig.entryLimit = opts.entryLimit;
	}
	if (opts?.customPages){
		sitemapConfig.customPages = opts.customPages;
	}
	if (opts?.i18n){
		sitemapConfig.i18n = opts.i18n;
	}
	if (opts?.lastmod){
		sitemapConfig.lastmod = opts.lastmod;
	}
	if (opts?.priority){
		sitemapConfig.priority = opts.priority;
	}
	if (opts?.serialize){
		sitemapConfig.serialize = opts.serialize;
	}
	return sitemapConfig;
}

/**
 * A wrapped version of the `@astrojs/sitemap` integration for GhostCMS.
 */
export default function ghostSitemap(opts: UserConfig["sitemap"]) {
	return sitemap(getSitemapConfig(opts));
}