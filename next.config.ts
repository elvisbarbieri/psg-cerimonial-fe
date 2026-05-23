import path from "node:path";
import type { NextConfig } from "next";

const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

const projectRoot = path.join(__dirname);

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  images: {
    minimumCacheTTL: ONE_WEEK_SECONDS,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "psg-cdn-perf-two.azureedge.net",
        pathname: "/gallery/**",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
        pathname: "/dms/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
