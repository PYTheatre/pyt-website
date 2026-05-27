# PYT Website — Build Log

This is the running record of the build. It is updated as work
proceeds so the project never loses its thread. Newest entries
are at the top.

- **Repo:** https://github.com/PYTheatre/pyt-website
- **Stack:** Astro (static) + Decap CMS + Cloudflare Pages
- **Workflow:** Claude builds & tests files; client uploads to GitHub via web UI; Cloudflare auto-deploys.

---

## Phase status overview

| Phase | What | Status |
|---|---|---|
| 0 | Prove the pipeline — minimal site, design tokens, mobile-first base, home page | ✅ Built & tested locally; awaiting first GitHub upload + Cloudflare connect |
| 1 | Decap CMS login (the fragile bit) | ⬜ Not started |
| 2 | Core pages (Shows, Show Detail, Programs, Donate, About) via CMS | ⬜ Not started |
| 3 | Cast pages + password gate, Google Sheets embed, Rentals, Shop, MailChimp | ⬜ Not started |
| 4 | Full EN/ES (Spanish) | ⬜ Not started |
| 5 | Rebrand test, docs, handoff | ⬜ Not started |

---

## Phase 0 — Prove the pipeline

**Goal:** Get a small, correct, real PYT home page live on Cloudflare Pages to prove the whole files→GitHub→Cloudflare→live-URL chain works before building everything.

### Built (all tested locally — clean builds, screenshotted at phone + desktop)
- `src/styles/tokens.css` — THE single source of truth for all colors & fonts. Rebrand = edit this one file.
- `src/styles/global.css` — mobile-first base styles, fonts, reusable buttons/pills/container. References tokens only.
- `src/components/Logo.astro` — placeholder "P" logo, built as a single-file swap for the real logo later.
- `src/components/Header.astro` — sticky header, pill nav, Donate button, mobile hamburger menu.
- `src/components/Footer.astro` — brand, link columns, copyright.
- `src/layouts/BaseLayout.astro` — shared page shell (head + header + content + footer).
- `src/pages/index.astro` — full home page: hero, 5 discovery cards, 3 impact stats, donation teaser. Matches the approved prototype.
- `astro.config.mjs` — static output, no server adapter (simplest/robust). `site` set to the Pages URL (update to pytnet.org at launch).
- `.nvmrc` — pins Node 22 (avoids a known Cloudflare build failure).
- `.gitignore` — keeps node_modules and build output OUT of GitHub.

### Tested
- ✅ Clean `npm run build` (zero errors).
- ✅ Rendered at 390px (phone) and 1280px (desktop) — both look right; fonts load.
- ✅ **Rebrand test passed:** swapped tokens to green + a different heading font; entire site re-skinned from one file. Reverted to pink/Newsreader. This proves late branding is a small edit, as promised to the client.

### Known things handled
- Cloudflare "Workers vs Pages" UI trap (documented late 2025): must explicitly choose **Pages** during setup, or a static site can land on the wrong infrastructure. Will guide the client around this.
- Internal nav links (/shows, /programs, etc.) intentionally 404 until those pages are built in later phases. Expected.

### Pending (needs the client)
- Create a free Cloudflare account.
- First GitHub upload of the Phase 0 files.
- Connect Cloudflare Pages to the repo (build command `npm run build`, output dir `dist`).
- Confirm the live `*.pages.dev` URL works.

### Decisions / notes
- Org is **`PYTheatre`** (NOT `peninsula-youth-theatre` as the handoff notes said). Confirmed from the live repo URL.
- Following the **decisions log** over the prototype's stale "Staff note" boxes (which still mention Cloudflare Access and Shopify Starter — both superseded).
- EN/ES language toggle deliberately deferred to Phase 4; the header is built to accommodate it later.
