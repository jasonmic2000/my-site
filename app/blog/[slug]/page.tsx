import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { evaluate } from "next-mdx-remote-client/rsc";
import { JsonLd } from "@/components/JsonLd";
import { mdxComponents } from "@/components/mdx-components";
import { TableOfContents } from "@/components/TableOfContents";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";
import { formatDate, formatReadingTime } from "@/lib/dates";
import { blogPostingJsonLd } from "@/lib/jsonld";
import { createMdxOptions, type Heading } from "@/lib/mdx";
import { pageMetadata } from "@/lib/metadata";

type Params = Promise<{ slug: string }>;

// Only slugs returned by generateStaticParams exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: { url: `/blog/${post.slug}/opengraph-image`, alt: post.title },
  });
}

const PostPage = async ({ params }: { params: Params }) => {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Filled with the post's headings while it compiles (see createMdxOptions).
  const headings: Heading[] = [];
  const { content, error } = await evaluate({
    source: post.source,
    options: createMdxOptions(headings),
    components: mdxComponents,
  });
  // Fail the build on MDX syntax errors rather than shipping a broken post.
  if (error) throw error;

  return (
    <article className="space-y-8">
      <JsonLd data={blogPostingJsonLd(post)} />
      <header className="space-y-2">
        <h1 className="font-extrabold text-[2rem] text-black leading-tight dark:text-white">
          {post.title}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {" · "}
          {formatReadingTime(post.readingMinutes)}
        </p>
      </header>
      <TableOfContents headings={headings} />
      <div className="post font-serif">{content}</div>
      <Link href="/blog" className={`text-sm ${HOVER_TRANSITION_CLASS}`}>
        ← All posts
      </Link>
    </article>
  );
};

export default PostPage;
