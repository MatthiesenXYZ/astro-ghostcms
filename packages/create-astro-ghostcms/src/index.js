import path from "node:path";
import * as p from "@clack/prompts";
import arg from "arg";
import fse from "fs-extra";
import c from "picocolors";
import { createProject } from "./scripts/createProject.js";
import { exitPrompt, getModulePaths, isPackageManager } from "./utils/index.js";

export async function main() {
	const exit = () => process.exit(0);
	process.on("SIGINT", exit);
	process.on("SIGTERM", exit);

	console.clear();

	const argv = process.argv.slice(2).filter((arg) => arg !== "--");

	const flags = arg(
		{
			"--help": Boolean,
			"--install": Boolean,
			"--git": Boolean,
			"--dry": Boolean,
			"--pkg-manager": String,
			"-h": "--help",
			"-i": "--install",
			"-g": "--git",
			"-p": "--pkg-manager",
		},
		{ argv, permissive: true },
	);
	const {
		"--help": help,
		"--install": installDeps,
		"--git": initGitRepo,
		"--dry": dryRun,
		"--pkg-manager": pkgManager,
	} = flags;

	// 0. Show help text and bail
	if (help) {
		console.log(getHelp());
		return;
	}

	// Get Package Version for Intro
	const { pathname } = getModulePaths(import.meta.url);
	const iJSON = path.resolve(pathname, "..", "..", "package.json");
	const pJSON = await fse.readJson(iJSON);
	const pkgVer = pJSON.version;

	// 1. Say hello!
	p.intro(
		c.bgMagenta(
			c.black(
				` ${c.bold(
					"Astro-GhostCMS Create Utility - By MatthiesenXYZ",
				)} ${c.underline(c.bold(c.blue(`( v${pkgVer} )`)))} ${c.italic(
					dryRun ? "[Dry Run] " : " ",
				)}`,
			),
		),
	);

	const gettingStarted = `${c.white(
		c.bold(
			"Want to Initiate a git repo at the same time as deploying your project?",
		),
	)} \n - ${c.white(
		`Use ${c.yellow("--git")} at the end of the command`,
	)} \n ${c.white(
		c.bold(`Using a package manager other than ${c.cyan(c.bold("pnpm"))}?`),
	)} \n - ${c.white(
		`Use ${c.yellow("--pkg-manager npm")} or ${c.yellow(
			"--pkg-manager yarn",
		)}.`,
	)}`;

	p.note(gettingStarted);

	// 2. Get template to set up
	let [template, ...args] = flags._;
	if (template && !isValidTemplate(template)) {
		p.log.warning(c.red(`"${template}" isn't a valid template`));
		template = null;
	}
	if (!template) {
		const answer = await p.select({
			message: `${c.cyan("Which template would you like to use?")}`,
			options: [
				{
					value: "basic",
					label: `${c.magenta("Basic")} - ${c.cyan(
						c.italic("Integration w/ Default Theme"),
					)}`,
				},
				{
					value: "catppuccin",
					label: `${c.magenta("Catppuccin-TW")} - ${c.cyan(
						c.italic("Integration w/ Catppuccin TailwindCSS theme"),
					)}`,
				},
				{
					value: "brutal",
					label: `${c.magenta("BrutalbyElian")} - ${c.cyan(
						c.italic("Integration w/ BrutalbyElian UnoCSS theme"),
					)}`,
				},
				{
					value: "starterkit",
					label: `${c.magenta("Starter Kit")} - ${c.cyan(
						c.italic("Integration in API-Only Mode with customizable theme"),
					)}`,
				},
			],
			initialValue: "basic",
		});
		if (p.isCancel(answer)) exitPrompt();
		template = answer;
	}

	// 2. Construct context to pass to template functions
	/** @type {Context} */
	const ctx = {
		dryRun,
		installDeps,
		initGitRepo,
		template: template,
		pkgManager: isPackageManager(pkgManager) ? pkgManager : null,
		args,
	};

	// 3. Call template functions
	switch (template) {
		case "basic":
			await createProject(ctx).catch(console.error);
			break;
		case "starterkit":
			await createProject(ctx).catch(console.error);
			break;
		case "catppuccin":
			await createProject(ctx).catch(console.error);
			break;
		case "brutal":
			await createProject(ctx).catch(console.error);
			break;
		default:
			throw new Error(c.red(`Unknown template: ${template}`));
	}

	// 4. Huzzah!
	p.outro(
		c.reset(
			`Problems? ${c.underline(
				c.cyan("https://github.com/MatthiesenXYZ/astro-ghostcms/issues"),
			)}`,
		),
	);
}

function getHelp() {
	return `${c.yellow("Need Help? Check the Docs!")} ${c.underline(
		c.cyan("https://astro-ghostcms.xyz/docs"),
	)}`;
}

/**
 * @param {string|null|undefined} template
 * @returns {template is Template}
 */
function isValidTemplate(template) {
	return ["basic", "starterkit", "catppuccin", "brutal"].includes(template);
}

/**
 * @typedef {import("./types.js").Template} Template
 * @typedef {import("./types.js").PackageManager} PackageManager
 * @typedef {import("./types.js").Context} Context
 */
