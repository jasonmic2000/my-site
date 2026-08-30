import type { MetadataRoute } from "next";
import { DEFAULT_METADATA } from "@/lib/consts";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: DEFAULT_METADATA.siteName,
    short_name: DEFAULT_METADATA.siteName,
    description: DEFAULT_METADATA.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F4F4F5",
    theme_color: "#18181B",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
