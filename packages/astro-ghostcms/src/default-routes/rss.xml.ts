import rss from "@astrojs/rss";
import { getAllPosts, getSettings } from '../api';
import invariant from "tiny-invariant";

export async function GET(context) {
  const posts = await getAllPosts();
  const settings = await getSettings();
  invariant(settings, "Settings not found");
  const allPosts = [...posts];
  const title = settings.title;
  const description = settings.description;
  return rss({
    title: title,
    description: description,
    site: context.site,
    items: allPosts.map((post) => ({
      title: post.title,
      pubDate: post.published_at,
      description: post.excerpt,
      link: `/${post.slug}/`,
    })),
  });
}