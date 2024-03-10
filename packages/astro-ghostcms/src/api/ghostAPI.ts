import { TSGhostContentAPI } from "@ts-ghost/content-api";
import type { Page, Post, Tag } from "../schemas/api";

// LOAD ENVIRONMENT VARIABLES
import { loadEnv } from "vite";

const { CONTENT_API_KEY, CONTENT_API_URL } = loadEnv(
	"all",
	process.cwd(),
	"CONTENT_",
);

// LOAD CONFIG
import config from "virtual:@matthiesenxyz/astro-ghostcms/config";
const CONF_URL = config.ghostURL;

// SETUP GHOST API
const ghostApiKey = CONTENT_API_KEY || "";
const ghostUrl = CONF_URL || CONTENT_API_URL || "";
const version = "v5.0";
const api = new TSGhostContentAPI(ghostUrl, ghostApiKey, version);

export const getAllAuthors = async () => {
	const results = await api.authors
		.browse()
		.include({ "count.posts": true })
		.fetch();
	if (!results.success) {
		throw new Error(results.errors.map((e) => e.message).join(", "));
	}
	return {
		authors: results.data,
		meta: results.meta,
	};
};

export const getPosts = async () => {
	const results = await api.posts
		.browse()
		.include({
			authors: true,
			tags: true,
		})
		.fetch();
	if (!results.success) {
		throw new Error(results.errors.map((e) => e.message).join(", "));
	}
	return {
		posts: results.data,
		meta: results.meta,
	};
};

export const getAllPosts = async () => {
	const posts: Post[] = [];
	let cursor = await api.posts
		.browse()
		.include({
			authors: true,
			tags: true,
		})
		.paginate();
	if (cursor.current.success) posts.push(...cursor.current.data);
	while (cursor.next) {
		cursor = await cursor.next.paginate();
		if (cursor.current.success) posts.push(...cursor.current.data);
	}
	return posts;
};

export const getAllPages = async () => {
	const pages: Page[] = [];
	let cursor = await api.pages
		.browse()
		.include({
			authors: true,
			tags: true,
		})
		.paginate();
	if (cursor.current.success) pages.push(...cursor.current.data);
	while (cursor.next) {
		cursor = await cursor.next.paginate();
		if (cursor.current.success) pages.push(...cursor.current.data);
	}
	return pages;
};

export const getSettings = async () => {
	const res = await api.settings.fetch();
	if (res.success) {
		return res.data;
	}
	return null;
};

export const getAllTags = async () => {
	const tags: Tag[] = [];
	let cursor = await api.tags
		.browse({
			limit: 'all'
		})
		.include({ "count.posts": true })
		.paginate();

	if (cursor.current.success) tags.push(...cursor.current.data);
	while (cursor.next) {
		cursor = await cursor.next.paginate();
		if (cursor.current.success) tags.push(...cursor.current.data);
	}
	return tags;
};

export const getFeaturedPosts = async () => {
	const results = await api.posts
		.browse({ filter: "featured:true" })
		.include({
			authors: true,
			tags: true,
		})
		.fetch();
	if (!results.success) {
		throw new Error(results.errors.map((e) => e.message).join(", "));
	}
	return {
		posts: results.data,
		meta: results.meta,
	};
};
