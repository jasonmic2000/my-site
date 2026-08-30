import type { MetadataRoute } from "next";
import { DEFAULT_METADATA } from "@/lib/consts";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${DEFAULT_METADATA.url}/sitemap.xml`,
  };
}
