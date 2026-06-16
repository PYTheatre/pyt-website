# PYT Website — Master Handover (2026-06-15, evening)

**This is the current master handover. Trust it over any older handover.**
It supersedes `HANDOVER-2026-06-09-EVENING.md` (the doc the *previous* session started from) and every earlier handover.

Written for the next Claude session by the Claude that worked the 2026-06-15 session. The project manager (the user) is **non-technical, often on mobile**, and is taking this project all the way to launch. Communicate in plain language, keep it short, and never paste walls of code.

---

## 1. What this project is

A complete rebuild of the **Peninsula Youth Theatre (PYT)** website — a Bay Area community youth theatre. The old site was a dated, hard-to-edit WordPress site. The new site is a fast, modern, statically-generated site that PYT staff can edit themselves through a simple admin panel, with no developer involvement.

**The PM's role:** non-technical project manager. They make all content and design decisions, do the actual uploads to GitHub, and do every live visual check (Claude cannot see the live site). They rely on Claude to do the building, to explain choices in plain terms, and to be honest about what's been tested.

**The end goal:** carry the site to execution / launch on the real domain (`pytnet.org`). Most core features are built and live. Remaining big rocks are the rebrand + go-live (Phase 5), plus a few blocked items waiting on third-party setup (Shopify, matching-gifts).

---

## 2. The stack, in plain terms

- **Astro 6** — the site generator. Pages live in `src/pages/`. Reusable content (shows, programs, etc.) lives in "content collections" with a schema file at `src/content.config.ts`.
- **Decap CMS 3.10.1** — the admin panel at `/admin`. Its configuration is one file: `public/admin/config.yml`. This file defines every editable field the staff see.
- **Cloudflare Pages** — the host. Every push to the `main` branch on GitHub triggers an automatic rebuild (~2 minutes). Live URL today: **`pyt-website.pages.dev`**. Real domain `pytnet.org` comes in Phase 5.
- **GitHub repo:** `PYTheatre/pyt-website` (branch `main`). NOTE: there is also an empty `peninsula-youth-theatre` org — ignore it, it's a red herring from old notes.
- **Editable content vs structure:** staff edit *words, images, links, numbers* through the CMS. *Layout and structure* stay in code. This is a locked decision.

**Third-party services in play:** NonprofitSoapbox (donations, syncs to Salesforce — this is *why* Soapbox is retained), MailChimp (newsletter), Active.com (class registration), SmugMug (photos), Shopify (shop + intended for nothing else now), Google Sheets/Forms (cast schedules, audition conflicts).

---

## 3. THE WORKFLOW — do not deviate

This is how every piece of work goes. It is in `PROJECT_RULES.md` in full; the short version:

1. PM describes what they want.
2. **Claude asks clarifying questions** if anything is unclear — as plain numbered text. **Do NOT use the tappable-button tool (`ask_user_input_v0`)** — it has repeatedly failed to render on the PM's screen. Plain numbered questions only. (This is a change from what `PROJECT_RULES.md` Rule 4/9 says — the buttons were tried and they don't work for this PM. Follow this handover.)
3. **Claude writes a clear, non-technical plan and waits for explicit approval before building.** Surface decisions and tradeoffs, recommend, then wait. Even for small changes.
4. Claude builds in the sandbox (`/home/claude/pyt-website`).
5. Claude tests with `npm run build` (must stay at the expected page count — currently **20 pages**) and inspects the built HTML to verify changes. Claude **cannot take screenshots** — the live visual check is always the PM's.
6. Claude updates `BUILD_LOG.md` meticulously.
7. **Claude hands over edited files using `present_files`** and gives **edit-in-place GitHub links** (see §4). The previous workflow used zip files; this session used direct per-file `present_files` + edit-in-place links, which the PM is comfortable with. Either is fine, but per-file edit-in-place links have worked smoothly and are less error-prone for single-file changes.
8. PM uploads, Cloudflare rebuilds (~2 min), PM reports back. Claude confirms or iterates.

**Hard rules worth burning into memory (full text in `PROJECT_RULES.md`):**

- **Rule 1 — Never fix third-party integrations (CMS/OAuth/Soapbox/Decap) confidently from memory.** This is the single biggest, most expensive trap on this project. Gather the actual error/console/screenshot first; web-search current docs; offer possibilities rather than a confident wrong fix. (Happened again this session — see §6, the "CMS changes not showing" episode.)
- **Rule 2 — The live GitHub repo is the source of truth for CMS-managed content; the sandbox copy is STALE.** Never include `src/content/**` files in an upload unless the PM explicitly asked to overwrite live content. When you add a CMS field, the live content file won't have it yet, so the page MUST handle the field being absent. Test the empty case.
- **Rule 3 — Plan before building, get approval, and be honest about what you did/didn't verify.**
- **Rule 5 — Uploads can only add/overwrite, never delete.** If a file must be deleted, give the PM a `github.com/.../delete/main/...` link and warn clearly.
- **Rule 6 — Cloudflare "internal error" deploy failures are usually transient — retry once.**
- **Rule 8 — `BUILD_LOG.md` is history, not current state.** Keep it meticulous but don't read current state off it.

---

## 4. How to hand files to the PM (mechanics that work)

- Build/edit in `/home/claude/pyt-website`. Clone fresh from GitHub at session start: `git clone https://github.com/PYTheatre/pyt-website.git` (the sandbox CAN reach GitHub — it worked all of this session). If it ever can't, tell the PM and they'll paste/upload files.
- For each changed file, call `present_files` with the sandbox path, then give the PM an **edit-in-place link**:
  `https://github.com/PYTheatre/pyt-website/edit/main/<path>` — they open it, select-all, delete, paste, commit.
- After any `public/admin/config.yml` change, tell the PM to **hard-refresh `/admin`** (Cmd+Shift+R or incognito) so the CMS picks up the new fields.
- Tell the PM to **watch the Cloudflare deploy go green (✓)**. A red ✗ means the build failed and the live site keeps serving the old version (see §6).

---

## 5. CURRENT STATE — what's built and live

The site builds cleanly at **20 pages**. Everything below was confirmed working this session unless marked otherwise.

**Core pages live:** Home, Shows (list + per-show detail), Audition, Classes & Camps (Programs), Stories on Stage, Shop (placeholder), About, Support PYT (`/ways-to-support`), Subscribe, Photos, Casting, Employment, Judy Robe & Spirit Awards, Cast Pages (soft-gated, unlisted).

**Work completed THIS session (2026-06-15), all built & handed over (PM was uploading as we went):**

1. **Support PYT page — major reworking:**
   - Removed the "Double your gift" matching panel (and its CMS field).
   - Added a **Corporate Giving** panel between the donor tiers and Sponsorship — 4 tiers (Partner/Patron/Producer/Executive Producer), each CMS-editable (name, amount, benefits), each with a button.
   - Added a **Donor Recognition** wall at the bottom — names grouped by tier, plus a general "Supporters" group for those who don't want their level shown. CMS-editable; empty groups auto-hide.
   - **Sponsorship now routes to Soapbox, NOT Shopify** (see §7 — this reverses a locked decision for good tax reasons). Both sponsor buttons point at the general Soapbox donation page.
   - Corporate buttons say **"Join"** (PM's chosen word — deliberately not "Donate"/"Sponsor"); they show "Coming soon" until the PM creates a *separate corporate Soapbox page* and pastes its URL in the CMS.
   - Donor tier cards each got a "Join" button → Soapbox.
   - Made the "Giving levels" eyebrow + "Every gift, every level." heading CMS-editable.
   - Moved the 501(c)(3)/EIN note to the very bottom of the page (applies to all giving).
   - Added a clickable **mailto** contact email under the Corporate intro (CMS field `contact_email`).
   - Replaced the hardcoded "Show-level/Season-level sponsorship" labels with optional CMS price fields.
   - Made all three section eyebrows **fully opt-in** (clear the field → eyebrow disappears). This took two attempts — see §6.

2. **Home page:** removed all five section eyebrows ("Summer 2026", "On stage", "Welcome", impact, campaign label); removed the discovery-card "tags (small pills)" feature entirely (this also FIXED a build-breaking crash — see §6).

3. **Shows list page (`/shows`):** removed the grey sponsorship CTA strip and the "Upcoming shows for 2026-2027" intro line; removed the grey age line from each show card; restyled "See details" from a plain link into a pink-outline button matching the Tickets button, then moved it onto the same row as Tickets.

4. **Judy Robe & Spirit Awards page:** completely restructured the data model from a flat "year + name blob" to **Year → Shows → (optional Judy Robe recipient + optional Spirit Award names)**, with a clean grouped layout. CMS rebuilt to match. Seeded with 2 real example years. (The old placeholder data was replaced with PM's approval.)

5. **About page:** made the hardcoded "Judy Robe" sentence CMS-editable AND added a second editable sentence linking to the Casting page (each built as lead-text + clickable-label + tail-text so the link can't break). Added a new **"Artists"** section between Staff and Board — same structure and CMS editability as those two.

6. **Photos page:** discovered it had **no CMS record at all** (the page existed and read from `photos-page.json`, but `config.yml` never exposed it). Added a full Photos Page CMS record exposing every field — titles, copy, the "favorites" image list, and the SmugMug button.

7. **Classes & Camps:** the PM removed "Studio Intensive" and renamed CMS card titles via their own edits (no Claude change needed in the end).

---

## 6. CHALLENGES & RECURRING TRAPS (read this carefully)

This project has a long history of the same kinds of problems. The ones that bit us, and how they were resolved:

**A. The "CMS edits not showing up on the live site" scare (this session).**
The PM edited the home page in the CMS; nothing changed despite hard-refreshes. The instinct is to suspect a broken CMS↔site link. **The real cause:** a code bug (`card.meta.map(...)` crashed when a discovery card had its tags removed) made the Cloudflare **build fail** — so the live site kept serving the last good version, silently ignoring every subsequent CMS commit. The red ✗ marks on the GitHub commit list / Cloudflare deploys were the tell. **Lesson: when "CMS changes aren't showing," check the Cloudflare deploy status FIRST (green ✓ vs red ✗), and check the GitHub commit list for failed builds, before theorizing about the CMS.** A failed build freezes the whole site.

**B. The "can't clear an eyebrow / field in the CMS" trap (this session, two attempts).**
Optional text fields with a **default value** in code can't be cleared: when the PM empties the field, Decap drops the key, and code written as `field || "Default"` or `field !== undefined ? field : "Default"` falls back to the default — re-showing the thing they tried to remove. **The fix that works: make the field purely opt-in** — `const x = data.field || ""` and render only `{x && <p>{x}</p>}`. No default. Then clearing genuinely removes it. We hit this with the home-page tags, then again with the Support-page eyebrows. **If the PM ever says "I cleared a field but it won't go away," this is almost certainly why.**

**C. Stale sandbox content (Rule 2, ongoing).**
The PM edits content live in the CMS constantly. The sandbox's `src/content/**` files are out of date. This session the Support-PYT content (tier names, corporate amounts, "Donor benefits" heading) differed between sandbox and live. **Never overwrite live content files.** When the PM says "the CMS doesn't match the page," the answer is usually: the live content is the truth, edit it in the CMS — not in code. If they want code seed-data aligned to live, ask them to paste the current live values.

**D. Things that are hardcoded vs CMS-editable.**
A recurring source of PM confusion: some copy looks editable but is hardcoded in a page template (e.g. the "Giving levels" heading, the Judy Robe sentence, the Photos page entirely). The pattern this session was: PM can't find something in the CMS → it was never wired up → make it CMS-editable. Default to making things editable when asked.

**E. Decap field-clearing behaviour can't be fully verified from the sandbox.**
Claude can't run the live CMS, so whether Decap saves `""` vs drops a key on clear is something only the PM can confirm live. Be honest about this. The opt-in pattern (B) handles both cases, so prefer it.

**F. grep/verification false alarms.**
Several times this session, a `grep -c` count looked alarming (e.g. "2 EIN notes!", "0 Join buttons!") but was just matching the site footer, the `<style>` block, or HTML-encoded text. **Verify by inspecting the actual rendered context, not raw counts, before reporting a problem to the PM.**

**G. The general "fix from memory" trap (Rule 1).**
Still the biggest historical risk. This session stayed disciplined: diagnosed the build-failure by reading the actual Cloudflare/commit state and reproducing the crash in the sandbox, rather than guessing. Keep doing that.

---

## 7. KEY DECISION MADE THIS SESSION (updates DECISIONS.md)

**Sponsorship and Corporate Giving route to Soapbox, NOT Shopify.** This reverses the 2026-06-03 locked decision (in `DECISIONS.md`) that sponsorship would use Shopify. Reason: Shopify treats a large sponsorship as a product purchase — **not tax-deductible, no Salesforce sync, transaction fees**. The PM confirmed sponsorship must stay tax-deductible. So:
- **Sponsor a Show / Sponsor a Season** → the **general** Soapbox donation page (`https://pyt.secure.nonprofitsoapbox.com/donate`), the same flexible form the Donate button uses (it has an "Other" amount box + recognition-name field, so one page serves individuals + both sponsorship types). **Live now.**
- **Corporate Giving** → a **separate, dedicated** Soapbox page that **does not exist yet**. Until the PM creates it and pastes the URL into the CMS (Corporate Giving record → "Corporate Soapbox donation link"), the corporate "Join" buttons show "Coming soon."
- This means the old `SPONSOR_LINKS_LIVE` / Shopify-placeholder logic in `ways-to-support.astro` is **gone**.

**`DECISIONS.md` should be updated to reflect this** (it still describes the Shopify model as current). I flagged it but did not rewrite `DECISIONS.md` itself this session — see §9 "loose ends."

---

## 8. WHAT'S OUTSTANDING / NEXT

**Blocked on the PM / third parties (Claude can't do these):**
- **Corporate Soapbox page** — PM must create it on Soapbox, then paste the URL into the CMS to activate the corporate "Join" buttons.
- **Shop & Sponsorship-via-Shopify** — moot for sponsorship now (moved to Soapbox), but the Shop page is still a placeholder pending a real Shopify store.
- **Matching gifts** — was removed from Support PYT; if it returns, needs the embed snippet from PYT's matching service.

**Open follow-ups (Claude can do, not yet done):**
- **Site-wide "Sponsor" buttons on the Shows pages** (`shows/index.astro`, `shows/[slug].astro`) may still point at the old `/ways-to-support#sponsor` or old Shopify placeholders. The Support-PYT sponsorship was moved to Soapbox; the show-page sponsor buttons should be checked and aligned. (The grey sponsor strip on the Shows *list* page was removed this session, but the per-show *detail* page sponsor button was not audited.)
- **Update `DECISIONS.md`** to record the Soapbox-for-sponsorship reversal (§7).
- **Photos page favorites** — PM to upload the actual images (now that the CMS record exists).
- **Old-doc cleanup** — the repo has many stale docs cross-referencing each other (see §9). Deleting them would reduce confusion but requires PM action (Rule 5).

**The big remaining phase:**
- **Phase 5 — rebrand + go-live.** Real fonts (the Cupidus/Nunito question is unresolved — see `DECISIONS.md`), final colours, clean vector logo, and wiring up `pytnet.org` with DNS. Plus a **staff "where do I edit X in the CMS" guide** (the helper tips were removed from pages, so this doc is owed).

---

## 9. WHICH DOCS ARE CURRENT vs OLD

The repo is littered with cross-referencing docs. Go by THIS list, not by what the docs say about each other.

**CURRENT — trust these:**
- **`HANDOVER-2026-06-15-EVENING.md`** ← this file. The master handover.
- **`PROJECT_RULES.md`** — the workflow rules. Still current and essential (but note the one correction in §3: use plain numbered questions, NOT the button tool).
- **`DECISIONS.md`** — locked decisions. Still the reference, BUT it is now **out of date on one point**: it still describes sponsorship as Shopify-based; the truth is Soapbox (§7). Read it, but apply the §7 correction. Updating it is an owed task.
- **`BUILD_LOG.md`** — accurate phase-by-phase history (I appended every change this session). History, not current state.

**OLD — ignore for current state:**
- `HANDOVER-2026-06-09-EVENING.md` (the previous master — superseded by this one), `HANDOVER-2026-06-09.md`, `HANDOVER-2026-06-03.md`
- `START_HERE.md`, `IN_FLIGHT.md` (stale)
- `AUDITION-FEATURE-STATUS-2026-06-09.md`, any `HANDOFF.md`
- `README.md` (generic)

---

## 10. RISKS IN THIS CONTEXT TRANSITION (and how to bridge them)

The PM asked me to flag transition risks. Honestly:

1. **Stale sandbox content is the #1 risk.** A fresh Claude will `git clone` and may assume the content files reflect the live site. They often don't (the PM edits live constantly). **Bridge:** before changing anything content-related, the new Claude should treat `src/content/**` as reference-only, never include it in uploads, and when in doubt ask the PM to confirm current live values. Re-read Rule 2.

2. **The new Claude won't have my memory of *why* things are the way they are** — e.g. why sponsorship is Soapbox not Shopify, why eyebrows are opt-in, why the Photos page suddenly got a CMS record. **Bridge:** §6 and §7 of this doc capture the reasoning. The new Claude should read this whole file + `PROJECT_RULES.md` + `DECISIONS.md` before touching anything.

3. **`DECISIONS.md` contains a now-false statement** (sponsorship = Shopify). A new Claude reading it cold could "helpfully" rebuild sponsorship around Shopify. **Bridge:** §7 here is explicit; ideally update `DECISIONS.md` early in the next session.

4. **The build-count canary.** The site builds to 20 pages. If a future change makes it 19 or errors out, something broke. **Bridge:** the new Claude should run `npm run build` at the start (to confirm a clean baseline) and after every change, and treat a page-count change or error as a stop signal.

5. **The PM does all visual verification.** Claude literally cannot see the result. **Bridge:** always tell the PM exactly what to look at after each deploy, and never claim a visual thing "looks right" — only that the build passed and the HTML contains what's expected.

6. **Failed-build silence.** If the PM says "my changes aren't showing," the new Claude must check Cloudflare deploy status + GitHub commit ✗ marks FIRST (§6A), not theorize about the CMS.

Net: the transition is low-risk *if* the new Claude reads this file, `PROJECT_RULES.md`, and `DECISIONS.md` first, runs a baseline build, and respects the stale-content rule. The biggest danger is a confident new Claude moving fast on assumptions. The whole culture of this project is: slow down, verify against reality, plan, ask, test.

---

## 11. Quick-start checklist for the next session

1. Read this file, then `PROJECT_RULES.md`, then `DECISIONS.md` (applying the §7 correction).
2. `git clone https://github.com/PYTheatre/pyt-website.git` into `/home/claude`, `npm install`, `npm run build` — confirm a clean **20-page** baseline.
3. Treat `src/content/**` as stale/reference-only. Never upload it without explicit PM say-so.
4. When the PM asks for something: ask plain numbered clarifying questions if needed → write a short non-technical plan → wait for approval → build → `npm run build` + verify the rendered HTML → update `BUILD_LOG.md` → hand over via `present_files` + edit-in-place links → tell the PM what to check live and to watch for the green ✓.
5. Be honest about what's tested vs not. Don't fix third-party integrations from memory. Slow down.
