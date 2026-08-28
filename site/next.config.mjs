import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Transpile Spline packages
  transpilePackages: ['@splinetool/runtime', '@splinetool/react-spline'],
  // Tell Next.js where the site root is (fixes multi-lockfile workspace detection)
  outputFileTracingRoot: __dirname,
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react', 'three'],
  },
};

export default nextConfig;
