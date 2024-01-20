import robotsTxt, { type RobotsTxtOptions } from "astro-robots-txt";

export function getRobotsTxtConfig(): RobotsTxtOptions {
	const robotsConfig: RobotsTxtOptions = {};
	return robotsConfig;
}

/**
 * A wrapped version of the `astro-robots-txt` integration for GhostCMS.
 */
export default function ghostRobots() {
	return robotsTxt(getRobotsTxtConfig());
}