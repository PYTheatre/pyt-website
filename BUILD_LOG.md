# PYT Website — Build Log

Newest entries at the top.

- **Repo:** https://github.com/PYTheatre/pyt-website
- **Live site (staging):** https://pyt-website.pages.dev
- **CMS:** https://pyt-website.pages.dev/admin
- **Stack:** Astro 6 (static) + Decap CMS 3.10.1 + Cloudflare Pages
- **Workflow:** Claude builds & tests files in sandbox; client uploads to GitHub web UI OR edits via Decap CMS; Cloudflare auto-deploys.

---

## Phase status overview

| Phase | What | Status |
|---|---|---|
| 0 | Pipeline | ✅ Complete |
| 1 | Decap CMS login | ✅ Complete |
| 2 | Core pages (Shows, Programs, Donate, About, Casting) | 🟡 **Built & sandbox-tested; awaiting client upload** |
| 3 | Cast pages + Sheets + Rentals + Shop + MailChimp | ⬜ Not started |
| 4 | Full EN/ES | ⬜ Not started |
| 5 | Rebrand test, docs, handoff | ⬜ Not started |

---

## Phase 2 — Core pages (sandbox complete)

**Goal:** Turn Shows, Programs, Donate, About, and Casting into real CMS-editable pages with starter content matching the prototype.

### Built (all sandbox-tested — clean builds, screenshotted phone + desktop)

CMS config extended (`public/admin/config.yml`) with five new collections in addition to the existing Site Settings → Donation Campaign:
- **Shows** — folder collection, one entry per Mainstage show (CMS upload for poster image)
- **Classes & Camps (Programs)** — folder collection with a "Program type" dropdown that handles Classes, Camps, Stories on Stage, and Studio Intensives in one form
- **Donor Tiers** — list field inside Site Settings (Friend / Supporter / Producer / Director's Circle)
- **Donate Page** — Site Settings record with intro copy, employer-matching note, and Soapbox embed URL
- **About Page** — Site Settings record with story copy and contact card fields
- **Casting Page** — Site Settings record with hero image, body, pulled-out closing quote, and CTA

Astro content collections schema (`src/content.config.ts`):
- Shows and Programs declared as glob-loaded collections with Zod schemas matching the CMS field set
- Build-time validation ensures any future content edit that drops a required field fails clearly rather than producing a broken page

Starter content (all matching the prototype's approved content):
- 3 shows: Dragons Love Tacos, Hello Dolly!, A Charlie Brown Christmas
- 7 programs: Drama Tots, Performance Academy, Musical Theatre Intensive, Advanced Conservatory, Stage & Screen, Improv & Movement, Stories on Stage
- Donor tiers, donate-page copy, about-page copy, casting-page copy (client-supplied verbatim)

Page templates (all mobile-first):
- `src/pages/shows/index.astro` — sorted list with poster placeholders
- `src/pages/shows/[slug].astro` — dynamic detail pages
- `src/pages/programs.astro` — filterable grid (type + season filters, vanilla JS)
- `src/pages/donate.astro` — dark hero with progress bar, donor tiers, Soapbox embed slot
- `src/pages/about.astro` — story + contact card
- `src/pages/casting.astro` — hero image + body + pulled-out closing quote + CTA
- `src/components/PageHero.astro` — reusable top-of-page block (eyebrow + h1 + lede)

Nav updated (`src/components/Header.astro`):
- Casting added between Classes & Camps and Cast Pages

### Sandbox tests passed
- ✅ `npm run build` zero errors. 9 pages generated (home, about, casting, donate, programs, shows index, plus 3 show detail pages).
- ✅ All 6 new pages render correctly at 390px (phone) and 1280px (desktop).
- ✅ Programs page filter works interactively (verified with headless browser: selecting "Camp" narrows 7→1, clearing restores 7).
- ✅ Home page unchanged and intact.
- ✅ **Staff workflow proven:** dropping a new show markdown file into `src/content/shows/` automatically generates a new detail page and adds it to the list. Removing the file removes the page. This is exactly what staff will experience through the CMS.
- ✅ **Poster image rendering verified:** when a show has a `poster` field set, both the list-card and the detail-page hero render the uploaded image correctly.

### Deliberately NOT included in the upload batch
- `src/content/settings/donation-campaign.json` — the live site has whatever values the client set during their Phase 1 CMS test. The sandbox copy is at the original demo values, so leaving it out of the upload protects whatever's currently live.
- `src/pages/index.astro` — unchanged from Phase 1.

### Notes for staff & for future Claude sessions
- **Adding a new show:** Use the CMS at `/admin → Shows → New Show`. Upload a poster, fill in the form, click Publish. New show appears on `/shows` and gets its own URL at `/shows/<slug>` within ~2 minutes.
- **Soapbox embed:** When PYT has the Soapbox donation form embed URL, paste it into CMS → Site Settings → Donate Page → Soapbox donation form URL. The donate page automatically switches from "coming soon" message to the live embed.
- **The Casting page hero image is currently a "coming soon" placeholder.** When client provides the image, upload via CMS → Site Settings → Casting Page → Hero image.

---

## Phase 1 — Decap CMS login ✅ COMPLETE

(Login works, edit-publish loop verified. See earlier history for full details.)

## Phase 0 — Pipeline ✅ COMPLETE

(Live at pyt-website.pages.dev. See earlier history for full details.)
