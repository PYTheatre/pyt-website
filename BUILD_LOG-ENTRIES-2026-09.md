Build log entries for 2026-09-16 → 2026-09-22 — to go at the TOP of BUILD_LOG.md
(directly under its 3-line header), newest first. Written 2026-09-22 from a
fresh clone at 8704c78; commit hashes verified on main.
NOTE: BUILD_LOG.md was last updated 2026-08-19. The 2026-08-20 → 08-23 work is
recorded in HANDOVER-2026-08-20/21/21-EVENING/23.md, not here.

Wizard of Oz cast page keeps its old-site address (2026-09-22)
Goal (PYT, via PM): the one existing cast page must stay at https://pytnet.org/wizard-of-oz-cast-page/ after launch, watertight and risk-free. New cast pages use /cast/<show>/.
Built: public/_redirects — two 200 rewrites (with and without final slash) → /cast/the-wizard-of-oz/; public/_headers — noindex, nofollow for both forms; HANDOVER-TO-LIVE-TEAM.md — new section + post-switch test 5; HANDOVER-2026-09-22.md §16.
Tested: build clean (36 pages); wrangler pages dev: old address 200 + noindex, HTML byte-identical to /cast/the-wizard-of-oz/, /employment 301 intact, ordinary pages unaffected.
NOT verifiable by me: the live Cloudflare deployment — PM to open pyt-website.pages.dev/wizard-of-oz-cast-page/ after pasting, and pytnet.org/wizard-of-oz-cast-page/ after the switch.
Rule: don't rename/delete the CMS cast page "the-wizard-of-oz" while this address is in use.

Old-site addresses forward to new pages (2026-09-22)
Goal (PM): the domain stays pytnet.org; make sure old page addresses (Google, emails, bookmarks) don't break at the switch.
Built: public/_redirects — 35 old addresses × 2 forms (70 lines) + 6 section catch-alls, 301 to the closest new page, from the live pytnet.org menu + site search. /boxoffice/the-wizard-of-oz-2 → musical; /boxoffice/the-wizard-of-oz (2025 SOS play) → /stories-on-stage/.
Tested: wrangler pages dev — 70/70 correct, catch-alls correct, all destinations 200, all 36 pages 200, /about/ unaffected.
Known: no 404 page, so unknown addresses show the home page; old /files/ image links not covered.

Site-wide spacing & alignment — ONE vertical rhythm, left-aligned reading columns (2026-09-21/22) — BUILT, NOT YET COMMITTED
Goal (PM): "even up the white space across the site, mobile too", then "look at all spacing and alignment" — examples: Creepy Carrots and other production pages, Photos, About (under the picture), School Play in a Box "Make an inquiry" box, Young Performers "YP opportunities" button.
Measured first (every page, real fonts, 390 + 1440px, pixel-row gap audit + left-edge alignment audit): largest gaps 50–241px desktop; last content → footer 96–256px; header → title 22–117px. Root causes: .section padded 96px each side (two sections = 192px); page heroes kept 40px below plus the next section's 96px; page-level margins stacking on section padding; footer's own 96px margin. Alignment: pages narrowed a .container with max-width 68ch — .container has margin-inline:auto, so the text column CENTRED while titles/photos/buttons stayed left.
Built (18 files): tokens.css — VERTICAL RHYTHM tokens --section-pad (2/3rem), --page-top (2.5/4rem), --hero-gap (1rem), documented; global.css — .section uses --section-pad (desktop rule removed), default .section-head margin-bottom, band-ending pages meet the footer via main:has(> :last-child:is(.board-section,.auditions-promo-section,.inquiry-section,.sponsor-section)) ~ .site-footer; PageHero / PageHeroImage / Footer — use the tokens; [...slug], casting — title blocks on the tokens, body padding overrides removed, reading width moved to children (> :global(*)), last-child margins zeroed, CTA/quote sections on --section-pad, Casting CTA left-aligned; school-play-in-a-box — padding-top:0 override removed, reading width on children, trailing margins removed; stories-on-stage — auditions + explainer columns left-aligned; stories-on-stage/[slug] — last booking card margin 0; shows/[slug] — show-detail on the tokens; cast/[slug] — sheet-section override removed; audition — stacked-column row gap = one section gap, padding override removed; photos — card left-aligned, grid top margin dropped only when first; subscribe — form card left-aligned; thank-you — reading width on children; judy-robe — last year block margin 0; shop — coming-soon extra padding removed (still centred on purpose).
Deliberately unchanged: home Donate button centred under the thermometer (PM request Aug 2026), home Values band, Shop "Coming soon", Volunteer empty state.
Tested: build clean; all pages at 390/1440 — largest gap desktop median 134→73px (max 241→121), phone median 103→57px (max 178→85); last content → footer 93–106px desktop / 61–88px phone (band pages meet the footer); alignment audit clean except the deliberate items; no sideways scroll at 320/390/768/1440; header unchanged. Before/after mockups rendered on the real site.
NOT verifiable by me: nothing beyond the PM's visual approval.
Next: PM pastes Part A (5 files, tokens.css first) then Part B (13 files). Files + order in HANDOVER-2026-09-22.md §4.

Page Hero Images — photo field optional (2026-09-21) [d0a2bfa]
Goal (PM): the CMS kept demanding a photo when removing hero images. Cause: the list's image field was required, so clearing a photo but keeping the row blocked saving. PageHeroImage already renders nothing for a photo-less row.
Built: public/admin/config.yml — image field required:false, hint rewritten.
Tested: built with the Stories on Stage / Studio rows' photos blanked → no hero, no gap, no error; About unaffected; content restored and diffed. PM then removed both rows in the CMS (8704c78 and before).

Center Stage Musicals — CMS intro paragraph (2026-09-21) [076e5cf, 86a29d2]
Built: musicals.astro passes page.intro to PageHero (blank = nothing rendered, no empty gap — verified); config.yml adds "Intro paragraph" (text, optional). PM wrote the paragraph.

Cast pages — cast list embedded like the schedule; /cast/* noindex (2026-09-21) [6bad35c, ad3324e, d006d43, 77e083b, 3bb68e2]
Goal (PM): embed the cast list the same way as the rehearsal schedule; widen the schedule frame (ran off the right edge); move Rehearsal resources to the top.
First build: resources moved first; both frames in a .sheet-wide wrapper (max 1600px, breaks out of the text column); cast list embedded PRIVATELY (children's names stay in Google) with an "Open in Google" fallback button and a guard refusing to embed a "Publish to web" link.
PM then pasted a published link and asked for it to display like the schedule. Flagged that publishing makes a roster of named children public (link sits in page source behind a soft password). **PYT agreed the cast list may be public.** Second build: guard removed; published → embed only; private → embed + button; blank → hidden. Documented in the file header and CMS hint. _headers: /cast/* X-Robots-Tag noindex, nofollow (path-scoped, survives the domain switch).
Found: both sheets come from the same published producer workbook (same publish key); the whole workbook (incl. Contact Info, Staff Contact List) had earlier been published as "Entire document" by mistake — PM told how to stop publishing and republish one tab. Publish scope now: unconfirmed.
Tested: all three link cases; widths 1440 → frame 1358px (was 1058), 1280 → 1198; no overflow. NOT verifiable by me: Google content (sandbox can't reach it); PM to run the curl check.

Transparent logo in header and footer (2026-09-21) [48209e6, b1d68ca + PNG upload]
Goal (PM): stop the logo sitting in a white box on the teal header. PM supplied a transparent PNG (1125×580, 393KB, binary alpha). Found a 4–10px pale rim baked into its edges (enlarged from a smaller original). Removed by un-mixing white from each edge pixel with a per-shape rim width, resized to 600px (124KB). Logo.astro nav size → /uploads/pyt-logo-transparent.png at 42/51px (letters measured to match the old 44/54px); hero size keeps pyt-logo-stars.png. Header override 44→42px.
Tested: right file on header (inner pages) and footer (all pages) at 390/1120/1440; header one row at 1120, width +2px; colours identical to the old file within 1–4 units.

Home carousel — one photo, full width, arrows kept (2026-09-21) [329efd2]
Goal (team via PM): central image fills the whole space, arrows either side, no glimpse of neighbours. Mocked 3:2 vs 16:9; PM took 3:2. Built: card flex 0 0 100%; 3:2 desktop, 4:3 phones (already full width there); arrows 46px inset 16px, z-index 3 (fixes a pre-existing bug: the left arrow was hidden under the photo on phones); edge fades removed; FADE_OPACITY "1".
Tested: 11 widths — photo exactly fills the strip, nothing peeks, both arrows on top, no overflow; clicks loop through all five both ways; partial swipes snap; resize keeps position. Flagged: two carousel photos were low-res screenshots (one with an old site's shop icon baked in) — PM has since replaced them.

Duotone colour scheme + duotone photos (2026-09-21) [b216cc4, dc9a858, 63788b7, 76a0ed4, a16763b, 9573e58, ea1a6ca, 92ed0a2, 1107757, e89cdf1, 5fdf6e3, a6a75d9]
Goal (PM, designer's suggestion): two colours only — pale blue-teal main, dark pink accents — so photos shine and the site is less childish. References: Behance "Duotone" book project, designmodo duotone article, then onepagelove Vahur Kubja and adisonpartners.com (both duotone PHOTOGRAPHY). Mocked the UI scheme first, then duotone photo treatments A (teal) / B (pink×teal) and "A with colour where it matters". PM chose that, with changes: Values phrases keep their colours; single-photo pages always full colour.
Built: tokens.css palette + "pink means press" rule + contrast rules; Header chips deep teal, Donate the only pink; Footer links deep pink on pale teal; promo banner pink/white; numbers band deep teal with pale tiles; thermometer teal; Ways to Support amounts teal; category tags three strengths of teal; About board placeholders deep teal; SVG duotone filter in BaseLayout with a 2+-photo counter setting data-duotone; global.css rules; carousel marks .is-featured. Headline As-typed switch shipped in the same index.astro.
Tested: every page — single-photo pages colour, multi-photo pages duotone, heroes colour, featured/hover colour; list trimmed to one poster flips to colour; contrast scan (14 pages, 2 widths, dropdown + mobile menu) clean after fixing three found bugs (pink stat tiles, tinted initials placeholders, pink placeholder squares); header geometry unchanged.

Home hero headline — Archivo Black; capitalization switch (2026-09-16, 09-21) [c4e3c99, e45ec39, then a16763b/9573e58]
Archivo Black is +28.3% wider than Baloo 2 for this headline; chose 3.4rem max (capitals within 2% of the old visual size; 3.6rem rejected — 2.1px headroom), 2.0rem min, weight 400 (single-weight face; 700 = faux bold), line-height 0.88 from measured cap heights. Later: "As typed / UPPERCASE" CMS switch; as-typed line-height 1.05 because lowercase descenders collide at 0.88 (measured: 95/100 em needed).

Promo banner ("news tape") (2026-09-16) [d27fd16, 1c6f1c6, 9c688fb + promo-banner.json]
Full-width bar under the hero, CMS tick + wording + link; hidden unless all three set; external links open in a new tab. Launched logo-green with near-black text (white on that green measured 2.65:1 and was rejected); pink/white since the duotone scheme.

Search engines — noindex on *.pages.dev (2026-09-16) [d676c68]
Host-scoped X-Robots-Tag in public/_headers rather than a robots.txt Disallow (which can't tell the preview host from the real domain and would block the live site at launch, silently). PM verified with curl (header present, doubled because two rules match — harmless). Sitemap parked until the domain switch (hand-written endpoint, not @astrojs/sitemap — lockfile paste risk).
