# VL Player SDK Playground

A live, no-install browser harness for testing the `@viewlift/player-backup` SDK —
built for QA to validate player builds without cloning a repo or running a dev server.

**Live:** [ryandanielwalker.github.io/resumewatching](https://ryandanielwalker.github.io/resumewatching/)

> Repo name is `resumewatching`; the UI title is **Player SDK Playground**. Same thing.

---

## What this is

Open the link, paste a token, pick a video — the real `@viewlift/player-backup` SDK loads
in the browser with full config control in the UI. QA needs no build step, no local
`.npmrc`, and nothing to install.

For local development or publishing a new build, see [Local development](#local-development)
and [`DEPLOY.md`](./DEPLOY.md).

---

## Features

- **Config-Based mode** — Video ID + Token + API Base URL, resolved through the real
  ViewLift API (entitlement, gist, live/DVR metadata). **Use this for most tests**, including
  anything that depends on CMS schedule/start times (e.g. DVR on live events).
- **Direct Source mode** — bypass the API and hand the player a raw manifest URL + MIME
  type. Good for quick playback checks; **no token required**, but no CMS metadata either.
- **Watch-history config** — toggle `enable` / `isExternal`, set interval, completion %,
  and watched %, and seed resume position via **Seek To** before launch.
- **Live watch-history log** — every `watchHistory` callback (`watchedTime`,
  `watchedPercentage`, `doneWatching`) streams into a console-style panel as it fires.
- **Appearance controls** — skin (`VL_ONE` / `VL_TWO` / `VL_THREE`), play-button shape,
  and colors; applied on relaunch.
- **Version badge** — the header shows the exact `@viewlift/player-backup` version
  installed in the build, so nobody's guessing which SDK they're testing.

---

## Who this is for

- **QA** — start with the live URL above. Config-Based mode needs a **token** (shared in
  your QA channel — not stored in this repo). Full test inputs, scenarios, and bug-report
  checklist: [`QA_TESTING_GUIDE.md`](./QA_TESTING_GUIDE.md).
- **Whoever's shipping a build** — bump `@viewlift/player-backup` in `package.json`, rebuild,
  and publish to GitHub Pages. Steps in [`DEPLOY.md`](./DEPLOY.md). Post release notes to
  QA (see `RELEASE_NOTES_*.md` in this repo for examples).

---

## Local development

Requires npm auth for the private `@viewlift/*` packages (you already need this if you can
deploy). Then:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Tech stack

Next.js 16 (static export) · React 19 · Tailwind CSS · `@viewlift/player-backup`

---

## Deployment

Static export, published to the `gh-pages` branch, served by GitHub Pages — no CI secrets
required. Full steps in [`DEPLOY.md`](./DEPLOY.md).
