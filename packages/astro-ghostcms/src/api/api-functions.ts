import type { Page, Post } from "./content-api/schemas";
import { TSGhostContentAPI } from "./content-api";

// LOAD ENVIRONMENT VARIABLES
import { loadEnv } from 'vite';

const {
  CONTENT_API_KEY, 
  CONTENT_API_URL
} = loadEnv('all',process.cwd(),'CONTENT_');

let ghostApiKey = CONTENT_API_KEY;
let ghostUrl = CONTENT_API_URL;
const version = "v5.0";

export const getAllAuthors = async () => {
  const api = new TSGhostContentAPI(ghostUrl, ghostApiKey, version);
  const results = await api.authors
    .browse()
    .include({
      "count.posts": true,
    })
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
  const api = new TSGhostContentAPI(ghostUrl, ghostApiKey, version);
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
  const api = new TSGhostContentAPI(ghostUrl, ghostApiKey, version);
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
  const api = new TSGhostContentAPI(ghostUrl, ghostApiKey, version);
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
  const api = new TSGhostContentAPI(ghostUrl, ghostApiKey, version);
  const res = await api.settings.fetch();
  if (res.success) {
    return res.data;
  }
  return null;
};

export const getAllTags = async () => {
  const api = new TSGhostContentAPI(ghostUrl, ghostApiKey, version);
  const results = await api.tags
    .browse()
    .include({
      "count.posts": true,
    })
    .fetch();
  if (!results.success) {
    throw new Error(results.errors.map((e) => e.message).join(", "));
  }
  return {
    tags: results.data,
    meta: results.meta,
  };
};

export const getFeaturedPosts = async () => {
  const api = new TSGhostContentAPI(ghostUrl, ghostApiKey, version);
  const results = await api.posts
    .browse({
      filter: "featured:true"
    })
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