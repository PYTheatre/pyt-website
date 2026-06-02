# PYT Website — In-Flight Items

**Last updated:** 2026-05-29 (handoff reconciliation)

**New Claude session: read `START_HERE.md` first.**

What is mid-stream right now, what's blocked on the client, what's deferred. Read this so you know what *not* to start fresh. When an item here is resolved, remove it and update `BUILD_LOG.md`.

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

## SHIPPED THIS SESSION -- CONFIRM LIVE WITH CLIENT

These were built and handed over as upload zips at the end of the 2026-05-29 session. Confirm with the client which actually reached the live site (uploads were error-prone). See `START_HERE.md` -> upload-status checklist.

- **Home page redesign** (`PYT-upload-MAY29-v4-homepage.zip`): "Now Playing" removed; hero + optional photo banner. **Confirm live** (ask: is there no show box on the home page?).
- **Donate button fix** (`PYT-upload-MAY29-v6-donatebutton.zip`): links to hosted Soapbox page, no popup. **Confirm live** (ask: does Donate open Soapbox in a new tab with no lag?).
- **Cast Pages** (`PYT-upload-MAY29-v5-castpages.zip`): **client already confirmed LIVE.**
- **Phase 2.12 batch** (Judy Robe Awards page, About staff + banner, Casting banner resize): structural parts confirmed live earlier in the session.

If any aren't live, help the client upload the outstanding zip. (Those zip files lived in the PREVIOUS session's `/mnt/user-data/outputs/`, which you won't have. If a re-upload is needed, rebuild the relevant file from the cloned repo and repackage.)

---

## HOUSEKEEPING THE CLIENT SHOULD DO

- **Delete the sample cast page.** The Cast Pages feature shipped with a sample entry `src/content/cast-pages/sample-delete-me.md` (password "demo"), clearly marked for deletion. The client should delete it via the CMS or GitHub when ready. (Rule 5: chat-and-upload can't delete files.)

---

## DEFERRED / AWAITING CLIENT (not blocking)

### Cupidus font swap
**Status:** Client wants the body font changed to JAF Cupidus. **Holding for license acquisition.** When the client has the font files (or an Adobe Fonts link), it's ~15 min: update `--font-body` in `src/styles/tokens.css`, add font-loading to `BaseLayout.astro`. Slated for Phase 5.

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
