# PYT Website — In-Flight Items

**Last updated:** 2026-05-29

What is mid-stream right now, what's blocked on the client, what's deferred. Read this so you know what *not* to start fresh.

When an item here is resolved (either resolved, abandoned, or upgraded into a phase): remove it from this file and update `BUILD_LOG.md` accordingly.

---

## 1. Donate button on /donate requires multiple clicks — diagnosis in progress

**State:** Client reported the issue. No fix attempted yet. Needs a browser console screenshot from the client before any fix is proposed.

**The issue:** When a user clicks "Donate Now" on the live `/donate` page, the Soapbox popup does not open on the first click. They have to click "at least three times" before it opens.

**Current hypothesis (NOT confirmed — do not act on it yet):** The Soapbox loader script (added to `BaseLayout.astro` in Phase 2.7) takes time to fetch from `pyt.secure.nonprofitsoapbox.com`. Until that script has loaded and installed its click handlers, the button does nothing. The first click(s) miss because the Soapbox script isn't ready; by the third click, enough time has passed.

**What the new Claude should do:**

1. **Do not propose a fix from memory.** Past Claude sessions have made this exact kind of mistake with third-party widgets. (See `PROJECT_RULES.md` Rule 1.)
2. **Ask the client for the diagnostic data:** open `pyt-website.pages.dev/donate`, open browser dev tools → Console tab, clear console, wait 5 seconds, click "Donate Now" once, watch for console messages, click again if nothing happens, screenshot.
3. **Then research.** Read what the client sends. Search the web for Soapbox-specific issues if needed. Only then propose a fix.

**Possible fixes (don't apply blindly):**
- Add a small "Loading payment form…" disabled state on the button until the Soapbox script signals ready (requires research into whether Soapbox emits such a signal).
- Use the Soapbox embed iframe approach instead of the popup — but this requires asking Soapbox for an iframe embed URL.
- Defer the script load earlier (try moving from `<body>` end to `<head>` with `async`/`defer`).
- Wait until the user clicks, then load Soapbox on demand. Most invasive change, but eliminates the race.

The Soapbox subdomain is confirmed: `pyt.secure.nonprofitsoapbox.com`. The trigger pattern is confirmed: any link with `?sbxdonationsmodal=sbx1`.

---

## 2. Phase 3.1 (MailChimp) — built, awaiting upload and test submission

**State:** Built on 2026-05-29. Zip ready to upload. After upload, staff should do one real test submission at `/subscribe` to confirm MailChimp actually receives it. If the submission succeeds, mark Phase 3.1 complete in the build log and remove this item.

**If the submission doesn't work:** The most likely causes are (a) the form action URL got corrupted (check it matches the MailChimp embed code exactly) or (b) MailChimp's `mc-validate.js` has a conflict with the page. Do not guess — check the browser console for errors first.

---

## 3. Phase 3.4 — Cast Pages redefined (smaller, simpler than original plan)

**State:** Original plan was password-gated cast pages with shared password per show. **Redefined on 2026-05-28** to: pages exist at unguessable URLs, linked only from newsletters, not navigable from the site. No nav link (Cast Pages removed from nav in Phase 2.9/2.10). Still need to be built — just smaller in scope than originally planned.

**Cast page security approach (locked):** Option A — soft client-side password gate. The client accepted the limitation that this is *easily bypassed* by anyone who views page source. Threat model: cast info (names, rehearsal times, production notes) is not legally sensitive but isn't meant to be public-facing.

**Phase 3 sequence reminder:**
1. **3.2 Rentals catalogue** (next)
2. **3.3 Shop (Shopify embed)**
3. **3.4 Cast Pages** (as redefined above)
4. **3.5 Google Sheets embed** (almost certainly merges into 3.4)

---

## 4. Deferred / awaiting client input (not blocking)

### Cupidus font swap
**Status:** Client wants the body font changed to JAF Cupidus. **Holding for license acquisition.** When the client has the font files (or an Adobe Fonts CSS link), wiring it in is approximately a 15-minute job: update `src/styles/tokens.css` to change `--font-body`, add font-loading to `BaseLayout.astro`.

### Casting page hero image
**Status:** Page renders a "Image coming soon" placeholder. When the client provides the image, they upload via CMS → Site Settings → Casting Page → Hero image. No code change needed.

### Casting page text — potential revision
**Status:** Client may want to revise Casting page copy to clarify it's about Mainstage auditioning specifically (now that Stories on Stage has its own auditions section). Flag only — client to decide.

### Editable nav as a small future feature
**Status:** Discussed but not approved. Not on current roadmap.
