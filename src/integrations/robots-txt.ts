import robotsTxt, { type RobotsTxtOptions } from "astro-robots-txt";
import { UserConfig } from "../utils/UserConfigSchema";

export function getRobotsTxtConfig(opts: UserConfig): RobotsTxtOptions {
	const { robotstxt } = opts;
	const robotsConfig: RobotsTxtOptions = {};
	if (robotstxt?.host) {
		robotsConfig.host = robotstxt.host;
	}
	if (robotstxt?.policy) {
		robotsConfig.policy = robotstxt.policy;
	}
	if (robotstxt?.sitemap) {
		robotsConfig.sitemap = robotstxt.sitemap;
	}
	if (robotstxt?.sitemapBaseFileName) {
		robotsConfig.sitemapBaseFileName = robotstxt.sitemapBaseFileName;
	}
	return robotsConfig;
}

/**
 * A wrapped version of the `astro-robots-txt` integration for GhostCMS.
 */
export default function ghostRobots(opts: UserConfig) {
	return robotsTxt(getRobotsTxtConfig(opts));
}