import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.10"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ghchart.rshah.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "zbripjkosdpraiscwkyf.supabase.co" },
    ],
  },
};

export default nextConfig;
