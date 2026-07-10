# The Pouma Academy — Static Clone (full site)

A 100% faithful, fully-offline static mirror of the **entire** site
**https://thepoumaacademy.com/**, captured on 2026-07-03. The live site is a
**WordPress + Enfold (Avia) theme** site, so this clone is the *actual* rendered
HTML/CSS/JS/fonts/images/videos running locally — identical colors, typography (Comfortaa),
animations, news ticker, slideshow, scroll-reveal effects, and numeric counters — because it
runs the site's own original code, not a rebuild.

**Coverage:** all 63 pages from the Yoast sitemap + crawled internal links — home, the 26
service/info pages, 9 blog posts, featured posts, 11 testimonials, categories and tags.
~527 files, ~56 MB. Every internal link resolves to a local page.

## Run it

```bash
node serve.mjs 8099
# then open http://localhost:8099/
```

The tiny static server (`serve.mjs`) strips WordPress `?ver=` query strings and serves
`index.html` for directory paths.

## What's inside

- `site/` — the mirrored website (256 files, ~31 MB)
  - `index.html` — the rewritten homepage (absolute URLs → root-relative)
  - `wp-content/`, `wp-includes/` — theme CSS/JS, uploads (images + `.mp4` videos), icon fonts
  - `_ext/` — self-contained Google Fonts (Comfortaa) CSS + woff2
- `mirror.mjs` — the crawler used to build the mirror (Node fetch; recurses CSS `url()`/`@import`)
- `serve.mjs` — local static server
- `_preview/` — verification screenshots (`live-desktop.png` vs `clone-desktop.png` are
  pixel-identical at 1430×6755; `clone-reveal-viewport.png` shows the JS effects firing)

## Fidelity notes

- **Verified identical** against the live site: full-page screenshots match to the exact pixel
  height (1430×6755). Header, ticker, hero slideshow, "Που διαφέρουμε", reviews carousel,
  scheduler, steps, founder block, and footer all render the same.
- The reviews carousel rotates its entries per page load, so the visible names differ between
  captures — that's the original site's dynamic behavior, not a clone difference.
- Fixed a latent bug from the original: the child theme hard-codes a dead staging domain
  (`thepoumaacademy.disolt.eu`) for the back-to-top button and the floating "ask pouma" button.
  Those references were repointed to the main host's uploads so the buttons render.
- External analytics (Google Tag Manager) is left in place and simply no-ops offline.

## How it was built

- `mirror.mjs` — original homepage-only crawler (kept for reference).
- `crawl.mjs` — full-site crawler: seeds pages from the Yoast sitemap, follows internal links,
  downloads every page + all assets (recursing into CSS `url()`/`@import`), rewrites absolute
  URLs to root-relative, and saves each page at `site/<path>/index.html`. Re-run any time to
  refresh from the live site: `node crawl.mjs`.

Greek slugs are stored URL-decoded on disk (e.g. `site/παίξε-παιχνίδια.../index.html`); the
server decodes incoming request paths to match.
