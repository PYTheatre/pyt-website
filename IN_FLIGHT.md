# PYT Website — In-Flight Items

**Last updated:** 2026-05-29

What is mid-stream right now, what's blocked on the client, what's deferred. Read this so you know what *not* to start fresh.

When an item here is resolved (either resolved, abandoned, or upgraded into a phase): remove it from this file and update `BUILD_LOG.md` accordingly.

---

## 1. Donate button on /donate requires multiple clicks — diagnosis in progress

**State:** Client reported the issue. Claude was about to ask for a diagnostic console screenshot. No fix attempted yet.

**The issue:** When a user clicks "Donate Now" on the live `/donate` page, the Soapbox popup does not open on the first click. They have to click "at least three times" before it opens.

**Current hypothesis (NOT confirmed — do not act on it yet):** The Soapbox loader script (added to `BaseLayout.astro` in Phase 2.7) takes time to fetch from `pyt.secure.nonprofitsoapbox.com`. Until that script has loaded and installed its click handlers, the button does nothing. The first click(s) miss because the Soapbox script isn't ready; by the third click, enough time has passed.

**What the new Claude should do:**

1. **Do not propose a fix from memory.** Past Claude sessions have made this exact kind of mistake with third-party widgets. (See `PROJECT_RULES.md` Rule 1.)
2. **Ask the client for the diagnostic data:** open `pyt-website.pages.dev/donate`, open browser dev tools → Console tab, clear console, wait 5 seconds, click "Donate Now" once, watch for console messages, click again if nothing happens, screenshot.
3. **Then research.** Read what the client sends. Search the web for Soapbox-specific issues if needed. Only then propose a fix.

**Possible fixes (don't apply blindly):**
- Add a small "Loading payment form…" disabled state on the button until the Soapbox script signals ready (requires research into whether Soapbox emits such a signal).
- Use the Soapbox embed iframe approach (Path B from when we first wired Soapbox in Phase 2.7) instead of the popup — but this requires asking Soapbox for an iframe embed URL, which the client may not have.
- Defer the script load earlier (try moving from `<body>` end to `<head>` with `async`/`defer`).
- Wait until the user clicks, then load Soapbox on demand. Most invasive change, but eliminates the race.

The Soapbox subdomain is confirmed: `pyt.secure.nonprofitsoapbox.com`. The trigger pattern is confirmed: any link with `?sbxdonationsmodal=sbx1`.

---

## 2. MailChimp newsletter signup — Phase 3.1, blocked on embed code

**State:** Phase 3.1 is the next phase. The client's staff are trying to find the MailChimp embed code, but hit a conceptual block — they have a "hosted" form but didn't realize "embedded" is a different option in the same dashboard.

**What's been shared:**
- A screenshot of the existing PYT MailChimp signup form. It captures: First Name, Last Name, Email Address, plus six interest checkboxes (Auditions, Camps & Classes, Upcoming Public Performances, Field Trip Opportunities, Alumni News, Giving to PYT).
- An `eepurl.com` shortened link (`http://eepurl.com/duvm8f`) — this redirects to the MailChimp-hosted version of the form.

**What is still needed before building:**
- The full embedded form HTML from MailChimp (Audience → Signup forms → Embedded form → choose Classic, copy the whole HTML block). This contains the form action URL, the field IDs, the interest group IDs, and the honeypot field. None of those can be fabricated.

**Decisions already locked:**
- Form lives at `/subscribe` (dedicated page) plus a small "Newsletter signup" pointer link in the footer. Not in the footer directly — the form is too big for that.
- Keep the existing fields and interest checkboxes (subject to client review once we see the embed code).

**Explanation already drafted for the client to pass to staff:**

> A hosted form is a webpage MailChimp hosts on their servers — visitors leave our site to fill it in. An embedded form is HTML code we paste into our own site so the form appears natively, styled like the rest of pytnet.org. They're both signup forms going to the same audience; the difference is just where the form *displays*.
>
> To get the embedded version: in MailChimp, go to Audience → Signup forms → Embedded form, choose "Classic" (it includes name, email, and the interest checkboxes), then copy the full block of HTML it generates and send it over.

**Fallback if the embed code can't be obtained:** "Path A" — add a "Newsletter signup" link in the footer pointing to the `eepurl` URL. Visitors jump to MailChimp's purple-branded page. Works today, looks off-brand, but functional. Build natively when the embed code arrives.

---

## 3. Phase 3.4 — Cast Pages redefined (smaller, simpler than original plan)

**State:** Original plan was password-gated cast pages with shared password per show. **Redefined on 2026-05-28** to: pages exist at unguessable URLs, linked only from newsletters, not navigable from the site. No nav link (Cast Pages removed from nav in Phase 2.9/2.10). Still need to be built — just smaller in scope than originally planned.

**Cast page security approach (locked):** Option A — soft client-side password gate. The client accepted the limitation that this is *easily bypassed* by anyone who views page source. Threat model: cast info (names, rehearsal times, production notes) is not legally sensitive but isn't meant to be public-facing. If sensitive content is ever added (home addresses, medical info), revisit with a proper server-side check.

**Phase 3 sequence reminder:**
1. **3.1 MailChimp** (current, blocked on embed code)
2. **3.2 Rentals catalogue** (next after MailChimp)
3. **3.3 Shop (Shopify embed)**
4. **3.4 Cast Pages** (as redefined above)
5. **3.5 Google Sheets embed** (almost certainly merges into 3.4)

---

## 4. Deferred / awaiting client input (not blocking)

These don't block any current work, but a future Claude session should know they exist.

### Cupidus font swap
**Status:** Client wants the body font changed to JAF Cupidus (https://justanotherfoundry.com/cupidus). **Holding for license acquisition.** Three licensing paths considered: Adobe Fonts (subscription), direct license from JAF / I Love Typography (perpetual self-host), Fontstand (monthly rental). Variant question (Cupidus vs Cupidus Text vs both) also open. When the client has the font files (or an Adobe Fonts CSS link), wiring it in is approximately a 15-minute job: update `src/styles/tokens.css` to change `--font-body` (and optionally `--font-heading`), add font-loading to `src/layouts/BaseLayout.astro`, ship a small upload batch. The whole site reads body type from one token so the change is genuinely one-file once the font is available.

### Casting page hero image
**Status:** Client has the page text live but no hero image yet. The page renders a "Image coming soon" placeholder in the page hero in the meantime. When the client provides the image, they upload via CMS → Site Settings → Casting Page → Hero image. No code change needed.

### Casting page text — potential revision
**Status:** The Casting page text currently reads as universal audition info. Now that Stories on Stage has its own clearly-labeled auditions section (Phase 2.6), the client may want to revise the Casting page copy to clarify it's about Mainstage auditioning specifically. Surfaced as a flag, not a request. Client to decide if and when.

### Editable nav as a small future feature
**Status:** Discussed but not approved. The client asked whether staff could edit the main menu themselves; the recommendation was Option 3 — purpose-built page templates (which we've kept doing), with an editable-nav feature as an optional future addition. Not on the current roadmap, but worth proposing if the client adds another new top-level section.
