# PYT Website — In-Flight Items

**Last updated:** 2026-06-03 (end of session)

**New Claude session: read `START_HERE.md` first, then the `HANDOVER-2026-06-03.md` prompt if present.**

What is mid-stream right now, what's blocked on the client, what's deferred. Read this so you know what *not* to start fresh. When an item here is resolved, remove it and update `BUILD_LOG.md`.

---

## ✅ COMPLETED 2026-06-03 (all confirmed live by client)

Done and live — listed so you don't re-investigate. Full detail in `BUILD_LOG.md` (newest entries at top).

1. **runtime_minutes can't break the build** — schema made tolerant (`z.coerce.number().int().positive().optional().catch(undefined)`); CMS field got whole-number validation. A bad value is ignored, not site-breaking.
2. **Shows page — auditions as a date range** — replaced single `audition_date` with `audition_start` / `audition_end` (drives auto-close) / `audition_display` (free text shown to families). Auditions button + date text on both the listing cards and the detail page. Date text shows whenever `audition_display` is filled (independent of a sign-up link); the button needs `audition_url`. Legacy `audition_date` kept as a tolerant fallback.
3. **Shop page** — created `src/pages/shop.astro` (minimal, title only). Previously `/shop` had no page, so Cloudflare served the home page as a fallback. Shopify embed goes here later (Phase 3.3).
4. **Cast Pages — broken slug fixed** — added `identifier_field: "show_title"` to the cast-pages CMS collection. Without a field named `title`, Decap dumped the whole form into the filename (garbled URLs). New cast pages now get clean slugs (e.g. `/cast/test-cast-page`).
5. **Cast Pages — rehearsal resources** — new repeatable `resources` list (label + url per item) rendering as buttons, for Google Drive folder links etc. Hides when empty.
6. **Casting page — Markdown now renders** — the Casting body uses the CMS markdown widget; the template was printing raw text (literal `**`). Added `marked` + `src/lib/markdown.ts` helper; bold/italic/lists/links now render. NOTE: Casting body is the ONLY markdown-widget field — every other body/description field is the plain `text` widget. The helper is reusable if you later switch a field to the markdown widget.

**`test-cast-page.md` is a real test page in the repo** (password: `demo`). Client may want it deleted before launch — confirm before removing.

---

## BLOCKED ON CLIENT INPUT (cannot build without external info)

### 1. Phase 3.3 — Shop (Shopify)
**State:** Blocked. No Shopify store exists yet. The client is setting one up using `docs/shopify-setup-guide.md` (a staff-facing guide the previous session wrote).

**What you need from the client before you can build the Shop page:**
- Confirmation the store is live on **Shopify Basic** with Shopify Payments on.
- At least one **Collection** with a few real products.
- The **Buy Button embed code** for each Collection (a chunk starting with `<div>` and `<script>`), pasted into chat, each labeled with which Collection it's for.

**Locked decision:** Shopify Basic + Collections, embedded into the site via Shopify's Buy Button sales channel. Don't re-litigate the platform choice.

**Do NOT** fabricate Shopify embed code or build an empty shell. Wait for the real code.

### 2. Sponsorship tiers -> Soapbox giving
**State:** The client (2026-05-29) wants each sponsorship tier's button to lead to Soapbox giving instead of the current mailto inquiry. Originally framed as "popups," but since the main Donate button moved to **hosted links** (not popups), this will most likely become simple per-tier links to Soapbox.

**Blocked on:** per-tier Soapbox destination URLs from the client (e.g., a Soapbox donation link for each tier amount). The CMS already has a per-tier `donation_url` field built for exactly this (see `DECISIONS.md` -> Sponsorship: blank = mailto fallback, filled = "Give at this level" button). So once the client supplies the URLs, this may be mostly a content edit plus possibly a tiny template tweak.

**Do NOT** fabricate tier URLs/amounts -- wrong values route sponsors to the wrong donation.

### 3. Matching-gifts search embed on Donate page
**State:** The client (2026-05-29) wants a company-matching-gift search tool embedded on the Donate page, where it already mentions employer matching.

**Blocked on:** the embed code from PYT's matching service (commonly Double the Donation / 360MatchPro, or similar -- confirm which one PYT uses). The embed snippet (script + target div) cannot be fabricated.

**Where it goes:** the Donate page already has a "Double your gift / employer matching" callout (`matching_note` in `donate-page.json`). The widget slots in there.

---

## EARLIER WORK — all confirmed live (historical)

The 2026-05-29 and 2026-06-02 batches (home redesign with "Now Playing" removed, Donate button as hosted Soapbox link, Cast Pages, Judy Robe Awards page, About staff + banner, Casting banner, upcoming-shows strip, Shows page audition/ticket buttons) are all confirmed live. See `BUILD_LOG.md` for detail. Nothing pending from those.

---

## HOUSEKEEPING THE CLIENT SHOULD DO

### Cast Pages — test page may want removing before launch
`src/content/cast-pages/test-cast-page.md` is a working demo cast page (password: `demo`) created 2026-06-03 to test the gate, the embedded schedule, the private cast-list link, and resource buttons. It's harmless but should probably be deleted via the CMS (or GitHub) before the site is public. Confirm with the client before deleting. The cast-pages slug bug is fixed (see BUILD_LOG 2026-06-03) — any new cast page made through the CMS now gets a clean URL.

---

## DEFERRED / AWAITING CLIENT (not blocking)

### Cupidus font swap
**Status:** Client's eventual target is JAF Cupidus for the body font. **Interim step done 2026-06-02:** the site now uses **Nunito** for all text as a placeholder closer to the intended direction (see `BUILD_LOG.md` and `DECISIONS.md`). Still **holding for Cupidus license acquisition.** When the client has the font files (or an Adobe Fonts link), it's ~15 min: update the `@import` in `src/styles/global.css` and the `--font-body`/`--font-heading` values in `src/styles/tokens.css`. Slated for Phase 5.

### Heading weight in Nunito (minor, optional)
**Status:** Headings (`h1,h2,h3,h4` in `global.css`) use `font-weight: 500` with tight negative letter-spacing — originally tuned for the Newsreader serif. With Nunito they may read slightly light at large sizes. Client reviewed the live result 2026-06-02 and is happy as-is. Flag only: if a future request is to make headings bolder, change that rule to `font-weight: 600`. No action needed unless asked.

### Casting page hero image
**Status:** Page shows an "Image coming soon" placeholder until the client uploads an image via CMS -> Site Settings -> Casting Page. No code change needed.

### Casting page text -- potential revision
**Status:** Client may want to revise Casting copy to clarify it's about Mainstage auditioning specifically (now that Stories on Stage has its own auditions section). Flag only -- client decides.

### Editable nav as a future feature
**Status:** Discussed, not approved, not on roadmap.

---

## REMAINING ROADMAP (big picture)

- **Phase 3.3 Shop** -- blocked on Shopify (above).
- **Phase 4 -- EN/ES bilingual** via Astro native i18n. Not started. Pages were built to bilingualize cleanly.
- **Phase 5 -- rebrand + handoff.** Wire real domain `pytnet.org`; swap real brand colors/fonts/logo (tokens.css + Logo.astro); Cupidus font; **and produce a "where do I edit X in the CMS" staff guide** (important -- the on-page staff helper notes were removed earlier, so staff have no on-site guidance). Possibly revisit Formspree -> Cloudflare-native email once the domain is verified.
