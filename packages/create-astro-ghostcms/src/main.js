import arg from "arg";
import * as prompts from "@clack/prompts";
import { exitPrompt, isPackageManager } from "./lib/utils.js";
import { createBasic } from "./runners/basic.js";
import color from 'picocolors';


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
		{ argv, permissive: true }
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

	// 1. Say hello!
	prompts.intro(color.bgMagenta(color.black(` ${color.bold("Astro-GhostCMS Create Utility - By MatthiesenXYZ")} ${color.italic(dryRun ? "[Dry Run] ":" ")}`)))

	// 2. Get template to set up
	let [template, ...args] = flags._;
	if (template && !isValidTemplate(template)) {
		prompts.log.warning(`"${template}" isn't a valid template`);
		template = null;
	}
	if (!template) {
		const answer = await prompts.select({
			message: "Which template would you like to use?",
			options: [
				{ 
					value: "basic", 
					label: "Basic - Integration w/ Default Theme" 
				},
			],
			initialValue: "basic",
		});
		if (prompts.isCancel(answer)) exitPrompt();
		template = answer;
	}

	// 2. Construct context to pass to template functions
	/** @type {Context} */
	const ctx = {
		dryRun,
		installDeps,
		initGitRepo,
		pkgManager: isPackageManager(pkgManager) ? pkgManager : null,
		args,
	};

	// 3. Call template functions
	switch (template) {
		case "basic":
			await createBasic(ctx).catch(console.error).then(success);
			break;
		default:
			throw new Error(`Unknown template: ${template}`);
	}

	// 4. Huzzah!
	prompts.outro(color.reset(`Problems? ${color.underline(color.cyan('https://github.com/MatthiesenXYZ/astro-ghostcms/issues'))}`));
}

const nextSteps = `If you didnt opt to install Dependencies dont forget to run \n ${color.yellow('npm install')} / ${color.yellow('pnpm install')} / ${color.yellow('yarn install')} inside your project directory \n Dont forget to modify your .env file for YOUR ghost install!`

function success() {
	prompts.note(nextSteps);
	prompts.outro(color.green("Deployment Complete!"));
}

function getHelp() {
	return `Need Help? Check the Docs! ${color.underline(color.cyan('https://astro-ghostcms.xyz/docs'))}`;
}

/**
 * @param {string|null|undefined} template
 * @returns {template is Template}
 */
function isValidTemplate(template) {
	return ["basic"].includes(template);
}

/**
 * @typedef {import("../types").Template} Template
 * @typedef {import("../types").PackageManager} PackageManager
 * @typedef {import("../types").Context} Context
 */
