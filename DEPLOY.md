# Deploying resumewatching to GitHub Pages

Deploy the VL Player SDK Playground to **your own** GitHub repo so QA can test it.
We build **locally** (your Mac already has npm login + the private `@viewlift` packages)
and publish the static output to a `gh-pages` branch. No CI secrets required.

Final URL will be: `https://<your-username>.github.io/resumewatching/`

---

## One-time prerequisites

- You can build the project locally already (`npm run build` succeeds on your Mac).
- The `next.config.ts` change for Pages is in place (sets `output: "export"` + `basePath`).
  > If you name your repo something other than `resumewatching`, edit the `repo`
  > constant near the top of `next.config.ts` to match — the subpath must match the repo name.

---

## Step 1 — Point this clone at your own repo

Keep Sahil's repo as `upstream` (for pulling future changes), make your repo `origin`.

**With the GitHub CLI (`gh`):**
```bash
cd ~/Projects/resumewatching
git remote rename origin upstream
gh repo create resumewatching --public --source=. --remote=origin --push
```

**Or manually** (create an empty repo named `resumewatching` at github.com/new first):
```bash
cd ~/Projects/resumewatching
git remote rename origin upstream
git remote add origin https://github.com/<your-username>/resumewatching.git
```

## Step 2 — Commit the Pages config and push `main`

Only commit the config change. **Do not** commit `.github/workflows/deploy.yml` —
that workflow targets a CI build that needs an npm token and is broken for a
TypeScript config. We're not using it.

```bash
git add next.config.ts
git commit -m "Configure static export + basePath for GitHub Pages"
git push -u origin main
```

## Step 3 — Build the static site locally

The `GITHUB_PAGES=true` flag switches on the `/resumewatching` subpath (see `next.config.ts`).
A plain `npm run build` (without the flag) builds for the root path instead.

```bash
GITHUB_PAGES=true npm run build      # produces ./out
```

## Step 4 — Publish `out/` to the `gh-pages` branch

`.nojekyll` is required — without it GitHub ignores Next's `_next/` folder and the site breaks.

```bash
touch out/.nojekyll
npx gh-pages -d out -t true          # -t includes dotfiles like .nojekyll
```

This creates/updates the `gh-pages` branch on your `origin` and pushes it.

## Step 5 — Turn on GitHub Pages

In your repo on github.com:
**Settings → Pages → Build and deployment**
- **Source:** Deploy from a branch
- **Branch:** `gh-pages` / `(root)` → **Save**

Wait ~1 minute for the first publish.

## Step 6 — Verify

Open: `https://<your-username>.github.io/resumewatching/`

Check that:
- The page loads with styling (not a blank/unstyled page → means basePath is correct).
- "Launch Player" initializes the player.
- The browser console has no 404s for `/_next/...` assets.

Send that URL to QA.

---

## Re-deploying after new changes

```bash
git add -A && git commit -m "..." && git push       # update main
GITHUB_PAGES=true npm run build
touch out/.nojekyll
npx gh-pages -d out -t true                           # republish
```

The live site updates within ~1 minute.

---

## Notes

- **Public vs private:** A GitHub Pages site is publicly reachable by URL even if the repo
  is private. There are no secrets baked into this build (the API token is entered at
  runtime by the tester), so a public test URL is fine.
- **Want auto-deploy on every push instead?** That requires GitHub Actions with an
  `NPM_TOKEN` repo secret (to install the private `@viewlift` packages in CI) and a
  fixed workflow. Ask and I'll set it up — but the local-build flow above is the
  fastest way to get QA a working URL.
