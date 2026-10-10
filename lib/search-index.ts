import { getAllPosts } from "@/lib/blog";

export interface SearchPost {
  slug: string;
  title: string;
  /** ISO date, "YYYY-MM-DD". */
  date: string;
  description: string;
  tags: string[];
}

export interface SearchIndex {
  posts: SearchPost[];
}

/**
 * What the command menu searches beyond the fixed pages and actions. Served as
 * static JSON (`/search-index.json`) and fetched on first open, so it never
 * adds to the HTML or JS of ordinary pages. Drafts follow `getAllPosts`.
 */
export function getSearchIndex(): SearchIndex {
  return {
    posts: getAllPosts().map(({ slug, title, date, description, tags }) => ({
      slug,
      title,
      date,
      description,
      tags,
    })),
  };
}
