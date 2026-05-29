# PYT Website — Build Log

Phase-by-phase history of work completed. Newest at the top.

**For current project state, read `HANDOFF.md` and `IN_FLIGHT.md`. For rules, read `PROJECT_RULES.md`. For locked decisions, read `DECISIONS.md`.**

---

## Phase status overview

| Phase | What | Status |
|---|---|---|
| 0 | Pipeline | ✅ Complete |
| 1 | Decap CMS login | ✅ Complete |
| 2 | Core pages (Shows, Programs, Donate, About, Casting) | ✅ Complete |
| 2.5 | Sponsorship feature | ✅ Complete |
| 2.6 | Stories on Stage section | ✅ Complete |
| 2.7 | Soapbox donate popup wiring | ✅ Complete |
| 2.8 | Editable page content (home + page furniture) | ✅ Complete |
| 2.9 + 2.10 | Employment page + Cast Pages nav removal + Board of Directors | 🟡 Built; awaiting client upload (see IN_FLIGHT.md) |
| 3.1 | MailChimp newsletter signup | 🟡 Blocked on embed code (see IN_FLIGHT.md) |
| 3.2 | Rentals catalogue | ⬜ Not started |
| 3.3 | Shop (Shopify embed) | ⬜ Not started |
| 3.4 | Cast Pages (smaller scope than originally planned) | ⬜ Not started |
| 3.5 | Google Sheets embed | ⬜ Likely folds into 3.4 |
| 4 | EN/ES bilingual | ⬜ Not started |
| 5 | Rebrand test, docs, handoff | ⬜ Not started |

---

## Phase 2.10 — Employment page (also carries Phase 2.9) — built 2026-05-28

**Goal:** Add an Employment page with paid roles and volunteer opportunities. Also carries Phase 2.9 changes: remove Cast Pages from nav, add Board of Directors to About.

**Built:**
- New `/employment` page with two sections (paid roles and volunteer opportunities), each with auto-hide if empty.
- Cast Pages removed from main nav (header) and footer Community column.
- Board of Directors section added to About page (renders from a `board_members` list field in About Page settings; section hides if list is empty).
- CMS forms for Employment Page settings and Board fields.

**Files affected:**
- New: `src/pages/employment.astro`, `src/content/settings/employment-page.json`
- Updated: `src/pages/about.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `public/admin/config.yml`, `BUILD_LOG.md`

**Sandbox tests:** Clean build (12 pages). Employment page renders at 390px and 1280px. Auto-hide verified. Cast Pages confirmed absent from nav. Board section rendering verified with seeded examples (reverted before packaging).

**See `IN_FLIGHT.md` for upload status and the zip location.**

---

## Phase 2.8 — Editable page content ✅ Complete (2026-05-28)

**Goal:** Make all words/images/links/numbers editable through the CMS. Layout stays in code.

**Built:**
- Settings files: `home-page.json`, `shows-page.json`, `programs-page.json`, `footer.json`.
- Home page rewired to read from `home-page.json`. Hero supports an editable italic accent word. "Now Playing" poster auto-selects the next upcoming show.
- Shows page and Programs page heroes wired to their settings files.
- Footer tagline and copyright text wired to `footer.json`.
- CMS forms added to Site Settings for: Home Page, Shows Page (intro), Classes & Camps Page (intro), Footer.
- "For staff:" helper tips removed from Shows and Programs public pages.

**Key decision:** Content-only editability. Staff edit words, images, links, numbers — not layout. (See `DECISIONS.md`.)

---

## Phase 2.7 — Soapbox donate popup wiring ✅ Complete (2026-05-27)

**Goal:** Wire the live Donate Now button on `/donate` to PYT's NonprofitSoapbox donation modal.

**Built:**
- Soapbox loader script added to `BaseLayout.astro` (loads on every page after `window.load`).
- Donate Now button on `/donate` uses `href="?sbxdonationsmodal=sbx1"` to trigger the popup.
- Subdomain confirmed: `pyt.secure.nonprofitsoapbox.com`.

**Decision logged:** Only `/donate`'s button triggers the popup. Header and home page Donate buttons link to `/donate` so donors see context first.

**Known issue (as of 2026-05-28):** Donate button on `/donate` requires multiple clicks before the popup opens. Likely the Soapbox loader race condition; diagnosis in progress. See `IN_FLIGHT.md`.

---

## Phase 2.6 — Stories on Stage ✅ Complete (2026-05-27)

**Goal:** Promote Stories on Stage from one program-among-many to its own season-style presentation.

**Built:**
- New `storiesOnStage` content collection (Astro side + Decap side).
- New `/stories-on-stage` page: top audition strip, hero, lineup grid (2 seeded productions, expandable), auditions section, explainer.
- Removed Stories on Stage from Classes & Camps (deleted `src/content/programs/stories-on-stage.md`; removed from `program_type` enum).
- Stories on Stage added to nav between Shows and Classes & Camps.

**Key decisions:** Stories on Stage productions don't have detail pages (whole season lives at one URL). Two CTAs per production (Buy Tickets + School Bookings, each independently optional). No cast pages for SoS productions. Auditions section uses Google Form for calendar conflicts.

---

## Phase 2.5 — Sponsorship feature ✅ Complete (2026-05-27)

**Goal:** Add sponsorship-as-a-product with two ladders, distinct from donations.

**Built:**
- New `/sponsor` page with two tier groups: show-level (4 tiers) and season-level (3 tiers).
- Show-aware flow: clicking "Sponsor This Show" on a show detail page passes `?show=<slug>`, banner displays "Sponsoring: [Show Title]", show-tier inquire buttons get the show name in their mailto subject.
- Two sponsor CTAs on Shows list page, one on each show detail page, one pointer section on Donate page.
- All tier copy and donation URLs editable via CMS.

**Key decisions:** Sponsorship is visually and conceptually distinct from donations. Per-tier `donation_url` field (blank = mailto fallback). All seven tier names and amounts approved as-proposed by client.

---

## Phase 2 — Core pages ✅ Complete (2026-05-27)

**Goal:** Turn Shows, Programs, Donate, About, Casting into real CMS-editable pages with starter content.

**Built (broad strokes):**
- CMS collections: Shows (folder), Programs (folder), Site Settings (file collection with multiple records).
- Pages: `/shows/index`, `/shows/[slug]`, `/programs`, `/donate`, `/about`, `/casting`.
- Reusable component: `PageHero.astro`.
- Programs page has client-side filtering by type and season.
- Donor tiers, donate-page copy, about-page, casting-page seeded.

**Staff workflow verified by client:** Added a fake show via CMS, confirmed it appeared on live site, deleted it. Edited About page, confirmed change went live.

---

## Phase 1 — Decap CMS login ✅ Complete (2026-05-27)

**Goal:** Stand up the form-based CMS so PYT staff can edit content without code.

**Built:**
- `public/admin/index.html` — Decap CMS admin page (Decap 3.10.1). Script MUST be in `<body>` (not `<head>`).
- `public/admin/config.yml` — GitHub backend, OAuth via `/api/auth`, one starter collection.
- `functions/api/auth.js` and `functions/api/callback.js` — Cloudflare Pages Functions for OAuth flow.
- GitHub OAuth App "PYT CMS" created in PYTheatre org.
- Cloudflare env vars `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` set (encrypted).
- `src/content/settings/donation-campaign.json` — first CMS-editable file. Home page reads its values.

**Gotchas resolved:**
1. GitHub `Ov23li...` Client ID prefix used for both OAuth Apps and GitHub Apps in 2026 — verify by checking which tab the app lives in. (Past Claude wrongly diagnosed from the prefix.)
2. Decap script MUST be in `<body>` (not `<head>`). Wrong placement caused `Cannot read properties of null (reading 'appendChild')`.
3. Decap postMessage handshake order: popup listens first, posts `authorizing:github`, waits for opener echo, then posts success payload using `e.origin`.
4. Cloudflare's transient "internal error" deploy failures — retry the deploy.

---

## Phase 0 — Pipeline ✅ Complete

**Goal:** Set up the basic Astro + Cloudflare Pages deployment pipeline.

**Built:**
- Initial Astro 6 project structure.
- Design tokens in `src/styles/tokens.css` (CSS custom properties for colors, fonts, spacing).
- `src/components/Logo.astro` — placeholder P mark.
- `src/components/Header.astro` and `src/components/Footer.astro` — site chrome.
- `src/layouts/BaseLayout.astro` — wraps every page.
- `src/pages/index.astro` — first home page with hardcoded prototype content (later moved to CMS in Phase 2.8).
- `astro.config.mjs`, `.nvmrc` (Node 22), `.gitignore`.
- Cloudflare Pages project connected to GitHub repo, auto-deploy from `main` branch.

The design tokens system is a key architectural choice: every color, font, and spacing value comes from one CSS file, so rebranding is a one-file edit.
