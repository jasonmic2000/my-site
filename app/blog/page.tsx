import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";
import { formatDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "Writings on things I care about.",
  path: "/blog",
});

const BlogPage = () => {
  const posts = getAllPosts();

  return (
    <section className="space-y-6">
      <h1 className="font-semibold text-black dark:text-white">Blog</h1>
      {posts.length === 0 ? (
        <p className="font-serif">No posts yet. Check back soon.</p>
      ) : (
        <ul className="flex flex-col gap-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className={`font-semibold ${HOVER_TRANSITION_CLASS}`}
              >
                {post.title}
              </Link>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.draft && " · draft"}
              </p>
              <p className="pt-2 font-serif">{post.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default BlogPage;
