# PYT Website — Handoff (read first)

**Last updated:** 2026-05-29

If you are a new Claude session picking up this project, **read this file all the way through before doing anything else.** Then read the other markdown files (in the order at the bottom of this file). Only then start work.

---

## What this project is

The Peninsula Youth Theatre (PYT) website rebuild. PYT is a non-profit youth theatre in Mountain View, California. The project's goal is to give PYT a free-hosted, mobile-first, design-token-driven website that **non-technical staff can edit through forms** — without GitHub, without code, without a developer.

**Stack:** Astro 6 (static site generator) + Decap CMS 3.10.1 + Cloudflare Pages (free hosting, GitHub auto-deploy).

**Live site:** https://pyt-website.pages.dev
**CMS login:** https://pyt-website.pages.dev/admin
**Repo:** https://github.com/PYTheatre/pyt-website (note the org is `PYTheatre`, NOT `peninsula-youth-theatre` despite what the original handoff notes said)

**Workflow:** The client (a non-technical project manager) chats with Claude. Claude writes/edits files in a sandbox, tests, packages them as a `.zip`, and presents the zip. The client drag-and-drops the zip's contents into GitHub's web upload, commits to `main`, and Cloudflare auto-deploys in ~2 minutes. Content edits (shows, programs, page copy, etc.) happen through the Decap CMS form interface at `/admin` and never touch the chat-and-upload workflow.

---

## Where the project stands right now

**Phases 0 through 3.1 are complete and verified live, and Phase 3.2 (Rentals) is built and ready to upload.** The site is functional: home page, shows list with detail pages, Stories on Stage, Classes & Camps with filters, Donate (Soapbox popup — see open issue below), Sponsor, Casting, About (with Board of Directors fields), Employment, a `/subscribe` newsletter signup page (verified working), and a `/rentals` page with editable photo categories and an inquiry form.

**Phase 3.2 (Rentals) is built and ready to upload.** It adds `/rentals` with a staff-editable category grid and a Formspree-backed inquiry form. After upload, do a test submission to confirm inquiries reach both `info@pytnet.org` and `lhatten@pytnet.org`.

**Phase 3 remaining sequence:** Shop → Cast Pages → Google Sheets.

**Two issues open:**

1. **Donate button on /donate** — diagnosed. The button does a full page reload before the Soapbox popup appears (4–5 sec delay). Fix is identified (switch to Soapbox's `data-sbx` anchor trigger so no reload happens), but blocked on the client supplying the Soapbox donation-form `data-id` value. See `IN_FLIGHT.md`.
2. **Rentals form test** — needs a live test submission after upload to confirm delivery to both inboxes. See `IN_FLIGHT.md`.

---

## How to read the documentation

In order:

1. **`HANDOFF.md`** (this file) — what's true today, the broad map.
2. **`PROJECT_RULES.md`** — non-negotiable operating rules. **These rules are not suggestions.** Every Claude session that has worked on this project has broken at least one of them on their first day. Read carefully and re-check before each significant action.
3. **`IN_FLIGHT.md`** — what's mid-stream right now. Pending issues, awaiting-client items, the donate-click bug.
4. **`DECISIONS.md`** — every locked decision the client has made, with the reasoning. **Do not re-litigate these unless the client explicitly raises one.**
5. **`BUILD_LOG.md`** — phase-by-phase history. Read for context on how we got here. Phase entries are reverse-chronological (newest at the top).

Also useful but secondary:
- The repo itself (`PYTheatre/pyt-website` on GitHub) — the actual source code, the actual current state. The sandbox in your environment may be stale.
- `README.md` in the repo — minimal intro, not a handoff.

---

## Working style the client appreciates

Briefly, because it matters for the first few exchanges:

The client values **honesty over confidence**. They'd rather you say "I'm not sure, let me research" than guess. When you've made a mistake, name it directly and fix it without theatrical apology.

They like **plans before action**. Even small features get a short plan first ("here's what I'd build, here are the decisions, here's what could go wrong") and they approve before you start. They'll often ask clarifying questions that surface assumptions you hadn't realized you were making — answer those carefully.

They want **tradeoffs surfaced**, not buried. When a decision has two viable options, lay them out side-by-side and recommend one. Don't pretend there's only one path.

They're **non-technical**. Avoid jargon when plainer words work. Avoid screen-walls of code in chat — share files via the upload mechanism instead.

They will **catch you** if you skip steps. Don't fake testing or skip verification.

---

## What "done" looks like for this project

There is a Phase 4 (EN/ES bilingual) and a Phase 5 (full rebrand test, docs, handoff) planned. Beyond that, the project transitions to maintenance — staff edit content through the CMS, and Claude is only needed for new features or unusual problems. The Phase 5 deliverable is supposed to include a clear "where do I edit X in the CMS" map for staff, because the previous decision to remove the "For staff:" helper notes from public pages removed the only on-site guidance.

---

If you are a new Claude session: stop reading this file now and go read `PROJECT_RULES.md`.
