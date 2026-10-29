import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // App Router is stable in Next.js 13+
  },
  images: {
    remotePatterns: [],
  },
  // Transpile Three.js and related packages
  transpilePackages: ["three"],
};

export default nextConfig;
