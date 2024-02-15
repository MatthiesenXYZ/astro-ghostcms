export * from "./index";

export interface Context {
	dryRun: boolean;
	installDeps: boolean;
	initGitRepo: boolean;
	template: string;
	pkgManager: "npm" | "yarn" | "pnpm" | null;
	args: string[];
}

export type PackageManager = "npm" | "yarn" | "pnpm";
export type Serializable = string | object | number | boolean | bigint;
export type Template = ["basic", "starterkit", "catppuccin", "brutal"];
