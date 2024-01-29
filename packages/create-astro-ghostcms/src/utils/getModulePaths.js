import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * @param {string} url
 */
export function getModulePaths(url) {
	const pathname = fileURLToPath(url);
	const parts = pathname.split("/");
	const basename = parts.pop();
	const dirname = parts.join(path.sep);
	return { pathname, dirname, basename };
}
