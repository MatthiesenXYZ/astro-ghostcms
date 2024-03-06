import { AstroError } from "astro/errors";
import { z } from "astro/zod";

const configSchema = z
	.object({
		/**
		 * The number of blog posts to display per page in the blog post list.
		 */
		postCount: z.number().min(1).default(5),
		/**
		 * The number of recent blog posts to display in the sidebar.
		 */
		recentPostCount: z.number().min(1).default(10),
		/**
		 * The title of the blog.
		 */
		title: z.string().default("Blog"),
		/**
		 * The description of the blog on the RSS Feed.
		 */
		rssDescription: z.string().default("My Awesome Starlight-GhostCMS Blog"),
		/**
		 * Turn on and off "Powered by Ghost"
		 */
		supportGhost: z.boolean().default(true),
	})
	.default({});

export function validateConfig(userConfig: unknown): StarlightGhostConfig {
	const config = configSchema.safeParse(userConfig);

	if (!config.success) {
		const errors = config.error.flatten();

		throw new AstroError(
			`Invalid starlight-GhostCMS configuration:

${errors.formErrors.map((formError) => ` - ${formError}`).join("\n")}
${Object.entries(errors.fieldErrors)
	.map(
		([fieldName, fieldErrors]) => ` - ${fieldName}: ${fieldErrors.join(" - ")}`,
	)
	.join("\n")}
  `,
			"See the error report above for more informations.\n\nIf you believe this is a bug, please file an issue at https://github.com/matthiesenxyz/astro-ghostcms/issues/new/choose",
		);
	}

	return config.data;
}

export type StarlightGhostConfig = z.infer<typeof configSchema>;
