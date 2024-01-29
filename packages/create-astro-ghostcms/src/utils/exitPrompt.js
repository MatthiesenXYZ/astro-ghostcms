import * as p from "@clack/prompts";
import c from "picocolors";

/**
 * @returns {never}
 */
export function exitPrompt() {
	p.cancel(c.red("Operation Cancelled"));
	process.exit(0);
}