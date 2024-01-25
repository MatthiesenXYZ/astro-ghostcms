import rss from "@astrojs/rss";
import { getAllPosts, getSettings, invariant } from '../api';
import type { APIContext } from 'astro';

const posts = await getAllPosts();
const settings = await getSettings();

export async function GET({ site, generator }: APIContext) {
  invariant(settings, "Settings not found");
  const title = settings.title;
  const description = settings.description;
  return rss({
    title: `${title} [Built on ${generator.slice(0, 8)}]`,
    description: description,
    site: site?site:"",
    items: posts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.published_at?post.published_at:post.created_at),
      description: post.excerpt,
      link: `/${post.slug}/`,
      author: post.primary_author?.name,
      } ) ),
  });
}