import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

const releases = defineCollection({
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			versionNumber: z.string(),
			image: z.object({
				src: image(),
				alt: z.string(),
			}).optional(),
			date: z.date({ coerce: true }),
		}),
});

const archivedreleases = defineCollection({
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			versionNumber: z.string(),
			image: z.object({
				src: image(),
				alt: z.string(),
			}).optional(),
			date: z.date({ coerce: true }),
		}),
});

export const collections = { 
	docs: defineCollection({ schema: docsSchema() }),
	releases, archivedreleases, 
};
