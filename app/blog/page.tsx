import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "Writings on things I care about.",
  path: "/blog",
});

const BlogPage = () => {
  return (
    <section className="space-y-6">
      <h1 className="font-semibold text-black dark:text-white">Blog</h1>
      <p>This page is under construction</p>
    </section>
  );
};

export default BlogPage;
