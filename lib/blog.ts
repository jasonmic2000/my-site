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
  /** Estimated minutes to read the prose (at least 1). */
  readingMinutes: number;
}

export interface Post extends PostMeta {
  /** Raw MDX body (frontmatter stripped). */
  source: string;
}

const WORDS_PER_MINUTE = 200;

/** Prose words only: code blocks are skimmed, and JSX/markdown syntax is not read. */
export function estimateReadingMinutes(source: string): number {
  const prose = source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[`*_#>|~-]/g, " ");
  const words = prose.split(/\s+/).filter((word) => /\w/.test(word)).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
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
    readingMinutes: estimateReadingMinutes(raw.content),
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

/** URL-safe form of a tag: "Next.js tips" -> "next-js-tips". */
export function tagSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface TagInfo {
  slug: string;
  /** Display name, from the first post that uses the tag. */
  name: string;
  count: number;
}

/** Every tag used by a publishable post, most used first. */
export function getAllTags(): TagInfo[] {
  const tags = new Map<string, TagInfo>();
  for (const post of getAllPosts()) {
    for (const name of post.tags) {
      const slug = tagSlug(name);
      if (!slug) continue;
      const existing = tags.get(slug);
      if (existing) existing.count += 1;
      else tags.set(slug, { slug, name, count: 1 });
    }
  }
  return [...tags.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );
}

export function getPostsByTag(slug: string): Post[] {
  return getAllPosts().filter((post) =>
    post.tags.some((tag) => tagSlug(tag) === slug),
  );
}
