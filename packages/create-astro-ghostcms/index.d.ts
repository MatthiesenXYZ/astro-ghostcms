export interface Context {
	dryRun: boolean;
	installDeps: boolean;
	initGitRepo: boolean;
	pkgManager: "npm" | "yarn" | "pnpm" | null;
	args: string[];
}

export type Template = "basic";
