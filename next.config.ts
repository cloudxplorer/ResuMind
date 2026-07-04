import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Keep heavy native/server-only deps out of the webpack bundle so they
  // are loaded from node_modules at runtime. This is required for
  // @sparticuz/chromium on Vercel — otherwise the bundler tries to inline
  // the ~50 MB Chromium binary and breaks the serverless function.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
};

export default nextConfig;
