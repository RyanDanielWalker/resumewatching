import type { NextConfig } from "next";

// GitHub Pages serves a project site under /<repo-name>/.
// Change this to match your repo name if you don't call it "resumewatching".
const repo = "resumewatching";
// Set GITHUB_PAGES=true only when building to deploy to Pages (see DEPLOY.md).
// Without it, `npm run dev` and a plain `npm run build` serve at "/".
const forPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  // Pages serves under /<repo>/, so the deploy build needs this subpath prefix.
  basePath: forPages ? `/${repo}` : "",
  assetPrefix: forPages ? `/${repo}/` : "",
  images: { unoptimized: true },
  transpilePackages: ["@viewlift/player", "@viewlift/player-backup"],
};

export default nextConfig;
