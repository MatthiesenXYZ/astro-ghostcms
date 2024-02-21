import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getAllPosts } from "../utils/api";

const posts = await getAllPosts();
import config from 'virtual:starlight-ghost-config'

export async function GET({ site }: APIContext) {
	const title = config.title;
	const description = config.rssDescription;
	return rss({
		title: title,
		description: description,
		site: site,
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
