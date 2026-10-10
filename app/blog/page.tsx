import type { Metadata } from "next";
import { PostList } from "@/components/PostList";
import { TagList } from "@/components/TagList";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "Writings on things I care about.",
  path: "/blog",
});

const BlogPage = () => {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <section className="space-y-6">
      <h1 className="font-semibold text-black dark:text-white">Blog</h1>
      <TagList tags={tags} />
      {posts.length === 0 ? (
        <p className="font-serif">No posts yet. Check back soon.</p>
      ) : (
        <PostList posts={posts} />
      )}
    </section>
  );
};

export default BlogPage;
