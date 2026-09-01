import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  transpilePackages: [
    "@splinetool/runtime",
    "@splinetool/react-spline",
  ],

  outputFileTracingRoot: path.dirname(
    fileURLToPath(import.meta.url)
  ),

  experimental: {
    optimizePackageImports: [
      "@phosphor-icons/react",
      "three",
    ],
  },
};

export default nextConfig;
