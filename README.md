# basemnt-docs

Static documentation site for [base/mnt.ai](https://basemnt.ai), deployed to Cloudflare Pages
at [docs.basemnt.ai](https://docs.basemnt.ai). Built with Astro; the theme (tokens, HUD
chrome, typography) is copied from `basemnt-landing` — `basemnt-landing/DESIGN-HANDOFF.md`
is the source of truth for the design system.

## Structure

```
src/
  components/Code.astro       # code block chrome used by .astro pages
  content/docs/               # markdown pages (quickstart, API reference, agents)
  layouts/                    # BaseLayout (shell) + DocLayout (nav/sidebar/pager)
  pages/                      # index.astro, 404.astro, [...slug].astro (content routes)
  plugins/remark-code.ts      # remark+rehype: fenced code → terminal chrome + copy button
  styles/code-theme.ts        # Shiki syntax theme (landing API-block palette)
  styles/theme.css            # design tokens and primitives
```

Code blocks get the terminal header (traffic-light dots, `method`/`path` chips) via fence
meta strings:

````
```bash method=POST path=/v1/chat/completions
curl ...
```
````

`title=foo.sh` renders a filename chip instead.

## Development

```bash
bun install
bun run dev        # http://localhost:4321
bun run build      # static output in dist/
bun run preview    # serve dist/ locally
```

## Deploying to Cloudflare Pages

The project includes `wrangler.json` with `pages_build_output_dir: dist`.

One-time setup (creates the Pages project and connects the custom domain):

```bash
bunx wrangler pages project create basemnt-docs
bunx wrangler pages deploy dist   # then add docs.basemnt.ai in the Cloudflare dashboard
```

Direct deploy from CI or your machine:

```bash
bun run build
bun run deploy    # wrangler pages deploy dist
```

Git-integrated deploys (recommended): in the Cloudflare dashboard, create a Pages project
connected to this repo with:

- **Build command:** `bun run build`
- **Build output directory:** `dist`
- **Environment:** `BUN=1` (Cloudflare detects the lockfile automatically)

## Adding pages

Add a `.md` file under `src/content/docs/` with frontmatter:

```yaml
---
title: New Page
description: One-line summary.
section: start | api | agents
order: 3
method: POST          # optional — endpoint chip
path: /v1/thing       # optional — endpoint chip
---
```

Sidebar order follows `section` then `order`.
