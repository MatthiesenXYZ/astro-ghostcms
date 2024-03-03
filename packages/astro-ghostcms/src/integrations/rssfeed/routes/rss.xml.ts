import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getAllPosts, getSettings, invariant } from "../../../api";

const posts = await getAllPosts();
const settings = await getSettings();

export async function GET({ site }: APIContext) {
	invariant(settings, "Settings not found");
	const title = settings.title;
	const description = settings.description;
	return rss({
		title: title,
		description: description,
		site: site ? site : "",
		stylesheet: "/rss-style.xsl",
		items: posts.map((post) => ({
			title: post.title,
			pubDate: new Date(
				post.published_at ? post.published_at : post.created_at,
			),
			description: post.excerpt,
			link: `/${post.slug}/`,
			author: post.primary_author?.name,
		})),
	});
}