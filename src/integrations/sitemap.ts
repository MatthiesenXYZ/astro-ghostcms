import sitemap, { type SitemapOptions } from '@astrojs/sitemap';

export function getSitemapConfig(): SitemapOptions {
	const sitemapConfig: SitemapOptions = {};
	return sitemapConfig;
}

/**
 * A wrapped version of the `@astrojs/sitemap` integration for GhostCMS.
 */
export default function ghostSitemap() {
	return sitemap(getSitemapConfig());
}