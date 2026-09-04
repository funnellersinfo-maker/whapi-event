import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Obligatorio para Cloudflare Pages (static export)
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
};

export default nextConfig;
