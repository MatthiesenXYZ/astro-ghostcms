// IMPORT Ghost Types & Content-API
import type { 
    PostOrPage, PostsOrPages, Authors, 
    Tag, Tags, ArrayOrValue, IncludeParam, 
    LimitParam, Settings, Nullable 
} from './tryghost-content-api';
import GhostContentAPI from './tryghost-content-api';

// LOAD ENVIRONMENT VARIABLES
import { loadEnv } from 'vite';

const {CONTENT_API_KEY, CONTENT_API_URL} = loadEnv(
    'all',
    process.cwd(),
    'CONTENT_'
);

let key = CONTENT_API_KEY;
let url = CONTENT_API_URL;

// SETUP API
const version = "v5.0";
const api = GhostContentAPI({ key, url, version });

// SET Include params
const include:ArrayOrValue<IncludeParam> = ['authors', 'tags'];

// Get Posts (General "ALL")
export const getGhostPosts = async () => {
    const ghostPosts:PostsOrPages = await api.posts.browse({include,filter:'visibility:public'}) 
    return ghostPosts; };

// Get Posts (Recent "setLimit?")
export const getGhostRecentPosts = async (setLimit?:ArrayOrValue<LimitParam>) => {
    const ghostRecentPosts:PostsOrPages = await api.posts.browse({limit:setLimit?setLimit:"6",include,filter:'visibility:public'}); 
    return ghostRecentPosts; };

// Get Posts (Featured "setLimit?")
export const getGhostFeaturedPosts = async (setLimit?:ArrayOrValue<LimitParam>) => {
    const ghostFeaturedPosts:PostsOrPages = await api.posts.browse({limit:setLimit?setLimit:"1",include,filter:'featured:true'});
    return ghostFeaturedPosts; };

// Get Post (By Slug)
export const getGhostPostbySlug = async (slug:Nullable<string>) => {
    const ghostPostbySlug:PostOrPage = await api.posts.read({slug},{include});
    return ghostPostbySlug; };

// Get Post (By Tag)
export const getGhostPostsbyTag = async (slug:Nullable<string>) => {
    const ghostPostsbyTag:PostsOrPages = await api.posts.browse({filter:`tag:${slug}`,include});
    return ghostPostsbyTag; };

// Get Tags (General "ALL")
export const getGhostTags = async () => {
    const ghostTags:Tags = await api.tags.browse({include:`count.posts`});
    return ghostTags; };

// Get Tag (By Slug)
export const getGhostTagbySlug = async (slug:Nullable<string>) => {
    const ghostTagbySlug:Tag = await api.tags.read({slug},{include:`count.posts`});
    return ghostTagbySlug; };

// Get Authors (General "ALL")
export const getGhostAuthors = async () => {
    const ghostAuthors:Authors = await api.authors.browse({include:`count.posts`});
    return ghostAuthors; };

// Get Pages (ALL)
export const getGhostPages = async () => {
    const ghostPages:PostsOrPages = await api.pages.browse();
    return ghostPages; };

// Get Page (by Slug)
export const getGhostPage = async (slug:Nullable<string>) => {
    const ghostPage:PostOrPage = await api.pages.read({slug});
    return ghostPage; };

// Get Settings
export const getGhostSettings = async () => {
    const ghostSettings:Settings = await api.settings.browse();
    return ghostSettings; };
