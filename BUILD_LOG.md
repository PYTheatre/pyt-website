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
| 2.5 | **Sponsorship feature** | 🟡 **Built & sandbox-tested; awaiting client upload** |
| 3 | Cast pages + Sheets + Rentals + Shop + MailChimp | ⬜ Not started |
| 4 | Full EN/ES | ⬜ Not started |
| 5 | Rebrand test, docs, handoff | ⬜ Not started |

---

## Phase 2.5 — Sponsorship feature (sandbox complete)

**Goal:** Add sponsorship-as-a-product with two tier groups (per-show + per-season), surfaced from Shows list, individual show pages, and the Donate page.

### Decisions locked with client (2026-05-27)
- Sponsor buttons lead to **a new on-site `/sponsor` page** with all tiers and benefits, not to external forms (Option 1).
- "Sponsor This Show" buttons on individual show pages must **carry which show is being sponsored** through to the destination — handled via URL query parameter (`?show=<slug>`) and a small client-side script.
- Sponsorship is **distinct from individual donations**. The two ladders are visually separated; the Donate page has a discrete pointer toward `/sponsor` rather than mixing the offerings.
- Sponsorship tiers approved exactly as proposed:
  - Show: Show Producer $10,000 / Show Sponsor $5,000 / Show Friend $2,500 / Show Supporter $1,000
  - Season: Season Producer $25,000 / Season Sponsor $15,000 / Season Friend $7,500

### Built (all sandbox-tested)
- `src/content/settings/sponsorship-page.json` — full sponsorship copy and all seven tiers with benefits lists.
- `public/admin/config.yml` — extended with a "Sponsorship Page" entry in Site Settings, with editable intro copy, contact info, and two nested list widgets (show tiers, season tiers) where each tier has name/amount/description/benefits-list/donation-URL fields.
- `src/pages/sponsor.astro` — the new `/sponsor` page. Two tier sections, dark contact block at the bottom. Per-tier donation URLs supported (mailto fallback when blank). Show-aware via `?show=<slug>` URL param with client-side script.
- `src/pages/shows/index.astro` — added "Sponsor a Show" and "Sponsor a Season" buttons in a CTA strip under the page hero.
- `src/pages/shows/[slug].astro` — added "Sponsor This Show" button to the CTA row; links to `/sponsor?show=<slug>`.
- `src/pages/donate.astro` — added a sponsorship pointer section at the bottom with its own eyebrow ("For businesses, foundations & major giving") and two CTAs.

### Sandbox tests passed
- ✅ `npm run build` zero errors. 10 pages generated.
- ✅ All four affected pages render correctly at 390px and 1280px.
- ✅ **Show-aware flow proven end-to-end** with headless browser test: clicking "Sponsor This Show" on Hello, Dolly! lands at `/sponsor?show=hello-dolly`, the context banner shows "Hello, Dolly!" with the comma preserved, and show-tier "Inquire" buttons' mailto subjects pick up the show name (`Sponsorship inquiry: Show Producer for Hello, Dolly!`). Season-tier links are correctly NOT modified.
- ✅ Per-tier donation URLs: when `donation_url` is set, button becomes a primary "Give at this level" link. When blank (current state, since Soapbox not wired yet), button becomes an outline "Inquire about this level" mailto link.

### When Soapbox is ready
Staff will fill in the `donation_url` field on each tier through `/admin → Site Settings → Sponsorship Page`. The buttons automatically switch from "Inquire about this level" to "Give at this level". No code changes needed.

---

## Phase 2 — Core pages ✅ COMPLETE (2026-05-27)

Six new editable pages live: /shows, /shows/[slug], /programs, /donate, /about, /casting.
Staff workflow verified via Test A (added a fake show via CMS, confirmed it appeared on live site, deleted it) and Test B (edited About page, confirmed change went live).

## Phase 1 — Decap CMS login ✅ COMPLETE

## Phase 0 — Pipeline ✅ COMPLETE

(See git history for full details of earlier phases.)
