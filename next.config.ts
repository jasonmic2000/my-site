import mdx from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: true,
  experimental: {
    mdxRs: true,
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "mdx"],
};

export default mdx()(nextConfig);
