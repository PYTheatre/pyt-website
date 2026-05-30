# PYT Website — In-Flight Items

**Last updated:** 2026-05-29 (later session)

What is mid-stream right now, what's blocked on the client, what's deferred. Read this so you know what *not* to start fresh.

When an item here is resolved (either resolved, abandoned, or upgraded into a phase): remove it from this file and update `BUILD_LOG.md` accordingly.

---

## 1. Donate button on /donate — RESOLVED 2026-05-29 (switched to hosted link)

**State:** ✅ Fixed and built. After exploring the popup approach (which needed a `data-id` we couldn't reliably obtain), the client chose the simpler, more robust option: the Donate button now LINKS to PYT's hosted Soapbox donation page rather than opening an on-page popup. This mirrors the MailChimp-hosted newsletter pattern.

**What was done:**
- `/donate` page: the "Donate Now" button now links to `https://pyt.secure.nonprofitsoapbox.com/donate` (opens in a new tab). The old `?sbxdonationsmodal=sbx1` popup trigger and the inline-iframe embed path were both removed.
- The site-wide Soapbox popup loader `<script>` was removed from `BaseLayout.astro` (no popup anymore = no need to load it on every page; slight perf win).
- CMS: the old `soapbox_embed_url` field was replaced with `soapbox_donate_url` (the hosted page link). Template defaults to the hosted URL if the field is blank, so it works against the live JSON without shipping donate-page.json.
- Header "Donate" button and home page button still route to `/donate` (unchanged, per client).
- Sponsorship tier buttons left untouched (separate flow — see item 3).

**Original problem (for reference):** The old button used `href="?sbxdonationsmodal=sbx1"`, a real URL change that reloaded the whole page before the popup appeared (the 4–5 sec lag + "multiple clicks" reports).

**Live test after upload:** click Donate on /donate → should open the Soapbox donation page in a new tab. No lag, no reload-then-wait.

---

## 2. Phase 3.2 (Rentals) — built, awaiting upload + form test

**State:** Built 2026-05-29. In the upload zip. After upload, do one real test submission at `/rentals` to confirm the inquiry reaches **both** `info@pytnet.org` and `lhatten@pytnet.org`.

**If the test fails:** Check the Formspree dashboard first — the form may need its recipients confirmed, and Formspree often requires the very first submission to a new form to be confirmed via an email it sends to the form owner. Don't guess at code changes before checking Formspree's dashboard for the form's status.

**Decided:** Formspree free tier is a stopgap because Cloudflare-native email needs the `pytnet.org` domain verified (a Phase 5 task). Revisit switching to Cloudflare-native in Phase 5 if the client still wants full first-party control.

---

## 3. Sponsorship tiers → direct Soapbox popups (requested, NOT built)

**State:** Client asked (2026-05-29) to change every sponsorship tier's "Inquire" button so it opens a Soapbox donation popup pre-set to that tier's amount, instead of sending a mailto inquiry.

**Blocked on:** the same Soapbox info as item #1. Each tier needs either its own Soapbox `data-id` (a popup form configured for that amount) OR a tier-specific Soapbox donation URL. The CMS already has a per-tier `donation_url` field built for exactly this (see DECISIONS.md → Sponsorship). So once the client supplies per-tier Soapbox URLs/ids, this may be mostly a content edit plus a small template change to use the `data-sbx` trigger pattern.

**Do NOT** fabricate tier ids/amounts — wrong values would route sponsors to the wrong donation amount.

---

## 4. Matching-gifts search embed on Donate page (requested, NOT built)

**State:** Client asked (2026-05-29) to embed a company-matching-gift search tool on the Donate page, where the page already mentions employer matching.

**Blocked on:** the embed code from the matching-gifts service. This is almost certainly a third-party widget (commonly Double the Donation / 360MatchPro, or similar). The embed snippet (a script tag + a target div) cannot be fabricated — need the real code from PYT's account with that service. Ask the client which matching service PYT uses and to retrieve the embed code from it.

**Where it goes:** the Donate page already has a "Double your gift / employer matching" callout (`matching_note` in donate-page.json). The widget would slot in there.

---

## 5. Phase 3.4 — Cast Pages redefined (smaller, simpler than original plan)

**State:** Original plan was password-gated cast pages with shared password per show. **Redefined on 2026-05-28** to: pages exist at unguessable URLs, linked only from newsletters, not navigable from the site. No nav link (Cast Pages removed from nav in Phase 2.9/2.10). Still need to be built — just smaller in scope than originally planned.

**Cast page security approach (locked):** Option A — soft client-side password gate. The client accepted the limitation that this is *easily bypassed* by anyone who views page source. Threat model: cast info (names, rehearsal times, production notes) is not legally sensitive but isn't meant to be public-facing.

**Phase 3 sequence reminder:**
1. **3.1 MailChimp** ✅ complete (verified live)
2. **3.2 Rentals catalogue** 🟡 built; awaiting upload + form test
3. **3.3 Shop (Shopify embed)** — next
4. **3.4 Cast Pages** (as redefined above)
5. **3.5 Google Sheets embed** (almost certainly merges into 3.4)

---

## 6. Deferred / awaiting client input (not blocking)

### Cupidus font swap
**Status:** Client wants the body font changed to JAF Cupidus. **Holding for license acquisition.** When the client has the font files (or an Adobe Fonts CSS link), wiring it in is approximately a 15-minute job: update `src/styles/tokens.css` to change `--font-body`, add font-loading to `BaseLayout.astro`.

### Casting page hero image
**Status:** Page renders a "Image coming soon" placeholder. When the client provides the image, they upload via CMS → Site Settings → Casting Page → Hero image. No code change needed.

### Casting page text — potential revision
**Status:** Client may want to revise Casting page copy to clarify it's about Mainstage auditioning specifically (now that Stories on Stage has its own auditions section). Flag only — client to decide.

### Editable nav as a small future feature
**Status:** Discussed but not approved. Not on current roadmap.
