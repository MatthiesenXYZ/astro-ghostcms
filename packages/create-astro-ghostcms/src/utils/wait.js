
/**
 * @param {number} ms
 */
export async function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
