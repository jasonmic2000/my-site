import type { MetadataRoute } from "next";
import { DEFAULT_METADATA } from "@/lib/consts";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/work", "/blog"];

  return routes.map((route) => ({
    url: `${DEFAULT_METADATA.url}${route}`,
    lastModified: new Date(),
  }));
}
