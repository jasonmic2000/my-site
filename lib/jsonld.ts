import type { Post } from "@/lib/blog";
import { DEFAULT_METADATA, SOCIALS } from "@/lib/consts";

const SCHEMA = "https://schema.org";
const PERSON_ID = `${DEFAULT_METADATA.url}/#person`;

const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: DEFAULT_METADATA.siteName,
  url: DEFAULT_METADATA.url,
  sameAs: SOCIALS.map(({ HREF }) => HREF),
};

/** Home page: the site and the person it belongs to. */
export function homeJsonLd(): Record<string, unknown> {
  return {
    "@context": SCHEMA,
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${DEFAULT_METADATA.url}/#website`,
        name: DEFAULT_METADATA.siteName,
        url: DEFAULT_METADATA.url,
        description: DEFAULT_METADATA.description,
        inLanguage: "en",
        publisher: { "@id": PERSON_ID },
      },
      person,
    ],
  };
}

/** Blog post page. */
export function blogPostingJsonLd(post: Post): Record<string, unknown> {
  const url = `${DEFAULT_METADATA.url}/blog/${post.slug}`;
  return {
    "@context": SCHEMA,
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    url,
    mainEntityOfPage: url,
    inLanguage: "en",
    keywords: post.tags.length > 0 ? post.tags.join(", ") : undefined,
    author: {
      "@type": "Person",
      name: DEFAULT_METADATA.siteName,
      url: DEFAULT_METADATA.url,
    },
  };
}
