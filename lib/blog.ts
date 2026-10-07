import {
  type RawEntry,
  readContentDir,
  requireIsoDate,
  requireString,
} from "@/lib/content";

export interface PostMeta {
  /** Derived from the filename. */
  slug: string;
  title: string;
  /** ISO date, "YYYY-MM-DD". */
  date: string;
  description: string;
  tags: string[];
  draft: boolean;
}

export interface Post extends PostMeta {
  /** Raw MDX body (frontmatter stripped). */
  source: string;
}

function toPost(raw: RawEntry): Post {
  const tags = raw.data.tags;
  if (
    tags !== undefined &&
    !(Array.isArray(tags) && tags.every((tag) => typeof tag === "string"))
  ) {
    throw new Error(
      `${raw.fileName}: frontmatter "tags" must be a string list`,
    );
  }
  return {
    slug: raw.fileName.replace(/\.mdx$/, ""),
    title: requireString(raw, "title"),
    date: requireIsoDate(raw, "date"),
    description: requireString(raw, "description"),
    tags: (tags as string[] | undefined) ?? [],
    draft: raw.data.draft === true,
    source: raw.content,
  };
}

/** Drafts are visible in `next dev` only; production builds exclude them. */
const showDrafts = process.env.NODE_ENV !== "production";

/** All publishable posts, newest first. */
export function getAllPosts(): Post[] {
  return readContentDir("blog")
    .map(toPost)
    .filter((post) => showDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}
