import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://i.pinimg.com/**")]
  }
};

export default nextConfig;
