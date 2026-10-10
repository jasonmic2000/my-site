import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostList } from "@/components/PostList";
import { getAllTags, getPostsByTag } from "@/lib/blog";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";
import { pageMetadata } from "@/lib/metadata";

type Params = Promise<{ tag: string }>;

// Only tags used by a published post exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tag.slug }));
}

const findTag = (slug: string) => getAllTags().find((tag) => tag.slug === slug);

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { tag: slug } = await params;
  const tag = findTag(slug);
  if (!tag) return {};
  return pageMetadata({
    title: `Posts tagged ${tag.name}`,
    description: `${tag.count} ${tag.count === 1 ? "post" : "posts"} tagged "${tag.name}".`,
    path: `/blog/tags/${tag.slug}`,
  });
}

const TagPage = async ({ params }: { params: Params }) => {
  const { tag: slug } = await params;
  const tag = findTag(slug);
  if (!tag) notFound();

  return (
    <section className="space-y-6">
      <h1 className="font-semibold text-black dark:text-white">
        Posts tagged “{tag.name}”
      </h1>
      <PostList posts={getPostsByTag(slug)} />
      <Link href="/blog" className={`text-sm ${HOVER_TRANSITION_CLASS}`}>
        ← All posts
      </Link>
    </section>
  );
};

export default TagPage;
