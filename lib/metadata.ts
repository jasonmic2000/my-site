import type { Metadata } from "next";
import { DEFAULT_METADATA } from "@/lib/consts";

const OG_IMAGE = "/opengraph-image";

/** Feed autodiscovery links; must be repeated wherever `alternates` is set. */
export const FEED_TYPES = {
  "application/rss+xml": "/feed.xml",
  "application/atom+xml": "/atom.xml",
  "application/feed+json": "/feed.json",
};

/**
 * Per-page metadata with a canonical URL and matching Open Graph/Twitter
 * fields. Page-level `openGraph`/`twitter`/`alternates` replace the root
 * layout's objects wholesale (and drop the `app/opengraph-image.tsx`
 * file-convention image), so shared fields and the image are repeated here.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  /** A page-specific share image; defaults to the site-wide one. */
  image?: { url: string; alt?: string };
}): Metadata {
  const fullTitle = `${title} - ${DEFAULT_METADATA.siteName}`;
  return {
    title,
    description,
    alternates: { canonical: path, types: FEED_TYPES },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: DEFAULT_METADATA.siteName,
      locale: DEFAULT_METADATA.locale,
      type: "website",
      images: [
        {
          url: image?.url ?? OG_IMAGE,
          width: 1200,
          height: 630,
          alt: image?.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      site: DEFAULT_METADATA.twitterHandle,
      creator: DEFAULT_METADATA.twitterHandle,
      images: [{ url: image?.url ?? OG_IMAGE, alt: image?.alt }],
    },
  };
}
