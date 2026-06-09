import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@viewlift/player", "@viewlift/player-backup"],
};

export default nextConfig;
