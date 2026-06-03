# START HERE — PYT Website Handoff (2026-05-29)

**You are a new Claude session taking over the Peninsula Youth Theatre (PYT) website project. Read this entire file first, before anything else. It supersedes the older `HANDOFF.md`.**

This file exists because the project is being handed from one Claude session to another with a fresh context and a fresh sandbox. It tells you exactly what's true right now, what to do first, and where the traps are.

---

## ⚠️ THE FIRST THING YOU MUST DO

**Your sandbox is empty. The previous session's sandbox did NOT carry over.** There is no code in `/home/claude/` yet. Before you can build, test, or even read the real current files, you must clone the live repository:

```
cd /home/claude
git clone https://github.com/PYTheatre/pyt-website.git
cd pyt-website
npm install
```

Then confirm it builds: `npm run build`.

**Why this matters:** Every other document refers to "the sandbox" as if it's populated. It isn't, for you. The GitHub repo at `PYTheatre/pyt-website` is the real, authoritative current state of the project — more authoritative than any document, including this one. If a document and the repo disagree, **the repo wins** (with one exception noted below about docs that may not have been uploaded yet).

---

## ⚠️ DOCUMENT TRUST — READ THIS CAREFULLY

There are several markdown documents in this project. **They are not equally current.** Here is the trust order as of this handoff:

**FOCUS ON THESE (current, rewritten 2026-05-29, newest):**
- **`START_HERE.md`** (this file) — the single source of current truth. Read first.
- **`DECISIONS.md`** — locked decisions. **Freshly reconciled 2026-05-29** to remove approaches that were abandoned today. Trust it.
- **`IN_FLIGHT.md`** — what's pending/blocked right now. **Freshly reconciled 2026-05-29.** Trust it.
- **`PROJECT_RULES.md`** — operating rules. Still fully valid; unchanged today. **Read it carefully — it is the most important file after this one.**
- **`BUILD_LOG.md`** — phase history, newest at top. Accurate but it's *history*, not current state. Don't use it to determine what's true now; use it for "how did we get here."

**DO NOT TRUST AS CURRENT (superseded):**
- **`HANDOFF.md`** — ⚠️ **OUTDATED. Predates the 2026-05-29 work session.** It still says Rentals is "awaiting upload," the donate button is "blocked on a data-id," and Cast Pages are "not started." All of that is wrong now. Read it only for the "working style the client appreciates" section, which is still good. Otherwise ignore it in favor of THIS file. (Consider deleting or replacing it once you've confirmed current state with the client.)

**Reference, not a handoff:**
- **`docs/shopify-setup-guide.md`** — a guide written FOR THE CLIENT'S STAFF on how to set up Shopify. Not instructions for you. It's relevant background for Phase 3.3 (Shop).
- **`README.md`** — minimal repo intro. Ignore for handoff purposes.

---

## ⚠️ A SUBTLE TRAP: docs in the repo may be OLDER than this file

Here's a wrinkle you must understand. The previous Claude session edited these documents **in its sandbox**, then packaged them into upload zips for the client to push to GitHub. Not every doc edit may have reached the live repo yet, because uploads happen in batches and the very last edits (including this handoff) might be in a zip the client hasn't uploaded at the moment you start.

**So when you clone the repo, the docs you get might be slightly behind the state described here.** If the client tells you "I just uploaded the handoff batch," then the repo docs are current. If you're unsure, **ask the client which upload zips they have successfully pushed.** (See the upload-status checklist at the bottom of this file.)

---

## WHAT THIS PROJECT IS

The Peninsula Youth Theatre website rebuild. PYT is a non-profit youth theatre in Mountain View, California. Goal: a free-hosted, mobile-first website that **non-technical staff edit through web forms** — no GitHub, no code, no developer.

**Stack:** Astro 6 (static site generator) + Decap CMS 3.10.1 + Cloudflare Pages (free hosting, auto-deploys from GitHub).

- **Live site:** https://pyt-website.pages.dev
- **CMS login:** https://pyt-website.pages.dev/admin
- **Repo:** https://github.com/PYTheatre/pyt-website (org is `PYTheatre` — NOT `peninsula-youth-theatre`, which is a separate empty org. Don't be confused by it.)

**The client is a non-technical project manager.** They cannot and do not use a code editor or the command line.

---

## ⚠️ THE WORKFLOW (how work actually ships)

This is unusual and you must follow it exactly. The client cannot use git. So:

1. Client describes what they want, in plain language.
2. You ask clarifying questions (use `ask_user_input_v0` — tappable buttons, easier on mobile).
3. You write a short, non-technical plan. You surface decisions and tradeoffs. You wait for approval.
4. You build in your sandbox (`/home/claude/pyt-website`).
5. You test: `npm run build` must pass; screenshot with Playwright at 390px (phone) and 1280px (desktop).
6. You update `BUILD_LOG.md`.
7. You package a `.zip` that mirrors the repo's folder structure, into `/mnt/user-data/outputs/`.
8. You call `present_files` to hand over the zip.
9. You give a short, plain upload guide.
10. The client unzips and drag-drops the folders into GitHub's web "Upload files" page, commits, and Cloudflare rebuilds in ~2 minutes.
11. The client reports back. You confirm it's live (or diagnose).

**Critical upload lessons learned the hard way (see the GitHub section below):** the client has repeatedly hit a "0 files changed" problem caused by stale copies in their Downloads folder. Always give zips a fresh, distinct, dated name and tell them to delete old PYT zips first. Verify success by asking what the commit says ("N files changed", not 0).

---

## WHERE THE PROJECT STANDS RIGHT NOW (updated 2026-06-02)

### ✅ Done and verified live (2026-06-02 session)
- **Placeholder branding refresh:** PYT logo (3 colored serif letters) now in header AND footer; accent color changed to the logo's pink `#c0287b`; all fonts switched to **Nunito** (headings + body, no serif). All centralized in `tokens.css` / `global.css` / `Logo.astro` / `Footer.astro` + `public/uploads/pyt-logo.png`. Still placeholder — real brand swap is Phase 5. (See BUILD_LOG + DECISIONS.)
- **Shows page Audition + Tickets buttons:** each `/shows` card now has Auditions + Tickets buttons + a "See details" link, with auto-grey/hide logic and two new CMS fields. (See BUILD_LOG + DECISIONS.)

### ✅ RESOLVED — cast-page cleanup (no action needed)
- **Cast-page cleanup — DONE.** Earlier docs described a corrupted form-dump-named file in `src/content/cast-pages/` needing a GitHub delete. As of 2026-06-02 the client confirmed that path returns a 404 — the `cast-pages` content folder is empty (both the corrupted file and the old `sample-delete-me.md` are already gone). Nothing to delete, no keep-or-junk decision pending. The Cast Pages CMS collection and the `/cast/<slug>` page template still exist and work; the folder is simply empty until staff create a real cast page via the CMS.

### Note on docs
The 2026-06-02 doc updates (this file, BUILD_LOG, DECISIONS, IN_FLIGHT) were packaged for upload. If the client confirms they uploaded the "docs-update" batch, the repo docs are current. If unsure, the live code reflects all the work; only the written context might lag.

---

## EARLIER STATE (pre-2026-06-02, still accurate)

### ✅ Done and verified live
- Phases 0–2 (pipeline, CMS login + OAuth, core pages: Shows, Programs, Donate, About, Casting).
- Phase 2.5 Sponsorship, 2.6 Stories on Stage, 2.7 Soapbox wiring (later changed — see below), 2.8 editable content, 2.9/2.10 Employment + Board of Directors + Cast Pages removed from nav.
- **Phase 3.1 MailChimp** newsletter `/subscribe` — verified live.
- **Phase 3.2 Rentals** `/rentals` (category grid + Formspree inquiry form) — verified live by client.
- **Phase 3.4+3.5 Cast Pages** — verified live by client (password gate works, embedded schedule renders).

### 🟡 Built and shipped this session — CONFIRM these are live with the client
The previous session built and handed over several upload zips at the very end. **You must confirm with the client which of these actually reached the live site**, because uploads were error-prone:
- **`PYT-upload-MAY29-v4-homepage.zip`** — removes the "Now Playing" feature from the home page. (Home page redesign — intro + optional photo banner, no show feature.)
- **`PYT-upload-MAY29-v5-castpages.zip`** — the Cast Pages feature. (Client CONFIRMED this one is live.)
- **`PYT-upload-MAY29-v6-donatebutton.zip`** — the Donate button fix (now links to hosted Soapbox page instead of the laggy popup).
- There was also a **Phase 2.12 batch** (Judy Robe Awards page, About staff section + banner, Casting banner resize). Structural parts confirmed live earlier; confirm the latest version is in place.

**Action for you:** Early on, ask the client to confirm the live site shows: (a) no "Now Playing" box on the home page, (b) the Donate button opens the Soapbox page in a new tab with no lag. If yes, all batches landed. If no, help them upload the outstanding zip(s).

### ⬜ Blocked on the client (cannot proceed without external info)
- **Phase 3.3 Shop (Shopify)** — BLOCKED. No Shopify store exists yet. The client is setting one up using `docs/shopify-setup-guide.md`. You need from them: a live store on Shopify Basic + at least one Collection with products + the **Buy Button embed code** (a chunk starting with `<div>` and `<script>`). Until then, you cannot build the Shop page.
- **Sponsorship tiers → Soapbox** — the client wanted tier "Inquire" buttons to lead to Soapbox giving. Given the donate-button decision (hosted links, not popups), this will likely become simple per-tier links. Needs per-tier Soapbox URLs from the client. The CMS already has a per-tier `donation_url` field ready.
- **Matching-gifts embed** — the client wants a company-matching-gift search widget on the Donate page (in the existing `matching_note` callout area). Needs the embed code from PYT's matching service (likely Double the Donation / 360MatchPro). Ask which service they use.

### ⬜ Future phases (not started)
- **Phase 4 — EN/ES bilingual** via Astro's native i18n. Pages were built to be cleanly bilingualizable.
- **Phase 5 — rebrand + handoff.** Wire up the real domain (`pytnet.org`), swap in PYT's real brand colors/fonts/logo (all centralized: colors/fonts in `src/styles/tokens.css`, logo in `src/components/Logo.astro`). **Phase 5 must include a "where do I edit X in the CMS" staff guide**, because the on-page "For staff:" helper notes were removed earlier and that on-site guidance no longer exists. Also the **JAF Cupidus font swap** is deferred to here (waiting on the client's font license; ~15 min job — edit `--font-body` in tokens.css).

---

## THINGS THAT CHANGED TODAY THAT CONTRADICT OLDER NOTES

If you read older entries, these will look inconsistent. Today's decisions WIN:

1. **Donate button is NOT a popup anymore.** Earlier docs (and Phase 2.7 in the build log, and parts of DECISIONS.md) describe a Soapbox popup triggered by `?sbxdonationsmodal=sbx1` with a loader script in `BaseLayout.astro`. **That whole approach was abandoned 2026-05-29.** The Donate button now simply links to `https://pyt.secure.nonprofitsoapbox.com/donate` (opens new tab). The loader script was removed from `BaseLayout.astro`. The CMS field `soapbox_embed_url` was replaced with `soapbox_donate_url`. Reason: the popup caused a 4–5 second lag and a page reload, and getting the popup's `data-id` proved unreliable; the client chose the simpler hosted-link approach (consistent with how MailChimp newsletter signup works).

2. **The home page "Now Playing" feature was REMOVED.** Earlier docs describe an auto-selecting "Now Playing" show poster on the home page. The client found the redesigned version looked bad stretched, and chose to remove it entirely. The home page now flows: hero (intro text + optional photo banner) → "Join us" cards → Impact stats → Donation teaser. The show-selection logic is gone from `index.astro`.

These two are reconciled in the freshly-updated `DECISIONS.md`. Mentioned here in case you read older material.

---

## THE CLIENT'S FRUSTRATIONS (be aware, be kind, don't repeat)

Worth knowing honestly, because these shaped trust:

- **The GitHub upload "0 files changed" saga.** The client uploaded batches multiple times and nothing changed on the live site. After much back-and-forth (and the client's understandable frustration — "I've done this twice now"), the cause was found: **stale copies of the files in their Downloads folder were being dragged in instead of the fresh zip**, and GitHub commits nothing when files are identical. The fix that works: fresh, distinctly-named, dated zips each time; tell the client to delete old PYT zips first; verify the commit says "N files changed," not 0. **Do not make the client repeat uploads blindly — diagnose with the commit's file list if something doesn't land.**

- **Decap CMS config caching.** After a `config.yml` change, new CMS fields didn't appear for the client. Cause: Decap caches its config in the browser. Fix: hard refresh (Cmd+Shift+R) or an incognito window. The client confirmed incognito fixed it. Remember this whenever you change CMS fields — proactively tell them to hard-refresh.

- **Jargon and assumed knowledge.** At one point the previous Claude told the client to "open the file in a text editor" and reference "the root," which meant nothing to them. **Keep it concrete and plain.** Don't assume they know what folders, roots, source files, or editors are.

- **Repeated wrong fixes from memory** (the deepest, oldest frustration — see PROJECT_RULES Rule 1). Earlier sessions guessed at OAuth/CMS/Soapbox fixes confidently and were wrong repeatedly. The client deeply values "I'll research that" over a confident wrong guess.

---

## WHAT THE CLIENT VALUES (working style)

- **Honesty over confidence.** "I'm not sure, let me check" beats a confident guess every time.
- **Plans before action.** Even small features get a short plan + decisions + what-could-go-wrong, and the client approves before you build.
- **Tradeoffs surfaced**, with a recommendation. Don't pretend one path when there are two.
- **Plain language.** They're non-technical and busy. No jargon, no walls of code in chat.
- **No faked testing.** Be explicit about what you verified in the sandbox vs. what needs a live test (e.g., anything depending on Soapbox/MailChimp/Formspree/Google Sheets can only be confirmed live).
- **Meticulous records.** Update the docs as you go.

---

## UPLOAD-STATUS CHECKLIST (ask the client early)

To sync your understanding with reality, confirm with the client:

1. On the home page (pyt-website.pages.dev), is there **no** "Now Playing" show box? (Confirms v4 home redesign is live.)
2. On `/donate`, does the "Donate Now" button open the Soapbox donation page in a **new tab instantly** (no lag)? (Confirms v6 donate fix is live.)
3. In the CMS, do you see a **"Cast Pages"** collection in the sidebar? (Confirms v5 is live — client already confirmed yes.)
4. Have you uploaded the **handoff documentation batch** (the one containing this START_HERE file and the refreshed docs)? (Determines whether the repo docs match this file.)

Once those are confirmed, you and the client share an accurate picture, and you can plan the next step (most likely: continue waiting on Shopify, or start Phase 4 groundwork).

---

## SUGGESTED FIRST MESSAGE TO THE CLIENT

Keep it short and non-technical. Something like: confirm you've picked up the project, that you've read the handoff, that you've re-cloned the current site to work from, and ask the 3–4 confirmation questions above (ideally as tappable buttons) so you both start from the same picture. Then propose what to work on next based on their answers. Do not start building anything until you've confirmed current state and agreed a plan.
