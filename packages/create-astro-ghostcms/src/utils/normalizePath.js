import path from "node:path";
import os from "node:os";

/**
 * @param {string} pathname
 */
export function normalizePath(pathname) {
	if (os.platform() === "win32") {
		return path.win32.normalize(pathname);
	}
	return path.normalize(pathname);
}