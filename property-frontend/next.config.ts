import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "xpertbid.com" },
      { protocol: "https", hostname: "www.xpertbid.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
