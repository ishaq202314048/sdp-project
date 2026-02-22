import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Explicitly set the project root to silence the workspace root warning
    root: __dirname,
  },
};

export default nextConfig;
