import Link from "next/link";
import type { MDXComponents } from "next-mdx-remote-client/rsc";
import type { ComponentProps } from "react";
import { Callout } from "@/components/Callout";

const MdxLink = ({ href = "", children, ...props }: ComponentProps<"a">) => {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
};

/** Components available to every post. Add new embeddable components here. */
export const mdxComponents: MDXComponents = {
  a: MdxLink,
  Callout,
};
