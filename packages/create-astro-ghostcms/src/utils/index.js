import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as p from "@clack/prompts";
import c from "picocolors";

/**
 * @returns {never}
 */
export function exitPrompt() {
	p.cancel(c.red("Operation Cancelled"));
	process.exit(0);
}

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

/**
 *
 * @param {string} str
 * @returns {str is PackageManager}
 */
export function isPackageManager(str) {
	return str === "npm" || str === "yarn" || str === "pnpm";
}

/**
 * @typedef {import("../types.js").PackageManager} PackageManager
 */

/**
 * @param {string} str
 */
export function isPathname(str) {
	return str.includes(path.sep);
}

/**
 * @param {string} pathname
 */
export function normalizePath(pathname) {
	if (os.platform() === "win32") {
		return path.win32.normalize(pathname);
	}
	return path.normalize(pathname);
}

/**
 * @param {number} ms
 */
export async function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
