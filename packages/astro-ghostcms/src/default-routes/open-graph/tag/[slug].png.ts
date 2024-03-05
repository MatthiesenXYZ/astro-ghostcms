import type {
	APIRoute,
	GetStaticPaths,
	GetStaticPathsItem,
	InferGetStaticPropsType,
} from "astro";
import { html } from "satori-html";
import {
	getAllPosts,
	getAllTags,
	getSettings,
	invariant,
} from "../../../api/index.js";
import satoriOG from "../../../integrations/satori.js";

export const getStaticPaths: GetStaticPaths = async () => {
	const result: GetStaticPathsItem[] = [];
	const posts = await getAllPosts();
	const { tags } = await getAllTags();
	const settings = await getSettings();
	invariant(settings, "Settings are required");

	tags.map((tag) => {
		const filteredPosts = posts.filter((post) =>
			post.tags?.map((tag) => tag.slug).includes(tag.slug),
		);
		result.push({
			params: { slug: tag.slug },
			props: {
				posts: filteredPosts,
				settings,
				tag,
			},
		});
	});
	return result;
};
export type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute = async ({ props, site }) => {
	const settings = await getSettings();
	invariant(settings, "Settings are required");
	const fontFile = await fetch(
		"https://og-playground.vercel.app/inter-latin-ext-700-normal.woff",
	);
	const fontData: ArrayBuffer = await fontFile.arrayBuffer();

	return await satoriOG({
		template: html`<div style="display: flex; height: 100%; width: 100%; alignItems: center; justifyContent: center; letterSpacing: -.02em; fontWeight: 700; background: white;"> <div style="left: 24; top: 24; position: absolute; display: flex; alignItems: center;"> <img src=${
			settings.icon
		} width="82"/> <span style="marginLeft: 8; fontSize: 48;">${
			settings.title
		} - Tag: ${
			props.tag.name
		}</span> </div> <div style=" display: flex; flexWrap: wrap; justifyContent: center; padding: 20px 50px; margin: 0 42px; fontSize: 40; width: 1700; height: 850; textAlign: center; backgroundColor: black; color: white; lineHeight: 1.4;"> <img src=${
			settings.cover_image ? settings.cover_image : settings.twitter_image
		} width="100%" height="100%"/> </div>  <div style="left: 24; bottom: 24; position: absolute; display: flex; alignItems: center;"> <span style="marginLeft: 8; fontSize: 48;">${site}</span> </div> </div>`,
		width: 1920,
		height: 1080,
	}).toResponse({
		satori: {
			fonts: [
				{
					name: "Inter Latin",
					data: fontData,
					style: "normal",
				},
			],
		},
	});
};