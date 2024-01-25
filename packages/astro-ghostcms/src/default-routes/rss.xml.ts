import rss from "@astrojs/rss";
import { getAllPosts, getSettings } from '../api';
import invariant from "tiny-invariant";

export async function GET(context: { site: string; }) {
  const posts = await getAllPosts();
  const settings = await getSettings();
  invariant(settings, "Settings not found");
  const title = settings.title;
  const description = settings.description;
  return rss({
    title: title,
    description: description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.published_at?post.published_at:post.created_at),
      description: post.excerpt,
      link: `/${post.slug}/`,
      author: post.primary_author?.name,
      } ) ),
  });
}