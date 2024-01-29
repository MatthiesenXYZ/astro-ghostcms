import path from "node:path";

/**
 * @param {string} str
 */
export function isPathname(str) {
	return str.includes(path.sep);
}