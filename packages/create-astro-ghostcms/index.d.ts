export interface Context {
	dryRun: boolean;
	installDeps: boolean;
	initGitRepo: boolean;
	template: string;
	pkgManager: "npm" | "yarn" | "pnpm" | null;
	args: string[];
}

export type Template = ["basic","starterkit","catppuccin"];
