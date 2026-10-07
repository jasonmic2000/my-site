import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { DEFAULT_METADATA } from "@/lib/consts";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/work", "/blog"].map((route) => ({
    url: `${DEFAULT_METADATA.url}${route}`,
  }));

  const posts = getAllPosts().map((post) => ({
    url: `${DEFAULT_METADATA.url}/blog/${post.slug}`,
    lastModified: new Date(`${post.date}T00:00:00Z`),
  }));

  return [...routes, ...posts];
}
