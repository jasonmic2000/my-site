import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "Writings on things I care about.",
  path: "/blog",
});

const BlogPage = () => {
  return <>This page is under construction</>;
};

export default BlogPage;
