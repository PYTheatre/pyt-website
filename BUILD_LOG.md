# PYT Website — Build Log

Newest entries at the top.

- **Repo:** https://github.com/PYTheatre/pyt-website
- **Live site (staging):** https://pyt-website.pages.dev
- **CMS:** https://pyt-website.pages.dev/admin
- **Stack:** Astro 6 (static) + Decap CMS 3.10.1 + Cloudflare Pages
- **Workflow:** Claude builds & tests in sandbox; client uploads to GitHub web UI OR edits via Decap CMS; Cloudflare auto-deploys.

---

## Phase status overview

| Phase | What | Status |
|---|---|---|
| 0 | Pipeline | ✅ Complete |
| 1 | Decap CMS login | ✅ Complete |
| 2 | Core pages (Shows, Programs, Donate, About, Casting) | ✅ Complete |
| 2.5 | Sponsorship feature | 🟡 Awaiting client verification on live site |
| 2.6 | **Stories on Stage section** | 🟡 **Built & sandbox-tested; awaiting client upload** |
| 3 | Cast pages + Sheets + Rentals + Shop + MailChimp | ⬜ Not started |
| 4 | Full EN/ES | ⬜ Not started |
| 5 | Rebrand test, docs, handoff | ⬜ Not started |

---

## Phase 2.6 — Stories on Stage (sandbox complete)

**Goal:** Promote Stories on Stage from one program-among-many to its own season-style presentation, reflecting how it actually works operationally (parallel to Mainstage, one annual audition, 6 productions per year, each actor in 1–3 shows).

### Decisions locked with client (2026-05-27)
- Stories on Stage is a **separate content type** from Mainstage Shows and from Classes & Camps. Different fields, different page layout.
- **One page** at `/stories-on-stage` — no per-production detail pages. The lineup, auditions info, and explainer all live on this single URL.
- **Each production has two CTAs**: Buy Tickets (public) and School Bookings (schools). Either can be blank per-production and that button hides.
- **Production card eyebrow** = just performance dates, no slot label like "Production 1 of 6".
- **Auditions section** has its own thin strip at the very top of the page linking down to the auditions block.
- **Removed from Classes & Camps**: the old `stories-on-stage.md` program file is gone; the program_type enum no longer offers "Stories on Stage" as an option.
- **Nav placement**: between Shows and Classes & Camps, reinforcing parallel-season framing.
- **No cast pages** for Stories on Stage productions (each is cast from the annual roster, not per-show).
- **Calendar conflicts collected via external Google Form** — the auditions section links out to it. URL is CMS-editable.

### Built (all sandbox-tested)
- `src/content/stories-on-stage/*.md` — two seeded example productions (Very Hungry Caterpillar, Where the Wild Things Are).
- `src/content/settings/stories-on-stage-page.json` — page-level content: intro lede, audition strip text, lineup heading, full auditions section copy (dates, age range, what to prepare, fees, form blurb), and the "What is Stories on Stage?" explainer paragraphs.
- `src/content.config.ts` — added `storiesOnStage` collection schema; removed "Stories on Stage" from the programs `program_type` enum (no longer needed).
- `public/admin/config.yml` — added "Stories on Stage Productions" folder collection with form fields for each production; added "Stories on Stage Page" entry under Site Settings; updated Programs collection description and removed "Stories on Stage" from its program_type options.
- `src/pages/stories-on-stage.astro` — the new page: top audition strip, hero, season lineup grid (2 cards seeded, expandable to 6 via CMS), auditions section with anchor target, explainer block.
- `src/components/Header.astro` — Stories on Stage added to the nav between Shows and Classes & Camps.
- `src/content/programs/stories-on-stage.md` — **deleted** (no longer needed; SoS lives in its own collection).

### Sandbox tests passed
- ✅ `npm run build` zero errors. 11 pages generated (one more than Phase 2.5 — the new `/stories-on-stage`).
- ✅ Stories on Stage page renders correctly at 390px and 1280px. Production grid is 1 column on phone, 2 on tablet, 3 on desktop.
- ✅ Programs page now shows 6 programs (Stories on Stage removed); existing programs unaffected.
- ✅ **CTA logic verified**: with both ticketing URLs blank, card shows a disabled "Tickets & bookings coming soon" pill. With URLs filled in, both Buy Tickets (primary) and School Bookings (outline) buttons render with proper links.
- ✅ Audition strip anchors correctly to `#auditions` section.

### What staff will edit through the CMS
- **Stories on Stage Productions** (in left sidebar, between "Classes & Camps" and "Site Settings"): add/edit/remove individual productions. Same form-pattern as Shows but with fewer fields and two ticketing URLs.
- **Site Settings → Stories on Stage Page**: page intro, auditions section copy, Google Form URL, explainer paragraphs.

### Pending follow-ups
- **Casting page (created in Phase 2) still has the client-provided text and hero-image placeholder.** When the client provides the hero image, upload via CMS → Site Settings → Casting Page → Hero image. (Unchanged from previous phases — flagging again here as a project-level reminder.)
- **Casting page text mentions Mainstage but not Stories on Stage**. When Stories on Stage is live, the client may want to revise the Casting page copy to clarify it's specifically about Mainstage auditioning (since Stories on Stage now has its own clearly-labeled audition section). Worth flagging to the client, but they should decide.

---

## Phase 2.5 — Sponsorship feature 🟡 awaiting client verification

(Built, packaged, presented to client. Client has not yet confirmed deployment to live site.)

## Phase 2 — Core pages ✅ COMPLETE (2026-05-27)

(Six new editable pages live. Staff workflow verified via add-a-show and edit-About tests.)

## Phase 1 — Decap CMS login ✅ COMPLETE

## Phase 0 — Pipeline ✅ COMPLETE

(See git history for earlier-phase details.)
