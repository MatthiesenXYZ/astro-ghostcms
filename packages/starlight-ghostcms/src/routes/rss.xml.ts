import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getAllPosts, getSettings, invariant } from "../utils/api";

const posts = await getAllPosts();
const settings = await getSettings();

import config from 'virtual:starlight-ghost-config';

export async function GET({ site }: APIContext) {
	invariant(settings,"Settings is not defined")
	const title = config.title;
	const description = config.rssDescription;
	const ghostSite = settings.url
	return rss({
		title: title,
		description: description,
		site: site?site:ghostSite,
		items: posts.map((post) => ({
			title: post.title,
			pubDate: new Date(
				post.published_at ? post.published_at : post.created_at,
			),
			description: post.excerpt,
			link: `/blog/${post.slug}/`,
			author: post.primary_author?.name,
		})),
	});
}
