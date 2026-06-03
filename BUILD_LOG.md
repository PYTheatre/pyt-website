# PYT Website — Build Log

Phase-by-phase history of work completed. Newest at the top.

**New Claude session: read `START_HERE.md` first.** For current state, read `START_HERE.md` and `IN_FLIGHT.md`. For rules, read `PROJECT_RULES.md`. For locked decisions, read `DECISIONS.md`. This build log is *history* — accurate for how we got here, but not the place to read off current state.

---

## Build hardening — runtime_minutes can no longer break the whole site (2026-06-03)

**Goal:** A single bad value in a show's "Runtime (minutes)" field had taken the *entire* site build down (the 2026-06-02 deploy saga: text/blank in `runtime_minutes` on new shows → schema rejected it → nothing rebuilt → no new content went live). Make that class of failure impossible, and add a friendly form guard.

**Built (two layers):**
- **B — tolerant schema (the important one).** In `src/content.config.ts`, `runtime_minutes` changed from `z.number().int().optional()` to `z.coerce.number().int().positive().optional().catch(undefined)`. Now a bad value (text, empty string from a cleared field, 0, a decimal) is quietly treated as "no runtime" for that ONE show — the runtime row just doesn't render — and every other page still builds and deploys. One typo can never again take the whole site offline.
- **A — CMS form guard.** In `public/admin/config.yml`, the `runtime_minutes` field gained `min: 1, max: 600, step: 1` and a `pattern` (`^[0-9]*$`) with a plain-language error ("Enter a whole number of minutes only…"). Decap shows this inline in the form before a bad value can be saved. Field was already a `number` widget; this tightens it.

**Files changed:** `src/content.config.ts`, `public/admin/config.yml`. No `src/content/**` touched.

**Tested in sandbox (B, fully verified):** injected `runtime_minutes: "about an hour"` into a real show file → clean build, 18 pages, affected page rendered with the runtime row correctly hidden. Repeated with `runtime_minutes: ""` → also clean. Restored real data → clean 18-page build. Phone (390px) + desktop (1280px) screenshots of a show page confirmed healthy.
**Not verifiable in sandbox (A):** the Decap form's inline pattern error only runs live in the `/admin` editor. Config validated as well-formed YAML; live behavior needs a quick client check (try saving letters in the field). Decap's pattern validation has a flaky history, so B is the real safety net and A is the polish on top.

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
| 2.9 + 2.10 | Employment page + Cast Pages nav removal + Board of Directors | ✅ Complete |
| 2.12 | Judy Robe Awards page + About staff/banner + Casting banner + Home redesign | 🟡 Built + handed over; confirm live |
| 2.7→fix | Donate button — switched from laggy popup to hosted Soapbox link | 🟡 Built + handed over (v6); confirm live |
| 3.1 | MailChimp newsletter signup | ✅ Complete (verified live) |
| 3.2 | Rentals page (categories + inquiry form) | ✅ Complete (verified live) |
| 3.3 | Shop (Shopify embed) | ⬜ Blocked — no Shopify store yet |
| 3.4 + 3.5 | Cast Pages (password gate + embedded schedule + linked private cast list) | ✅ Complete (verified live) |
| 4 | EN/ES bilingual | ⬜ Not started |
| 5 | Rebrand test, docs, handoff | ⬜ Not started |

---

## Shows page — Audition + Tickets buttons — built + verified live 2026-06-02

Client request: on the `/shows` list page, replace the single "See details →" link on each show card with two action buttons — **Auditions** and **Tickets** — keeping a small "See details" link as well.

**Behavior (client-approved decisions):**
- **Tickets button:** active pink button when `ticketing_url` is set; greys out to "Tickets coming soon" when blank. (Mirrors the detail page.)
- **Auditions button:** HIDDEN entirely when `audition_url` is blank. When set: shows "Auditions" if upcoming; greys out to "Auditions closed" (unclickable) once `audition_date` has passed.
- **"See details →"** link kept beneath the buttons, still linking to the show detail page.
- The card is no longer one big wrapping link (can't nest links). The poster image and the "See details" link both go to the detail page; the two buttons are independent.

**Important caveat (told to client):** the audition auto-close happens at BUILD time, not live — the button flips to "closed" on the next site rebuild after the date passes, not at the stroke of midnight. Fine for audition dates.

**Files changed (3):**
- `src/content.config.ts` — added `audition_url` (string, optional) and `audition_date` (date, optional) to the shows schema.
- `src/pages/shows/index.astro` — rebuilt the card markup + added `.show-actions` / `.btn-disabled` styles.
- `public/admin/config.yml` — added "Audition sign-up link" and "Audition date" fields to the Shows form.

**NOT changed (Rule 2):** no `src/content/shows/*.md` files. Existing shows render fine — Auditions button stays hidden until staff add a link via CMS. Reminder issued to client to hard-refresh/incognito the CMS to see the new fields.

**Sandbox tests:** Clean build (16 pages). Verified all states via two throwaway test show files (active audition + tickets; closed audition + no tickets) screenshotted at 1280px and 390px, then deleted. Real states confirmed: SIX & Frog show Tickets only (no audition link); Wind shows "Tickets coming soon"; test shows showed active Auditions, "Auditions closed", and the greyed ticket state. **Could not verify:** that real audition sign-up URLs work (needs live click-test once entered). **Confirmed live by client 2026-06-02.**

**Process note:** Briefly edited real show .md files to test states and hit a YAML error (duplicate `ticketing_url`); restored from backup immediately and switched to throwaway test files instead. Reinforces Rule 2 — don't touch `src/content/`.

---

## Placeholder branding refresh — built + verified live 2026-06-02

Client-requested interim branding while awaiting PYT's official design. All placeholder, all centralized, trivially swappable when the real brand arrives.

**1. Logo (header + footer).** Replaced the placeholder "P"-in-a-pink-box mark with the client's PYT wordmark image (three serif letters: P pink, Y green, T blue). The supplied file had a solid black background; processed it to transparent + tight-cropped, saved as `public/uploads/pyt-logo.png` (945×324). Used in BOTH `Logo.astro` (header — image beside the "Peninsula Youth Theatre" wordmark; mark-only on phones) and `Footer.astro` (footer — image stacked above the name). NOTE: the footer had its OWN separate `footer-mark` "P" — it does not use the shared Logo component, so it needed updating separately. Watch for this if the logo changes again.

**2. Accent color.** Changed `--accent` from the old pink `#e85a8c` to the logo's pink `#c0287b` (deeper magenta), with `--accent-deep` `#97215f` and `--accent-soft` `#fbeaf3`. One-file edit in `tokens.css`; re-skins the whole site (buttons, links, etc.). Client chose the "safe" single-accent approach — did NOT spread green/blue across the site; the logo itself carries the three colors.

**3. Fonts → Nunito (both heading & body).** Swapped Inter (body) + Newsreader (serif headings) for Nunito everywhere. Client's explicit decision: one font for everything, relying on size + capitalization to distinguish headings (no serif/sans contrast). Nunito is free via Google Fonts under SIL Open Font License (verified) — fine even for the eventual real launch if they stick with it. Two-file change: the `@import` line in `global.css` now loads Nunito (weights 400/500/600/700 + italics, matching what the site uses); `tokens.css` points both `--font-heading` and `--font-body` at Nunito.

**Files affected:**
- New: `public/uploads/pyt-logo.png`
- Updated: `src/components/Logo.astro`, `src/components/Footer.astro`, `src/styles/tokens.css`, `src/styles/global.css`

**Shipped as:** `PYT-upload-jun02-v7-branding.zip` (logo + color — confirmed live), then logo+fonts followed. Footer fix + Nunito ultimately uploaded as three loose files (Footer.astro, global.css, tokens.css) because the client's Mac would not unzip the v9 archive — loose-file upload via GitHub's folder-specific upload pages worked. (Lesson: loose-file upload to `/upload/main/<folder>` is a viable fallback when unzip fails on the client side.)

**Sandbox tests:** Clean build (16 pages) at each step. Header + footer logo verified via Playwright screenshots at 1280px and 390px. **Could NOT verify Nunito's actual rendering in-sandbox** — the sandbox network blocks Google Fonts, so screenshots showed a fallback sans, not Nunito. Layout integrity with the change was confirmed; the font's true appearance was confirmed LIVE BY CLIENT 2026-06-02.

**Open follow-up (minor):** Headings use weight 500 with tight negative letter-spacing, originally tuned for the Newsreader serif. With Nunito they may read a touch light at large sizes. Client reviewed live and is happy; if a future session is asked to make headings bolder, bump the `h1,h2,h3,h4` rule in `global.css` from `font-weight: 500` to `600`.

---

## Phase 2.12 — Judy Robe Awards page + About/Casting changes — built 2026-05-29

A batch of client-requested content changes:

**1. Judy Robe & Spirits Awards page (new).** `/judy-robe-spirits-awards`, NOT in the main nav. Linked from both the About page (in the story column) and the Casting page (under the CTA). Has editable intro/description (placeholder copy for now), one optional photo (banner-style, hidden when empty), and a winners list (year + name) that scales cleanly to 30+ entries.
- New: `src/pages/judy-robe-spirits-awards.astro`, `src/content/settings/judy-robe-spirits-awards.json`

**2. Staff section on About page.** Mirrors the Board of Directors pattern (name, PYT title, optional extra detail, optional headshot with initials fallback). Sits ABOVE the Board section. Auto-hides if empty. (Note: per client, this lives on About, NOT Employment.)

**3. About page banner image.** New optional `banner_image` field — a short wide banner under the title. Hidden when empty.

**4. Casting page photo resized.** Changed from a full-width 16:7 hero that dominated the top to a contained, short banner strip (shown only when a photo exists). Title now leads the page.

**5. Home page redesign.** Added an optional `hero_image` field — a wide photo banner under the intro text (hidden when empty). The auto-selecting "Now Playing" show feature was first relocated below the hero, but the wide-stretched treatment looked poor; per client decision (2026-05-29) the Now Playing feature was **removed from the home page entirely**. Home page now flows: hero (intro + optional photo banner) → Join us cards → Impact → Donation teaser. The show-selection logic and poster styles were removed from index.astro. (`now_playing_label` CMS field is now unused but left in config harmlessly.)

**Files affected:**
- New: `src/pages/judy-robe-spirits-awards.astro`, `src/content/settings/judy-robe-spirits-awards.json`
- Updated: `src/pages/about.astro`, `src/pages/casting.astro`, `src/pages/index.astro`, `public/admin/config.yml`

**NOT included in upload (Rule 2 — CMS-managed, live is source of truth):** `about-page.json`, `casting-page.json`, `home-page.json`. The page templates handle the new fields being absent, so they render fine against the live JSON; staff add banner/staff/hero photo via CMS when ready.

**Sandbox tests:** Clean build (14 pages). Verified: both Judy Robe links present; Judy Robe page renders with 3 placeholder winners and handles a 30-entry list; About staff section and banner render when populated and hide when empty; Board still renders; old full-width Casting hero removed; new contained banner shows only when a photo exists. Screenshots at 390px and 1280px checked.

**Still pending (NOT built — need info from client):**
- Sponsorship tiers → direct Soapbox popups (#5): needs per-tier Soapbox data-ids / donation URLs. Same Soapbox-info dependency as the Donate button fix.
- Matching-gifts search embed on Donate (#6): needs the third-party embed code (likely Double the Donation / 360MatchPro).

---

## Phase 3.4 + 3.5 — Cast Pages — built 2026-05-29

**Goal:** Password-protected cast pages, one per show, not in the nav, linked from newsletters. Each holds an embedded rehearsal schedule and a link to a private cast list, plus typed notes.

**Built:**
- New: `src/pages/cast/[slug].astro` — dynamic page template with a soft client-side password gate.
- New: `castPages` content collection (`src/content.config.ts`) and CMS "Cast Pages" folder collection.
- New: sample entry `src/content/cast-pages/sample-delete-me.md` (password "demo", clearly marked for deletion).

**How it works:**
- Each cast page = one CMS entry (one reusable template, many pages). Fields: show title, password (per page), optional intro, cast-list LINK, rehearsal-schedule EMBED, optional notes.
- URLs are `/cast/<slug>` — staff set an unguessable slug. Not in nav.
- Soft client-side password gate: content hidden until correct password typed; unlock remembered for the browser session. **Explicitly NOT real security** — acceptable only for non-sensitive (role-only) content.

**Key privacy decision (see DECISIONS.md):** The rehearsal schedule is embedded but must be role-names-only. The named cast list is NOT embedded — it's a private Google Sheet the page only links to, so Google enforces login-based access. This split was made after the sample sheet was found to contain 100+ children's full names + locations + times, which a soft gate cannot protect.

**Sandbox tests:** Clean build (15 pages incl. /cast/sample-delete-me). Gate verified interactively: content hidden on load, wrong password rejected with error, correct password reveals content and hides gate, unlock persists for the session. Sheet-URL conversion verified across edit/gid/pubhtml/preview/empty formats. Cast list renders as a link button (not embedded); schedule renders as a single iframe. Screenshots of locked + unlocked states at 1280px checked.

**Cannot verify in sandbox:** Whether the live Google Sheet embed actually displays its contents — that depends on the sheet's Google sharing setting and must be tested live. The sandbox is network-restricted so the embed area renders blank here.

---

## Phase 3.2 — Rentals page — built 2026-05-29

**Goal:** A `/rentals` page with an intro, a grid of rental categories (each with a photo, editable/expandable via CMS), and an inquiry form that emails PYT.

**Built:**
- New: `src/pages/rentals.astro` — hero intro, category grid (auto-hides if empty), and inquiry form.
- New: `src/content/settings/rentals-page.json` — starter content with 4 placeholder categories (Costumes, Props, Set Pieces, Furniture).
- New: 4 on-brand SVG placeholder images in `public/uploads/` (rental-placeholder-*.svg).
- Updated: `public/admin/config.yml` — "Rentals Page" CMS form, including an editable/reorderable categories list with photo upload per category, and a field for the Formspree endpoint.

**Key decisions:**
- Inquiry form delivery: **Formspree** free tier (endpoint `xnjrrdkb`), chosen because Cloudflare-native email needs the `pytnet.org` domain verified, which isn't done until Phase 5. Formspree free tier allows exactly 2 recipient emails — matches `info@pytnet.org` + `lhatten@pytnet.org`. Can switch to Cloudflare-native in Phase 5 if desired.
- Form fields: name, email, organization (optional), what they're looking for, preferred dates. Honeypot anti-spam included.
- Photo treatment for uneven future photo quality: fixed 4:3 frame + object-fit cover + gradient overlay + soft shadow + lazy load, so mismatched/low-quality photos still look tidy.
- Categories list is staff-expandable; section auto-hides when empty.
- Form has a mailto fallback if the Formspree endpoint field is ever blank, so the page never shows a dead form.

**Sandbox tests:** Clean build (13 pages). Verified in built output: Formspree endpoint wired, all 4 categories render, all placeholders present, all form fields present. Empty-categories case tested — section hides cleanly (0 cards), form remains. Screenshots at 390px and 1280px both look right.

**Cannot verify in sandbox:** Whether form submissions actually reach both inboxes — requires the live site and a real test submission. Recommend testing after deployment.

---

## Phase 3.1 — MailChimp newsletter signup ✅ Complete (verified live 2026-05-29)

Verified by client via a live test submission — MailChimp returned its "profile updated" confirmation, so the form is working end to end.



**Goal:** Add a `/subscribe` page with PYT's MailChimp form embedded natively (styled with site tokens, not MailChimp's purple branding). Add a "Newsletter signup" pointer link in the footer's Community column.

**Built:**
- New: `src/pages/subscribe.astro` — dedicated signup page with Email (required), First Name, Last Name, and all 7 interest checkboxes. Phone number intentionally omitted (client decision). MailChimp `mc-validate.js` and slim jQuery loaded only on this page.
- Updated: `src/components/Footer.astro` — "Newsletter signup" link added to Community column, pointing to `/subscribe`.

**Key decisions:**
- Phone field omitted per client decision.
- All 7 interest checkboxes included (the 7th, "Bringing PYT to Your School," was new in the embed code; client approved keeping all 7 as-is).
- Form action URL, field names, interest group IDs, and honeypot input preserved verbatim — these cannot be changed without breaking MailChimp list sync.
- jQuery loaded only on `/subscribe` (not site-wide); required by MailChimp's mc-validate.js.

**Sandbox tests:** Clean build (12 pages). `/subscribe` confirmed in build output. All form fields, 7 checkboxes, honeypot, and correct form action URL verified in built HTML. Footer "Newsletter signup" link confirmed present on all pages.

**Cannot verify in sandbox:** Actual MailChimp submission receipt — requires live site and real email. Recommend a test submission after deployment.

---

## Phase 2.10 — Employment page (also carried Phase 2.9) ✅ Complete (2026-05-28)

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

**Verified live by client 2026-05-29:** Employment page renders correctly, Cast Pages absent from nav, Board fields visible in CMS.

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
