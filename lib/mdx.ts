import type { Root, RootContent } from "hast";
import type { EvaluateOptions } from "next-mdx-remote-client/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";

/** A heading found while compiling a post (for the table of contents). */
export interface Heading {
  id: string;
  text: string;
  /** 2 for `##`, 3 for `###`. */
  depth: 2 | 3;
}

type HastNode = Root | RootContent;

const textOf = (node: HastNode): string =>
  node.type === "text"
    ? node.value
    : "children" in node
      ? node.children.map(textOf).join("")
      : "";

const walk = (node: HastNode, visit: (node: HastNode) => void) => {
  visit(node);
  if ("children" in node) for (const child of node.children) walk(child, visit);
};

/** Records every h2/h3 (id and plain text) into `headings` as the post compiles. */
const collectHeadings = (headings: Heading[]) => () => (tree: Root) => {
  walk(tree, (node) => {
    if (
      node.type === "element" &&
      (node.tagName === "h2" || node.tagName === "h3") &&
      typeof node.properties.id === "string"
    ) {
      headings.push({
        id: node.properties.id,
        text: textOf(node),
        depth: node.tagName === "h2" ? 2 : 3,
      });
    }
  });
};

/**
 * MDX options for one post. Pass an empty array; it is filled with the post's
 * headings during compilation (read it after `evaluate` resolves).
 *
 * Plugin order matters: rehype-slug adds the ids, headings are collected next
 * (before the autolinker wraps their text), then autolink and highlighting.
 */
export const createMdxOptions = (headings: Heading[]): EvaluateOptions => ({
  // Posts are self-authored, but there is no reason to allow arbitrary imports.
  disableImports: true,
  mdxOptions: {
    // Smart quotes and ellipses only; dashes stay as typed (plain hyphens).
    remarkPlugins: [remarkGfm, [remarkSmartypants, { dashes: false }]],
    rehypePlugins: [
      rehypeSlug,
      collectHeadings(headings),
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
});
