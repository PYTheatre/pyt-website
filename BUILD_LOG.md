PYT Website — Build Log
Phase-by-phase history of work completed. Newest at the top.
New Claude session: read START_HERE.md first. For current state, read START_HERE.md and IN_FLIGHT.md. For rules, read PROJECT_RULES.md. For locked decisions, read DECISIONS.md. This build log is history — accurate for how we got here, but not the place to read off current state.

Staff guidance note on show poster sizing (2026-06-09)
Goal (PM): staff have had hit-and-miss results getting show poster images to crop well in the page frames. Add a note in the CMS image-upload window telling them what size/shape works.
Why it crops badly (root cause): the same show poster is shown in TWO frame shapes — 3:4 portrait on the show detail page, and 16:9 landscape on the shows-list card (which itself switches to 3:4 on mobile) — and both use background-size: cover, so the image is zoomed to fill and the overflow is cropped. A design centred with generous margin survives both crops; edge-to-edge artwork or edge text gets cut.
Built (1 piece): public/admin/config.yml (EDIT) — updated the hint on the Shows collection "poster" field (the only change) to advise: tall 3:4 (~1200×1600), keep title/artwork centred with margin, avoid edge text, because the image crops differently on different screens. Wording approved verbatim by PM.
Not changed: the actual crop/layout behaviour (PM explicitly wanted the note only, not a layout change — a more forgiving crop is noted as a possible separate future task). Stories on Stage's poster field (16:9, same cover crop) was left as-is since the PM asked specifically about show images; could get the same note later if wanted.
Tested: config.yml re-validated as valid YAML; confirmed the hint reads correctly on the Shows poster field. No build impact (hint text only).
Next: PM re-uploads public/admin/config.yml; hard-refresh /admin to see the new note under the poster upload box.

Goal (PM): When a show is double cast, the external ticketing site (tickets.mvcpa.com) refuses to label which cast performs on which date — it only shows venue codes (e.g. Lancaster/York). Families buying tickets can't tell which cast they're getting. Add a schedule on each show page listing every performance with its date, time, cast name, and a buy link straight to that exact performance.
IMPORTANT — "double cast" is NOT the same as "Mainstage" (this was corrected mid-build): Mainstage shows are ALWAYS double cast, but SecondStage / Studio shows are SOMETIMES double cast too. So the schedule is gated on an explicit "double cast" flag, not on tier. (Example live: SIX is on SecondStage, not Mainstage, but IS double cast.)
Decisions with PM: (1) Lives ON the existing show page (/shows/<slug>) as a self-contained "Performances & casts" section, NOT a separate page per show. (2) Per-performance buy links (one per row), not the show's master link. (3) Rows in entry order with a cast LABEL per row (date · time · cast · Buy button), NOT grouped under cast headings — reads in date order, best on mobile. (4) Data entered by hand as a repeatable CMS list per show. (5) Gated by an explicit "This show is double cast" tick-box: the section shows ONLY when the box is ticked AND at least one valid performance row exists. So an un-ticked show, or a ticked one with an empty list, shows nothing.
Built (3 code pieces + this log):
src/content.config.ts (EDIT) — added to the shows schema: double_cast (optional boolean, .catch(undefined)), cast_a_name, cast_b_name (optional strings, CMS-hint helpers only), and performances — an optional, tolerant array of { date_label, time_label, cast, buy_url } (all subfields optional, outer .catch(undefined)), modeled on the existing cast-pages resources list.
src/pages/shows/[slug].astro (EDIT) — renders a "Performances & casts" section after the synopsis. Filters performances to rows that have at least date_label AND cast (a half-filled row is dropped, not rendered blank); shows the section only when data.double_cast === true AND ≥1 row survives. Each row: date + optional time, the cast name, and either a "Buy tickets" button (if buy_url present) or a non-clickable "On sale soon" pill (if blank). Mobile-first styles using existing tokens; button goes full-width under ~520px.
public/admin/config.yml (EDIT — insert fields into the shows collection) — added double_cast (boolean tick-box, default false), cast_a_name, cast_b_name, and a performances list widget (subfields: date_label, time_label, cast, buy_url) with plain-language hints, after cast_page_url. List summary shows "{{date_label}} {{time_label}} — {{cast}}".
Tolerance / Rule 2: no src/content/** files touched. New schema fields are all optional, so existing live show files (which lack them) build fine and show no schedule block.
Tested (sandbox COULD reach GitHub this session — real clone + build): npm run build passes, 20 pages (unchanged — this adds a section, not a route). config.yml re-validated as YAML; performances subfields match the page one-to-one. Gating verified with temporary sample data on Wizard of Oz, all three cases correct: (A) ticked + 2 performances → section renders with 2 rows, broken/half-filled rows dropped, "Buy tickets" vs "On sale soon" correct; (B) ticked but empty list → no section; (C) performances present but NOT ticked → no section. Temporary sample data then REMOVED and the file restored to original (git diff clean).
NOT verified (needs PM): the live visual look on phone + desktop (Claude can't screenshot — always the PM's check); that the new fields (incl. the tick-box) appear in /admin (needs the PM's hard-refresh of /admin after the config.yml change).
Separate content note (PM to fix in CMS, not code): SIX is currently labelled "2026 Mainstage" on the site but performs on SecondStage — the eyebrow/label on the SIX show should be corrected in /admin. Not a code change; do not touch content files.
Still open / next: PM uploads the 3 changed code files (+ this log); after the config.yml change, hard-refresh /admin; then for SIX (double cast, actively selling): tick "double cast", enter the performances, and visually check the page on phone + desktop.

Goal (PM): A new Audition page listing all shows currently casting (with their external/Active.com sign-up links, same as the Shows page), plus a Stories on Stage panel, a casting-philosophy panel linking to the Casting page, and a CMS-editable FAQ. Make Audition its own top-level menu heading and move Casting under it (out of About).
Built (4 pieces):
src/pages/audition.astro (NEW) — hero (CMS copy), a list of shows with OPEN auditions pulled live from the shows collection, a Stories on Stage panel → /stories-on-stage, a casting-philosophy panel → /casting, and an FAQ (details accordion) that hides when empty.
src/content/settings/audition-page.json (NEW — brand-new settings file, OK under Rule 2) — starter copy + 3 starter FAQs. Every field has a page-side fallback.
src/components/Header.astro (EDIT) — new "Audition" navGroup (/audition, children: Audition, Casting); Casting removed from the About group. About now = About + Employment. Final menu: Shows▾ · Audition▾ · Classes & Camps · Shop▾ · About▾ · Support PYT · +Donate.
public/admin/config.yml (EDIT — insert a record) — new "Audition Page" Site Settings record (12 fields incl. an faqs list of question/answer). This piece was the last handed over and was NOT confirmed committed before the session ended — see AUDITION-FEATURE-STATUS-2026-06-09.md.
Open-auditions filter: a show shows only if it has audition_url AND an end date (audition_end, falling back to legacy audition_date) that is today-or-later. Deliberately stricter than /shows: a show with a link but no end date does NOT appear (can't tell if open).
Decisions with PM: Audition is its own top-level heading with Casting beneath it (PM's revised request — originally floated as a child under Shows). Stories on Stage is a panel, not part of the dated list (it's cast from one annual audition, no per-show dates). Casting philosophy is its own panel, not folded into the FAQ.
Tested: the sandbox could NOT reach GitHub this session (clone/build blocked by the network allowlist), so work was built against files the PM pasted (content.config.ts, shows/index.astro, Header.astro, config.yml) and verified via logic/parse checks, NOT a real site build: JSON valid (12 fields); navGroups parses with Audition added + Casting moved + About reduced; open-auditions filter correct across edge cases (future/passed/legacy/same-day/no-link/no-end-date); config.yml block parses as YAML and its fields match the page one-to-one (no orphans). A real npm run build, the page count (should be 20, was 19), and the live visual check were NOT done — the latter is always the PM's.
Still open / next session: confirm pieces #1–3 committed to correct paths; confirm/finish piece #4 (config.yml record) — most likely still pending; PM to hard-refresh /admin after the config.yml change; PM to visually check /audition on phone + desktop.
Process note: the tappable-button question tool did not render for the PM this session ("I can't see your question") — fell back to plain numbered text questions, which worked. Worth doing proactively next time.
Photos page — front door to SmugMug photo sales (2026-06-08)
Goal (client): give families a way to find and buy photos from PYT's shows and events. The photos are hosted and sold on PYT's SmugMug site (peninsulayouththeatre.smugmug.com).
Approach (researched, not guessed — PROJECT_RULES Rule 1): SmugMug is a complete storefront (cart/checkout/print sizes/payment all live on SmugMug) and does not support embedding its pages into another site. So rather than half-rebuild the shop, the new page is a clean "front door" that hands off to SmugMug — the same pattern we use for Soapbox (donations) and MailChimp (newsletter). Client chose this (Option A) over a slideshow embed (Option B) and over per-gallery embeds (Option C, advised against as fragile).
Built: new page at /photos:

Hero intro (eyebrow + title + lede).
Optional grid of sample photos (up to whatever staff add) — each in a fixed 4:3 frame (object-fit: cover) with a "Photo coming soon" placeholder when empty, mirroring the Rentals category-photo pattern. Section hides entirely if the list is empty.
A clear call-to-action card with a button to the SmugMug site, opens in a new tab (target="_blank" rel="noopener"). Button falls back to the main SmugMug URL if the CMS field is blank, so it's never a dead link.
Added "Photos" to the main nav (Header.astro navItems, after "Shop") — one list feeds both desktop and mobile.

CMS: new "Photos Page" settings record (src/content/settings/photos-page.json) added as a files: entry in config.yml. Editable: title, eyebrow, intro, sample-photos heading/blurb, the sample photos list (image + optional caption each), CTA heading/blurb, the SmugMug link, button label, and button note. All with fallbacks so the page renders correctly before staff touch it. Layout stays in code (content-only editability, per Phase 2.8 decisions).
Photos themselves: client will upload 3–5 sample photos via the CMS (Site Settings → Photos Page). Page ships with 3 empty sample slots showing "Photo coming soon" placeholders until then. Did NOT fabricate or fetch images (SmugMug blocks automated access, and we don't ship images the client maintains).
Files changed: src/pages/photos.astro (NEW), src/content/settings/photos-page.json (NEW — brand-new settings file for a new feature, so OK to include per Rule 2), src/components/Header.astro (nav item), public/admin/config.yml (new Photos Page settings block).
Tested: clean build, 19 pages (/photos present). Verified in built HTML: 3 placeholder sample cards render, SmugMug button → peninsulayouththeatre.smugmug.com in a new tab with rel="noopener", intro + CTA copy present, "Photos" appears in both desktop and mobile nav after "Shop". Screenshots NOT taken (Playwright browser download blocked by sandbox network allowlist) — visual check is the client's to do live.
Still open / client to do: upload sample photos via CMS; hard-refresh /admin (Cmd+Shift+R) or use incognito so the new "Photos Page" record appears in the editor; optionally aim the button at a specific SmugMug gallery instead of the top-level site.

Support PYT page redesign + sponsorship moved to Shopify; /sponsor deleted (2026-06-03, evening)
Goal (client): rework the Support PYT page (/ways-to-support) and relocate sponsorship.
What changed on /ways-to-support:

Black campaign hero replaced with a light-background section showing campaign progress as a vertical thermometer (accent-pink fill, bulb, driven by the live donation-campaign.json numbers — fill height = clamped raised/goal %). Numbers (raised / goal / donors / %) sit beside it.
Donate Now panel removed (the blurb, the "less than two minutes" line, the "powered by" meta). The Donate button moved up next to the thermometer, relabelled "Donate" (still → hosted Soapbox, new tab; still reads soapbox_donate_url with the standard fallback).
"Double your gift" (matching) callout kept; Giving Levels kept unchanged.
New Sponsorship section added below Giving Levels (same card design, id="sponsor"), two cards only: "Sponsor a Show" / "Sponsor a Season."

Sponsorship now routes to Shopify, NOT Soapbox (reverses two locked decisions — see DECISIONS.md update):

Buttons are DISABLED ("Coming soon") until the real Shopify URLs exist. Front matter has SPONSOR_LINKS_LIVE = false + SPONSOR_SHOW_URL / SPONSOR_SEASON_URL placeholders; flip the flag and paste URLs to activate.
The detailed /sponsor page was DELETED (4-tier benefit lists + show-aware "?show=" behavior all gone). All site-wide "Sponsor" buttons repointed to /ways-to-support#sponsor (was /sponsor#... / /sponsor?show=): in shows/index.astro (Sponsor a Show / a Season) and shows/[slug].astro (Sponsor This Show).
The orphaned "Sponsorship Page" CMS block was removed from config.yml (it edited sponsorship-page.json, which nothing renders now). The JSON content file itself was left in the repo untouched (harmless; not a content file we manage).

Files changed: src/pages/ways-to-support.astro (redesign + sponsorship section), src/pages/shows/index.astro (sponsor links), src/pages/shows/[slug].astro (sponsor link), public/admin/config.yml (removed sponsorship-page block).
Deletion required (client, on GitHub): src/pages/sponsor.astro — uploads can't delete. Until deleted, /sponsor stays live but is fully orphaned (nothing links to it).
Tested: clean build, 18 pages (was 19; /sponsor gone). Verified in built HTML: thermometer fill 38%, Donate→Soapbox, both sponsor buttons disabled "Coming soon", #sponsor anchor, all three site-wide sponsor links → /ways-to-support#sponsor, config.yml valid. Screenshots NOT taken (Playwright browser download blocked by sandbox network allowlist) — thermometer proportions built from the client-approved mockup; needs a live look-check.
Still open: real Shopify sponsorship URLs (blocked on store setup) — then flip SPONSOR_LINKS_LIVE and swap the two URLs in 3 files.
Follow-up (same session): the sponsorship panel's text was wired into the CMS. New fields on the Support PYT record (donate-page.json): sponsor_eyebrow, sponsor_heading, sponsor_show_title, sponsor_show_description, sponsor_season_title, sponsor_season_description. The page reads each with a fallback to the original hardcoded wording, so the panel renders unchanged until staff fill the fields (verified: built with the current live JSON, which lacks the fields — fallbacks render correctly). Files: public/admin/config.yml (added fields), src/pages/ways-to-support.astro (read with fallbacks). The Shopify links stay code-set by design. NOTE: did NOT upload donate-page.json (CMS-owned, Rule 2) — staff populate the new fields via the CMS; they appear after a hard-refresh of /admin. (Aside: live donate-page.json still carries a legacy soapbox_embed_url key instead of soapbox_donate_url — harmless, the page falls back to the standard URL; left untouched.)

"Support PYT" added to the main menu (2026-06-03, evening)
Goal: Add the renamed Ways to Support page to the user-facing nav.
Change: added { label: "Support PYT", href: "/ways-to-support" } to the navItems list in Header.astro, at the end (after Employment, per client). That one list feeds both the desktop pill nav and the mobile hamburger menu, so both got it. Label is "Support PYT" (shorter than the page's own "Ways to Support" title); URL is /ways-to-support.
Note: the separate header "Donate" button (→ Soapbox, new tab) remains alongside this new menu item — they intentionally do different things (button gives directly; menu item opens the page).
Files changed: src/components/Header.astro.
Follow-up (same session): also renamed the CMS sidebar label for this page's settings record from "Donate Page" to "Support PYT" (and tidied the Site Settings description) in public/admin/config.yml, so the staff-facing name matches. Underlying content file donate-page.json left unchanged (label is display-only; renaming the file would add risk for no benefit). Requires a hard-refresh of /admin to show.
Tested: clean build, 19 pages; verified both desktop and mobile nav render "Support PYT" → /ways-to-support in the built HTML. (Screenshots still blocked by sandbox network limits, as last session.)

Donate buttons → straight to Soapbox; Donate page renamed "Ways to Support" (2026-06-03, evening)
Goal (client request): Make the Donate button everywhere a direct link to the hosted Soapbox page (https://pyt.secure.nonprofitsoapbox.com/donate, new tab), and rename the Donate page to "Ways to Support" with a matching URL.
Decisions made this session (with client):

Considered fully removing the Donate page; client chose Option A — keep the page and its content (campaign progress bar, donor tiers, matching note, sponsorship pointer), only repoint the buttons. No content lost.
This overrides a locked DECISIONS.md choice (header/home buttons previously routed through /donate first so donors saw campaign progress before giving). Client explicitly chose to override for now. DECISIONS.md updated accordingly.
Page renamed: title and URL. /donate → /ways-to-support. Browser-tab title now "Ways to Support — Peninsula Youth Theatre". The visible H1 stays CMS-driven (donatePage.intro_heading) and was not hardcoded.
Consequence (accepted): with all buttons bypassing it, /ways-to-support is now an orphan page reachable only by direct URL. Fine as a temporary state; revisit later.

Files changed: src/components/Header.astro (Donate button → Soapbox, new tab), src/pages/index.astro (home donate-teaser button → Soapbox, new tab), src/components/Footer.astro (Donate link → Soapbox + new-tab handling via an external flag on that link entry), src/pages/ways-to-support.astro (NEW — renamed copy of donate.astro, comment header + title updated).
Deletion required (client, on GitHub): src/pages/donate.astro must be deleted directly on GitHub — uploads can't delete. Until deleted, both /donate and /ways-to-support are live (harmless, just untidy). No CMS/config change needed: the page still reads src/content/settings/donate-page.json, and config.yml only references that file path + field labels, no route.
Tested: clean build, 19 pages (/ways-to-support present, no /donate in sandbox dist). Verified all four link changes in the built HTML. Screenshots NOT taken this session — Playwright's browser download is blocked by the sandbox network allowlist; change is link-target + title only, verified via rendered HTML instead.

Casting page — bold/lists/links now render from the Markdown field (2026-06-03)
Problem: On the Casting page, text the client made bold via the CMS Bold button showed literal **asterisks** instead of bold. (Client clarified they clicked Bold, not typed asterisks — confirming the field is the CMS "markdown" widget, saving real Markdown.)
Root cause: The Casting body field uses the markdown widget (it has a Bold button), so it stores real Markdown. But casting.astro had a hand-rolled "Markdown-ish" parser that only split paragraphs and -  bullets and printed the rest as raw text — it never rendered **bold**, didn't recognize the client's *  bullets, and dropped the [link](...). So three things were broken, not just bold.
Investigation (scope): Checked every body/description field in the CMS. The Casting body is the ONLY field using the markdown widget — every other body/description field uses the plain text widget (no Bold button, no Markdown to render). So this was a Casting-page rendering bug, not a site-wide content problem.
Fix: added marked (markdown renderer) and a reusable helper src/lib/markdown.ts (renderMarkdown()). casting.astro now renders the body to HTML and injects it with set:html, replacing the hand-rolled parser. Because injected HTML doesn't carry Astro's scoped-style attribute, the .casting-prose styles were switched to :global() selectors (and bold/italic/link styles added). The helper is reusable: any field later switched to the markdown widget can render through it.
Files changed: src/pages/casting.astro (render via helper + global prose styles), src/lib/markdown.ts (new), package.json + package-lock.json (marked dependency).
Tested in sandbox: clean build (19 pages). Verified rendered HTML: 11 <strong> bolds, the 5-item bullet list as <ul>/<li>, and the Judy Robe <a href> link — no literal ** remaining. Global prose styles confirmed emitted. Desktop screenshot confirms bold, styled bullet list, and the working link.
Note: package.json and package-lock.json changed (new dependency). These must be uploaded too or the Cloudflare build won't have marked and will fail.
Cast Pages — rehearsal resource links (Google Drive etc.) (2026-06-03)
Goal: Each cast page should list links to rehearsal resources — Google Drive folders for choreography videos, costume lists, music tracks, etc.
Built: a repeatable "Rehearsal resources" list on each cast page. Each entry = a button label + a link. They render as a row of buttons in their own "Rehearsal resources" section (same button style as the other cast-page actions), placed below the rehearsal schedule. Section hides entirely when empty. Links open in a new tab; not embedded (Drive folders don't embed cleanly, and a link keeps the content behind Google's real login rather than delivering it into the soft-gated page).
Decisions: links, not embeds (consistent with the cast-list link). The CMS field hint warns that anyone with the page password can see these links, so each Drive folder should be shared deliberately in Google — "anyone with link" only for non-sensitive material, restricted to cast accounts for anything identifying.
Files changed: public/admin/config.yml (new resources list field with label + url sub-fields), src/content.config.ts (tolerant resources array in the castPages schema), src/pages/cast/[slug].astro (new Rehearsal resources section + button-row style). No content files.
Tested in sandbox: build clean (19 pages) across cases — no resources field (section hidden, existing pages unaffected); multiple resources (all render as buttons with correct labels/links); one incomplete item (it's dropped, the rest still render — schema item-fields are optional so a single bad entry can't discard the whole list, and the template filters incomplete items). Unlocked the password gate and screenshotted phone + desktop. (The schedule iframe shows a sandbox network message — that's the test environment blocking Google, not a site issue; it loads fine live.)
Client action after upload: hard-refresh /admin so the new field appears, then add resources per cast page via the CMS.
Cast Pages — fixed broken slug generation in the CMS (2026-06-03)
Problem: Cast pages created through the CMS were getting garbled filenames (the entire form dumped into the filename, e.g. map-show_title-test-cast-page-password-demo-...md). Because the filename is the URL slug in Astro, the page ended up at an unusable URL, and visiting the expected clean URL (/cast/test-cast-page) fell back to the home page (Cloudflare serving index for the missing route). Client couldn't get a testable cast-page URL.
Root cause (researched, not guessed — Rule 1): Per Decap's Folder Collections docs, a folder collection must have a field named title to generate slugs, OR an explicit identifier_field pointing at the field to use. The cast-pages collection's first field is show_title (not title) and had no identifier_field, so Decap couldn't build a slug and fell back to dumping all fields into the filename. The Shows/Programs/Stories collections work because their field IS named title.
Fix: added identifier_field: "show_title" to the cast-pages collection in public/admin/config.yml. New cast pages now get a clean slug from the show title ("Test Cast Page" -> /cast/test-cast-page).
Also: created a correctly-named src/content/cast-pages/test-cast-page.md (same content the client had entered) so they get a working test URL without re-entering it. The old garbled file is deleted by the client on GitHub.
Files changed: public/admin/config.yml (identifier_field), src/content/cast-pages/test-cast-page.md (new, replaces garbled file).
Tested in sandbox: config validates as YAML; build generates /cast/test-cast-page; rendered page has the password gate, the protected content block, the "View the cast list" LINK button, and the rehearsal-schedule EMBED iframe (the template correctly converts the Google /edit URL to /preview).
Note on the two sheets (for the client's live testing): the EMBEDDED rehearsal sheet only displays if that Google Sheet is shared "anyone with the link can view" — otherwise the embed shows a Google sign-in wall. This is exactly why the locked decision requires the embedded sheet to be role-names-only. The LINKED cast list is the opposite: it should stay private (specific accounts only), so clicking it prompts a Google login for anyone not on the share list. Both behaviors are by design.
Shop page — real minimal page created (2026-06-03)
Goal: The /shop URL was showing the home page content (same "SPRING 2026 / Peninsula Youth Theatre" hero, lede, and buttons). Client wanted it clean — just the title "Shop" — until Shopify is set up.
Root cause: There was no shop.astro page in the repo at all. The Header and Footer both link to /shop, but with no page at that route, Cloudflare Pages was falling back to serving the home page (index) for the missing URL. So /shop wasn't "duplicating" home content — it WAS the home page leaking through.
Built: new src/pages/shop.astro — a minimal page using the shared PageHero component with just title="Shop" and nothing else. Now that a real page exists at the route, Cloudflare serves it instead of the home fallback. The Buy Button embed per Collection goes inside this page when Shopify is ready (Phase 3.3).
Files changed: src/pages/shop.astro (new). No content files, no other pages touched.
Tested in sandbox: build went from 18 to 19 pages (the new /shop now generates). Verified the rendered page has the Shop heading and none of the home content (no lede, no "Upcoming Shows" button, no hero photo). Phone + desktop screenshots confirmed a clean title-only page.
Shows page — auditions as a date range, shown to families (2026-06-03)
Goal: (1) Surface the existing Auditions button per show (it was already built but only appears when a show has an audition link). (2) Replace the single audition date with a date range, since auditions often run several days. (3) Show the audition dates to families as text, on both the listing cards and the detail page.
Built:

Schema (src/content.config.ts): replaced single audition_date with three fields — audition_start (date), audition_end (date, drives auto-close), audition_display (free text shown to families, e.g. "August 3–7, 2026"). All optional and tolerant (.catch(undefined)). Legacy audition_date kept as an optional fallback so un-migrated show files don't break.
CMS (public/admin/config.yml): the one "Audition date" field became three — "Audition start date", "Audition end date (for auto-closing)", and "Audition dates (shown to families)". Plain-language hints; single-day auditions = set start and end to the same day.
Listing (src/pages/shows/index.astro): auto-close now keys off audition_end (falls back to legacy audition_date). New "Auditions: <text>" line under the button, shown only when there's a link + display text + auditions still open.
Detail (src/pages/shows/[slug].astro): added an Auditions button to the CTA row (matching the listing's open/closed behavior — it had none before) and an "Auditions" row in the details list showing the display text.

Design decision: display text is a separate hand-typed field, not auto-generated from the two dates — mirrors how show date_display already works, gives staff wording control, avoids fiddly date-range formatting.
Files changed: src/content.config.ts, public/admin/config.yml, src/pages/shows/index.astro, src/pages/shows/[slug].astro. No src/content/** touched.
Tested in sandbox (fully verified): built clean (18 pages) across four scenarios using real show files — (A) new range fields, open → active button + date text on card and detail; (B) end date in the past → button greys to "Auditions closed", date text hidden, both pages; (C) legacy audition_date only, no display field → button still works via fallback, no date text; (D) no audition data → nothing shows. Phone (390px) + desktop (1280px) screenshots of listing and detail confirmed. Test data removed; final build clean on restored content.
Client action after upload: existing shows won't have the new fields — staff re-enter audition info per show via the CMS (the old single date won't auto-migrate, but it keeps working as a fallback in the meantime). Hard-refresh /admin after the config change so the new fields appear.
Follow-up same day — audition date text decoupled from the link. Initial version only showed the audition date text when a sign-up link was also present. Client wanted the dates to show to families even before a link exists (announce the window early, add the link later). Changed both pages so the date text shows whenever audition_display is filled and auditions are still open, independent of audition_url; the Auditions button still depends on the link. Files changed: src/pages/shows/index.astro, src/pages/shows/[slug].astro (config/schema unchanged). Tested all four combinations on real content: dates-only (text, no button), dates+link (text + button), closed (both hidden/greyed), nothing (nothing). Clean 18-page build, screenshot confirmed.

Build hardening — runtime_minutes can no longer break the whole site (2026-06-03)
Goal: A single bad value in a show's "Runtime (minutes)" field had taken the entire site build down (the 2026-06-02 deploy saga: text/blank in runtime_minutes on new shows → schema rejected it → nothing rebuilt → no new content went live). Make that class of failure impossible, and add a friendly form guard.
Built (two layers):

B — tolerant schema (the important one). In src/content.config.ts, runtime_minutes changed from z.number().int().optional() to z.coerce.number().int().positive().optional().catch(undefined). Now a bad value (text, empty string from a cleared field, 0, a decimal) is quietly treated as "no runtime" for that ONE show — the runtime row just doesn't render — and every other page still builds and deploys. One typo can never again take the whole site offline.
A — CMS form guard. In public/admin/config.yml, the runtime_minutes field gained min: 1, max: 600, step: 1 and a pattern (^[0-9]*$) with a plain-language error ("Enter a whole number of minutes only…"). Decap shows this inline in the form before a bad value can be saved. Field was already a number widget; this tightens it.

Files changed: src/content.config.ts, public/admin/config.yml. No src/content/** touched.
Tested in sandbox (B, fully verified): injected runtime_minutes: "about an hour" into a real show file → clean build, 18 pages, affected page rendered with the runtime row correctly hidden. Repeated with runtime_minutes: "" → also clean. Restored real data → clean 18-page build. Phone (390px) + desktop (1280px) screenshots of a show page confirmed healthy.
Not verifiable in sandbox (A): the Decap form's inline pattern error only runs live in the /admin editor. Config validated as well-formed YAML; live behavior needs a quick client check (try saving letters in the field). Decap's pattern validation has a flaky history, so B is the real safety net and A is the polish on top.

Phase status overview
PhaseWhatStatus0Pipeline✅ Complete1Decap CMS login✅ Complete2Core pages (Shows, Programs, Donate, About, Casting)✅ Complete2.5Sponsorship feature✅ Complete2.6Stories on Stage section✅ Complete2.7Soapbox donate popup wiring✅ Complete2.8Editable page content (home + page furniture)✅ Complete2.9 + 2.10Employment page + Cast Pages nav removal + Board of Directors✅ Complete2.12Judy Robe Awards page + About staff/banner + Casting banner + Home redesign🟡 Built + handed over; confirm live2.7→fixDonate button — switched from laggy popup to hosted Soapbox link🟡 Built + handed over (v6); confirm live3.1MailChimp newsletter signup✅ Complete (verified live)3.2Rentals page (categories + inquiry form)✅ Complete (verified live)3.3Shop (Shopify embed)⬜ Blocked — no Shopify store yet3.4 + 3.5Cast Pages (password gate + embedded schedule + linked private cast list)✅ Complete (verified live)4EN/ES bilingual⬜ Not started5Rebrand test, docs, handoff⬜ Not started

Shows page — Audition + Tickets buttons — built + verified live 2026-06-02
Client request: on the /shows list page, replace the single "See details →" link on each show card with two action buttons — Auditions and Tickets — keeping a small "See details" link as well.
Behavior (client-approved decisions):

Tickets button: active pink button when ticketing_url is set; greys out to "Tickets coming soon" when blank. (Mirrors the detail page.)
Auditions button: HIDDEN entirely when audition_url is blank. When set: shows "Auditions" if upcoming; greys out to "Auditions closed" (unclickable) once audition_date has passed.
"See details →" link kept beneath the buttons, still linking to the show detail page.
The card is no longer one big wrapping link (can't nest links). The poster image and the "See details" link both go to the detail page; the two buttons are independent.

Important caveat (told to client): the audition auto-close happens at BUILD time, not live — the button flips to "closed" on the next site rebuild after the date passes, not at the stroke of midnight. Fine for audition dates.
Files changed (3):

src/content.config.ts — added audition_url (string, optional) and audition_date (date, optional) to the shows schema.
src/pages/shows/index.astro — rebuilt the card markup + added .show-actions / .btn-disabled styles.
public/admin/config.yml — added "Audition sign-up link" and "Audition date" fields to the Shows form.

NOT changed (Rule 2): no src/content/shows/*.md files. Existing shows render fine — Auditions button stays hidden until staff add a link via CMS. Reminder issued to client to hard-refresh/incognito the CMS to see the new fields.
Sandbox tests: Clean build (16 pages). Verified all states via two throwaway test show files (active audition + tickets; closed audition + no tickets) screenshotted at 1280px and 390px, then deleted. Real states confirmed: SIX & Frog show Tickets only (no audition link); Wind shows "Tickets coming soon"; test shows showed active Auditions, "Auditions closed", and the greyed ticket state. Could not verify: that real audition sign-up URLs work (needs live click-test once entered). Confirmed live by client 2026-06-02.
Process note: Briefly edited real show .md files to test states and hit a YAML error (duplicate ticketing_url); restored from backup immediately and switched to throwaway test files instead. Reinforces Rule 2 — don't touch src/content/.

Placeholder branding refresh — built + verified live 2026-06-02
Client-requested interim branding while awaiting PYT's official design. All placeholder, all centralized, trivially swappable when the real brand arrives.
1. Logo (header + footer). Replaced the placeholder "P"-in-a-pink-box mark with the client's PYT wordmark image (three serif letters: P pink, Y green, T blue). The supplied file had a solid black background; processed it to transparent + tight-cropped, saved as public/uploads/pyt-logo.png (945×324). Used in BOTH Logo.astro (header — image beside the "Peninsula Youth Theatre" wordmark; mark-only on phones) and Footer.astro (footer — image stacked above the name). NOTE: the footer had its OWN separate footer-mark "P" — it does not use the shared Logo component, so it needed updating separately. Watch for this if the logo changes again.
2. Accent color. Changed --accent from the old pink #e85a8c to the logo's pink #c0287b (deeper magenta), with --accent-deep #97215f and --accent-soft #fbeaf3. One-file edit in tokens.css; re-skins the whole site (buttons, links, etc.). Client chose the "safe" single-accent approach — did NOT spread green/blue across the site; the logo itself carries the three colors.
3. Fonts → Nunito (both heading & body). Swapped Inter (body) + Newsreader (serif headings) for Nunito everywhere. Client's explicit decision: one font for everything, relying on size + capitalization to distinguish headings (no serif/sans contrast). Nunito is free via Google Fonts under SIL Open Font License (verified) — fine even for the eventual real launch if they stick with it. Two-file change: the @import line in global.css now loads Nunito (weights 400/500/600/700 + italics, matching what the site uses); tokens.css points both --font-heading and --font-body at Nunito.
Files affected:

New: public/uploads/pyt-logo.png
Updated: src/components/Logo.astro, src/components/Footer.astro, src/styles/tokens.css, src/styles/global.css

Shipped as: PYT-upload-jun02-v7-branding.zip (logo + color — confirmed live), then logo+fonts followed. Footer fix + Nunito ultimately uploaded as three loose files (Footer.astro, global.css, tokens.css) because the client's Mac would not unzip the v9 archive — loose-file upload via GitHub's folder-specific upload pages worked. (Lesson: loose-file upload to /upload/main/<folder> is a viable fallback when unzip fails on the client side.)
Sandbox tests: Clean build (16 pages) at each step. Header + footer logo verified via Playwright screenshots at 1280px and 390px. Could NOT verify Nunito's actual rendering in-sandbox — the sandbox network blocks Google Fonts, so screenshots showed a fallback sans, not Nunito. Layout integrity with the change was confirmed; the font's true appearance was confirmed LIVE BY CLIENT 2026-06-02.
Open follow-up (minor): Headings use weight 500 with tight negative letter-spacing, originally tuned for the Newsreader serif. With Nunito they may read a touch light at large sizes. Client reviewed live and is happy; if a future session is asked to make headings bolder, bump the h1,h2,h3,h4 rule in global.css from font-weight: 500 to 600.

Phase 2.12 — Judy Robe Awards page + About/Casting changes — built 2026-05-29
A batch of client-requested content changes:
1. Judy Robe & Spirits Awards page (new). /judy-robe-spirits-awards, NOT in the main nav. Linked from both the About page (in the story column) and the Casting page (under the CTA). Has editable intro/description (placeholder copy for now), one optional photo (banner-style, hidden when empty), and a winners list (year + name) that scales cleanly to 30+ entries.

New: src/pages/judy-robe-spirits-awards.astro, src/content/settings/judy-robe-spirits-awards.json

2. Staff section on About page. Mirrors the Board of Directors pattern (name, PYT title, optional extra detail, optional headshot with initials fallback). Sits ABOVE the Board section. Auto-hides if empty. (Note: per client, this lives on About, NOT Employment.)
3. About page banner image. New optional banner_image field — a short wide banner under the title. Hidden when empty.
4. Casting page photo resized. Changed from a full-width 16:7 hero that dominated the top to a contained, short banner strip (shown only when a photo exists). Title now leads the page.
5. Home page redesign. Added an optional hero_image field — a wide photo banner under the intro text (hidden when empty). The auto-selecting "Now Playing" show feature was first relocated below the hero, but the wide-stretched treatment looked poor; per client decision (2026-05-29) the Now Playing feature was removed from the home page entirely. Home page now flows: hero (intro + optional photo banner) → Join us cards → Impact → Donation teaser. The show-selection logic and poster styles were removed from index.astro. (now_playing_label CMS field is now unused but left in config harmlessly.)
Files affected:

New: src/pages/judy-robe-spirits-awards.astro, src/content/settings/judy-robe-spirits-awards.json
Updated: src/pages/about.astro, src/pages/casting.astro, src/pages/index.astro, public/admin/config.yml

NOT included in upload (Rule 2 — CMS-managed, live is source of truth): about-page.json, casting-page.json, home-page.json. The page templates handle the new fields being absent, so they render fine against the live JSON; staff add banner/staff/hero photo via CMS when ready.
Sandbox tests: Clean build (14 pages). Verified: both Judy Robe links present; Judy Robe page renders with 3 placeholder winners and handles a 30-entry list; About staff section and banner render when populated and hide when empty; Board still renders; old full-width Casting hero removed; new contained banner shows only when a photo exists. Screenshots at 390px and 1280px checked.
Still pending (NOT built — need info from client):

Sponsorship tiers → direct Soapbox popups (#5): needs per-tier Soapbox data-ids / donation URLs. Same Soapbox-info dependency as the Donate button fix.
Matching-gifts search embed on Donate (#6): needs the third-party embed code (likely Double the Donation / 360MatchPro).


Phase 3.4 + 3.5 — Cast Pages — built 2026-05-29
Goal: Password-protected cast pages, one per show, not in the nav, linked from newsletters. Each holds an embedded rehearsal schedule and a link to a private cast list, plus typed notes.
Built:

New: src/pages/cast/[slug].astro — dynamic page template with a soft client-side password gate.
New: castPages content collection (src/content.config.ts) and CMS "Cast Pages" folder collection.
New: sample entry src/content/cast-pages/sample-delete-me.md (password "demo", clearly marked for deletion).

How it works:

Each cast page = one CMS entry (one reusable template, many pages). Fields: show title, password (per page), optional intro, cast-list LINK, rehearsal-schedule EMBED, optional notes.
URLs are /cast/<slug> — staff set an unguessable slug. Not in nav.
Soft client-side password gate: content hidden until correct password typed; unlock remembered for the browser session. Explicitly NOT real security — acceptable only for non-sensitive (role-only) content.

Key privacy decision (see DECISIONS.md): The rehearsal schedule is embedded but must be role-names-only. The named cast list is NOT embedded — it's a private Google Sheet the page only links to, so Google enforces login-based access. This split was made after the sample sheet was found to contain 100+ children's full names + locations + times, which a soft gate cannot protect.
Sandbox tests: Clean build (15 pages incl. /cast/sample-delete-me). Gate verified interactively: content hidden on load, wrong password rejected with error, correct password reveals content and hides gate, unlock persists for the session. Sheet-URL conversion verified across edit/gid/pubhtml/preview/empty formats. Cast list renders as a link button (not embedded); schedule renders as a single iframe. Screenshots of locked + unlocked states at 1280px checked.
Cannot verify in sandbox: Whether the live Google Sheet embed actually displays its contents — that depends on the sheet's Google sharing setting and must be tested live. The sandbox is network-restricted so the embed area renders blank here.

Phase 3.2 — Rentals page — built 2026-05-29
Goal: A /rentals page with an intro, a grid of rental categories (each with a photo, editable/expandable via CMS), and an inquiry form that emails PYT.
Built:

New: src/pages/rentals.astro — hero intro, category grid (auto-hides if empty), and inquiry form.
New: src/content/settings/rentals-page.json — starter content with 4 placeholder categories (Costumes, Props, Set Pieces, Furniture).
New: 4 on-brand SVG placeholder images in public/uploads/ (rental-placeholder-*.svg).
Updated: public/admin/config.yml — "Rentals Page" CMS form, including an editable/reorderable categories list with photo upload per category, and a field for the Formspree endpoint.

Key decisions:

Inquiry form delivery: Formspree free tier (endpoint xnjrrdkb), chosen because Cloudflare-native email needs the pytnet.org domain verified, which isn't done until Phase 5. Formspree free tier allows exactly 2 recipient emails — matches info@pytnet.org + lhatten@pytnet.org. Can switch to Cloudflare-native in Phase 5 if desired.
Form fields: name, email, organization (optional), what they're looking for, preferred dates. Honeypot anti-spam included.
Photo treatment for uneven future photo quality: fixed 4:3 frame + object-fit cover + gradient overlay + soft shadow + lazy load, so mismatched/low-quality photos still look tidy.
Categories list is staff-expandable; section auto-hides when empty.
Form has a mailto fallback if the Formspree endpoint field is ever blank, so the page never shows a dead form.

Sandbox tests: Clean build (13 pages). Verified in built output: Formspree endpoint wired, all 4 categories render, all placeholders present, all form fields present. Empty-categories case tested — section hides cleanly (0 cards), form remains. Screenshots at 390px and 1280px both look right.
Cannot verify in sandbox: Whether form submissions actually reach both inboxes — requires the live site and a real test submission. Recommend testing after deployment.

Phase 3.1 — MailChimp newsletter signup ✅ Complete (verified live 2026-05-29)
Verified by client via a live test submission — MailChimp returned its "profile updated" confirmation, so the form is working end to end.
Goal: Add a /subscribe page with PYT's MailChimp form embedded natively (styled with site tokens, not MailChimp's purple branding). Add a "Newsletter signup" pointer link in the footer's Community column.
Built:

New: src/pages/subscribe.astro — dedicated signup page with Email (required), First Name, Last Name, and all 7 interest checkboxes. Phone number intentionally omitted (client decision). MailChimp mc-validate.js and slim jQuery loaded only on this page.
Updated: src/components/Footer.astro — "Newsletter signup" link added to Community column, pointing to /subscribe.

Key decisions:

Phone field omitted per client decision.
All 7 interest checkboxes included (the 7th, "Bringing PYT to Your School," was new in the embed code; client approved keeping all 7 as-is).
Form action URL, field names, interest group IDs, and honeypot input preserved verbatim — these cannot be changed without breaking MailChimp list sync.
jQuery loaded only on /subscribe (not site-wide); required by MailChimp's mc-validate.js.

Sandbox tests: Clean build (12 pages). /subscribe confirmed in build output. All form fields, 7 checkboxes, honeypot, and correct form action URL verified in built HTML. Footer "Newsletter signup" link confirmed present on all pages.
Cannot verify in sandbox: Actual MailChimp submission receipt — requires live site and real email. Recommend a test submission after deployment.

Phase 2.10 — Employment page (also carried Phase 2.9) ✅ Complete (2026-05-28)
Goal: Add an Employment page with paid roles and volunteer opportunities. Also carries Phase 2.9 changes: remove Cast Pages from nav, add Board of Directors to About.
Built:

New /employment page with two sections (paid roles and volunteer opportunities), each with auto-hide if empty.
Cast Pages removed from main nav (header) and footer Community column.
Board of Directors section added to About page (renders from a board_members list field in About Page settings; section hides if list is empty).
CMS forms for Employment Page settings and Board fields.

Files affected:

New: src/pages/employment.astro, src/content/settings/employment-page.json
Updated: src/pages/about.astro, src/components/Header.astro, src/components/Footer.astro, public/admin/config.yml, BUILD_LOG.md

Sandbox tests: Clean build (12 pages). Employment page renders at 390px and 1280px. Auto-hide verified. Cast Pages confirmed absent from nav. Board section rendering verified with seeded examples (reverted before packaging).
Verified live by client 2026-05-29: Employment page renders correctly, Cast Pages absent from nav, Board fields visible in CMS.

Phase 2.8 — Editable page content ✅ Complete (2026-05-28)
Goal: Make all words/images/links/numbers editable through the CMS. Layout stays in code.
Built:

Settings files: home-page.json, shows-page.json, programs-page.json, footer.json.
Home page rewired to read from home-page.json. Hero supports an editable italic accent word. "Now Playing" poster auto-selects the next upcoming show.
Shows page and Programs page heroes wired to their settings files.
Footer tagline and copyright text wired to footer.json.
CMS forms added to Site Settings for: Home Page, Shows Page (intro), Classes & Camps Page (intro), Footer.
"For staff:" helper tips removed from Shows and Programs public pages.

Key decision: Content-only editability. Staff edit words, images, links, numbers — not layout. (See DECISIONS.md.)

Phase 2.7 — Soapbox donate popup wiring ✅ Complete (2026-05-27)
Goal: Wire the live Donate Now button on /donate to PYT's NonprofitSoapbox donation modal.
Built:

Soapbox loader script added to BaseLayout.astro (loads on every page after window.load).
Donate Now button on /donate uses href="?sbxdonationsmodal=sbx1" to trigger the popup.
Subdomain confirmed: pyt.secure.nonprofitsoapbox.com.

Decision logged: Only /donate's button triggers the popup. Header and home page Donate buttons link to /donate so donors see context first.
Known issue (as of 2026-05-28): Donate button on /donate requires multiple clicks before the popup opens. Likely the Soapbox loader race condition; diagnosis in progress. See IN_FLIGHT.md.

Phase 2.6 — Stories on Stage ✅ Complete (2026-05-27)
Goal: Promote Stories on Stage from one program-among-many to its own season-style presentation.
Built:

New storiesOnStage content collection (Astro side + Decap side).
New /stories-on-stage page: top audition strip, hero, lineup grid (2 seeded productions, expandable), auditions section, explainer.
Removed Stories on Stage from Classes & Camps (deleted src/content/programs/stories-on-stage.md; removed from program_type enum).
Stories on Stage added to nav between Shows and Classes & Camps.

Key decisions: Stories on Stage productions don't have detail pages (whole season lives at one URL). Two CTAs per production (Buy Tickets + School Bookings, each independently optional). No cast pages for SoS productions. Auditions section uses Google Form for calendar conflicts.

Phase 2.5 — Sponsorship feature ✅ Complete (2026-05-27)
Goal: Add sponsorship-as-a-product with two ladders, distinct from donations.
Built:

New /sponsor page with two tier groups: show-level (4 tiers) and season-level (3 tiers).
Show-aware flow: clicking "Sponsor This Show" on a show detail page passes ?show=<slug>, banner displays "Sponsoring: [Show Title]", show-tier inquire buttons get the show name in their mailto subject.
Two sponsor CTAs on Shows list page, one on each show detail page, one pointer section on Donate page.
All tier copy and donation URLs editable via CMS.

Key decisions: Sponsorship is visually and conceptually distinct from donations. Per-tier donation_url field (blank = mailto fallback). All seven tier names and amounts approved as-proposed by client.

Phase 2 — Core pages ✅ Complete (2026-05-27)
Goal: Turn Shows, Programs, Donate, About, Casting into real CMS-editable pages with starter content.
Built (broad strokes):

CMS collections: Shows (folder), Programs (folder), Site Settings (file collection with multiple records).
Pages: /shows/index, /shows/[slug], /programs, /donate, /about, /casting.
Reusable component: PageHero.astro.
Programs page has client-side filtering by type and season.
Donor tiers, donate-page copy, about-page, casting-page seeded.

Staff workflow verified by client: Added a fake show via CMS, confirmed it appeared on live site, deleted it. Edited About page, confirmed change went live.

Phase 1 — Decap CMS login ✅ Complete (2026-05-27)
Goal: Stand up the form-based CMS so PYT staff can edit content without code.
Built:

public/admin/index.html — Decap CMS admin page (Decap 3.10.1). Script MUST be in <body> (not <head>).
public/admin/config.yml — GitHub backend, OAuth via /api/auth, one starter collection.
functions/api/auth.js and functions/api/callback.js — Cloudflare Pages Functions for OAuth flow.
GitHub OAuth App "PYT CMS" created in PYTheatre org.
Cloudflare env vars GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET set (encrypted).
src/content/settings/donation-campaign.json — first CMS-editable file. Home page reads its values.

Gotchas resolved:

GitHub Ov23li... Client ID prefix used for both OAuth Apps and GitHub Apps in 2026 — verify by checking which tab the app lives in. (Past Claude wrongly diagnosed from the prefix.)
Decap script MUST be in <body> (not <head>). Wrong placement caused Cannot read properties of null (reading 'appendChild').
Decap postMessage handshake order: popup listens first, posts authorizing:github, waits for opener echo, then posts success payload using e.origin.
Cloudflare's transient "internal error" deploy failures — retry the deploy.


Phase 0 — Pipeline ✅ Complete
Goal: Set up the basic Astro + Cloudflare Pages deployment pipeline.
Built:

Initial Astro 6 project structure.
Design tokens in src/styles/tokens.css (CSS custom properties for colors, fonts, spacing).
src/components/Logo.astro — placeholder P mark.
src/components/Header.astro and src/components/Footer.astro — site chrome.
src/layouts/BaseLayout.astro — wraps every page.
src/pages/index.astro — first home page with hardcoded prototype content (later moved to CMS in Phase 2.8).
astro.config.mjs, .nvmrc (Node 22), .gitignore.
Cloudflare Pages project connected to GitHub repo, auto-deploy from main branch.

The design tokens system is a key architectural choice: every color, font, and spacing value comes from one CSS file, so rebranding is a one-file edit.
