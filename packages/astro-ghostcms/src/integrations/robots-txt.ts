import robotsTxt, { type RobotsTxtOptions } from "astro-robots-txt";
import type { UserConfig } from "../schemas";

export function getRobotsTxtConfig(opts: UserConfig["robotstxt"]): RobotsTxtOptions {
	const robotsConfig: RobotsTxtOptions = {};
	if (opts?.host) {
		robotsConfig.host = opts.host;
	}
	if (opts?.policy) {
		robotsConfig.policy = opts.policy;
	}
	if (opts?.sitemap) {
		robotsConfig.sitemap = opts.sitemap;
	}
	if (opts?.sitemapBaseFileName) {
		robotsConfig.sitemapBaseFileName = opts.sitemapBaseFileName;
	}
	return robotsConfig;
}

/**
 * A wrapped version of the `astro-robots-txt` integration for GhostCMS.
 */
export default function ghostRobots(opts: UserConfig["robotstxt"]) {
	return robotsTxt(getRobotsTxtConfig(opts));
}