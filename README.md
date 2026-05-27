# Peninsula Youth Theatre — Website

The pytnet.org website, built with **Astro** (static site) + **Decap CMS**,
hosted on **Cloudflare Pages**.

- **Live (staging):** set after first Cloudflare deploy (`*.pages.dev`)
- **Build log / project status:** see `BUILD_LOG.md`

## For staff
Day-to-day content editing happens through the CMS (added in a later
phase) — no code required. Plain-language guides will live in `/docs`.

## For a future developer
- `npm install` then `npm run dev` for a local preview.
- `npm run build` produces the static site in `dist/`.
- All colors and fonts live in `src/styles/tokens.css` — change branding there.
- Cloudflare Pages settings: build command `npm run build`, output directory `dist`.
