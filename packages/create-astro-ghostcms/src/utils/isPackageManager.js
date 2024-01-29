/**
 *
 * @param {string} str
 * @returns {str is PackageManager}
 */
export function isPackageManager(str) {
	return str === "npm" || str === "yarn" || str === "pnpm";
}

/**
 * @typedef {import("../../types").PackageManager} PackageManager
 */