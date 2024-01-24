import rss from "@astrojs/rss";
import { getPosts, getSettings } from '../api';
import invariant from "tiny-invariant";

export async function GET(context) {
  const posts = await getPosts();
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
      pubDate: post.published_at,
      description: post.excerpt,
      link: `/${post.slug}/`,
    })),
  });
}