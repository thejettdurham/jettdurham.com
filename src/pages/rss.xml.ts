import rss from '@astrojs/rss';
import { postDescription, postUrl, publishedPosts } from '../lib/posts';
export async function GET(context: { site: URL }) {
  const posts = await publishedPosts();
  return rss({
    title: 'Jett Durham — Writing',
    description: 'Writing on software, creativity, and more.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: postDescription(post),
      pubDate: post.data.date,
      link: postUrl(post),
    })),
  });
}
