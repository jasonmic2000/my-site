import { Feed } from "feed";
import { getAllPosts } from "@/lib/blog";
import { DEFAULT_METADATA } from "@/lib/consts";

/** RSS 2.0 / Atom 1.0 / JSON Feed from one source. Items carry excerpt + link. */
export function buildFeed(): Feed {
  const posts = getAllPosts();
  const feed = new Feed({
    title: `${DEFAULT_METADATA.siteName} - Blog`,
    description: "Writings on things I care about.",
    id: `${DEFAULT_METADATA.url}/blog`,
    link: `${DEFAULT_METADATA.url}/blog`,
    language: "en",
    // Newest post date keeps the output deterministic across builds.
    updated: posts[0] ? new Date(`${posts[0].date}T00:00:00Z`) : undefined,
    copyright: `© ${DEFAULT_METADATA.siteName}`,
    feedLinks: {
      rss: `${DEFAULT_METADATA.url}/feed.xml`,
      atom: `${DEFAULT_METADATA.url}/atom.xml`,
      json: `${DEFAULT_METADATA.url}/feed.json`,
    },
    author: { name: DEFAULT_METADATA.siteName, link: DEFAULT_METADATA.url },
  });

  for (const post of posts) {
    const url = `${DEFAULT_METADATA.url}/blog/${post.slug}`;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.description,
      date: new Date(`${post.date}T00:00:00Z`),
    });
  }

  return feed;
}
