import type { NextConfig } from "next";
import { readFileSync } from "node:fs";

// GitHub Pages serves a project site under /<repo-name>/.
// Change this to match your repo name if you don't call it "resumewatching".
const repo = "resumewatching";
// Set GITHUB_PAGES=true only when building to deploy to Pages (see DEPLOY.md).
// Without it, `npm run dev` and a plain `npm run build` serve at "/".
const forPages = process.env.GITHUB_PAGES === "true";

// Read the actually-installed @viewlift/player-backup version at build time so the UI
// can display it. Falls back to "unknown" if it can't be read.
let playerBackupVersion = "unknown";
try {
  playerBackupVersion = JSON.parse(
    readFileSync("./node_modules/@viewlift/player-backup/package.json", "utf8"),
  ).version;
} catch {}

const nextConfig: NextConfig = {
  output: "export",
  // Pages serves under /<repo>/, so the deploy build needs this subpath prefix.
  basePath: forPages ? `/${repo}` : "",
  assetPrefix: forPages ? `/${repo}/` : "",
  images: { unoptimized: true },
  transpilePackages: ["@viewlift/player", "@viewlift/player-backup"],
  env: {
    NEXT_PUBLIC_PLAYER_BACKUP_VERSION: playerBackupVersion,
  },
};

export default nextConfig;
