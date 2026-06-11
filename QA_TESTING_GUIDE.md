# QA Testing Guide — VL Player SDK Playground

A browser tool for testing the `@viewlift/player-backup` SDK, focused on
**resume-watching / watch-history** behavior. No install, no login — just open the URL.

**Live URL:** https://RyanDanielWalker.github.io/resumewatching/

---

## Test inputs

| Field | Value |
|---|---|
| **Video ID** | `27d6bcf0-875b-4575-8f90-ee3b6c57ac21` |
| **API Base URL** | `https://chsn.api.viewlift.com` |
| **Token** | *Shared separately — see your QA channel (Slack / 1Password). Not stored in this repo.* |

> **About the token:** it's a time-limited access token (JWT) that expires roughly every
> 30 days. If playback suddenly stops working with a token error, it has likely expired —
> ask for a fresh one. Don't paste tokens into bug reports or commit them anywhere.

---

## The two modes

**Config-Based** (default) — the normal path. You give a **Video ID**, **Token**, and
**API Base URL**, and the SDK fetches the stream and metadata from the backend.

**Direct Source** — bypasses the API. You give a raw **Source URL** and optional **MIME
type** (e.g. `application/x-mpegURL` for HLS). Use this to test playback of a stream URL
directly, without a token.

---

## Field reference

- **Video ID** — the content to load (Config-Based mode).
- **Token** — your access token; required for Config-Based.
- **API Base URL** — which backend environment to hit.
- **Seek To (seconds)** — sets the resume point (`watchHistory.watchedTime`). This is the
  key field for resume testing — e.g. `60` should start the video around the 1-minute mark.
- **Watch History card** — adjust the watch-history config per test (defaults in parens):
  - **enable** (on) — turn watch-history tracking on/off.
  - **isExternal** (on) — the `isExternal` flag.
  - **Interval (s)** (30) — seconds between watch-history callbacks.
  - **Completion %** (95) — `completionThreshold`, the % watched that counts as complete.
  - **Watched %** (40) — the `watchedPercentage` value sent in the config.
- **Skin** — visual theme: `VL_ONE`, `VL_TWO`, `VL_THREE`.
- **Play Button Shape** — `CIRCLE`, `SQUARE`, `ROUNDED`.
- **Colors** — progress bar, play button, and button background.
- **Launch Player** — (re)initializes the player with the current settings. Click it after
  any change.

---

## First test in 30 seconds

1. Open the live URL.
2. Stay on the **Config-Based** tab. Paste the **Token**; the Video ID and API Base URL
   above should already be filled (set them if not).
3. Click **▶ Launch Player**. The video should load and play.

---

## What to test (the point: resume watching)

The **Watch History** card lets you change the SDK's watch-history settings live, so you
can cover different scenarios. Defaults: callbacks every **30s** (`interval`), a **95%**
`completionThreshold`, **40%** `watchedPercentage`, and `enable`/`isExternal` both on. The
resume point comes from **Seek To**. Every callback is logged live in the **watch-history**
panel on the right.

1. **Resume from a timestamp** — set **Seek To** to e.g. `60`, Launch, and confirm the
   video starts near 60s rather than 0.
2. **Callback interval** — change **Interval (s)** (e.g. to `10`), Launch, play past it, and
   confirm new entries appear in the watch-history log at the configured cadence.
3. **Completion threshold** — set **Completion %** to different values (e.g. `50` vs `95`),
   watch past that point, and confirm completion triggers at the configured percentage.
4. **Appearance** — switch skins, play-button shapes, and colors; confirm the player
   re-renders correctly after Launch.
5. **Direct Source** — switch tabs, paste an HLS URL with MIME `application/x-mpegURL`,
   and confirm it plays without a token.

---

## Reading the watch-history log

The right-hand panel prints each callback with a timestamp and the raw JSON payload.
Check that `watchedTime` / `watchedPercentage` advance as the video plays, and that the
count increments about once per 30s.

---

## Common errors & troubleshooting

- **"Token is not valid — make sure it is a correct JWT or base64-encoded access token."**
  The token is wrong or expired. Get a fresh one.
- **"Video ID, Token and API Base URL are required."** — fill all three (Config-Based).
- **"Source URL is required."** — Direct Source mode needs a URL.
- **Video won't load / network errors** — confirm the token isn't expired, and try the
  API Base URL **with a `/v3` suffix** (`https://chsn.api.viewlift.com/v3`) — the SDK may
  expect the version path. Open the browser console (F12 → Console / Network) to see the
  actual API response.
- **Page looks unstyled, or 404s on `/_next/…` in the console** — that's a deployment
  issue, not a content bug. Flag it to Ryan rather than filing a player bug.

---

## Filing a bug

Please include:

- The **live URL** and which **mode** (Config-Based / Direct Source).
- The exact field values used — **Video ID, Seek To, skin, etc.** (but **never the token**).
- **Browser + OS** and version.
- **What you expected** vs. **what happened**.
- Any **console errors** (F12 → Console) and a **screenshot**.

Tested browsers: latest Chrome, Safari, Firefox, Edge.
