import type { Metadata } from "next";
import { DEFAULT_METADATA } from "@/lib/consts";

/**
 * Per-page metadata with a canonical URL and matching Open Graph/Twitter
 * fields. Page-level `openGraph`/`twitter` replace the root layout's objects
 * wholesale (and drop the `app/opengraph-image.tsx` file-convention image), so
 * shared fields and the image are repeated here.
 */
const OG_IMAGE = "/opengraph-image";

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} – ${DEFAULT_METADATA.siteName}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: DEFAULT_METADATA.siteName,
      locale: DEFAULT_METADATA.locale,
      type: "website",
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      site: DEFAULT_METADATA.twitterHandle,
      creator: DEFAULT_METADATA.twitterHandle,
      images: [OG_IMAGE],
    },
  };
}
