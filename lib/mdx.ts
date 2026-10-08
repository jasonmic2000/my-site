import type { EvaluateOptions } from "next-mdx-remote-client/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";

/**
 * Plugin order matters: rehype-slug must run before rehype-autolink-headings
 * (it needs the heading ids).
 */
export const mdxOptions: EvaluateOptions = {
  // Posts are self-authored, but there is no reason to allow arbitrary imports.
  disableImports: true,
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkSmartypants],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [
        rehypePrettyCode,
        {
          theme: { light: "github-light-high-contrast", dark: "github-dark" },
          keepBackground: false,
        },
      ],
    ],
  },
};
