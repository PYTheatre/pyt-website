# PYT Website — Locked Decisions

**Last updated:** 2026-05-29

**New Claude session: read `START_HERE.md` first.** Every decision the client has explicitly made about how the site works. These are *locked* — do not re-propose alternatives unless the client explicitly raises one. When a new question comes up, check this list first to see whether it's already been settled.

---

## Stack and infrastructure

- **Static site generator:** Astro 6. Single-file pages live in `src/pages/`. Content collections (Shows, Programs, Stories on Stage productions) use Astro's content collections with Zod schemas defined in `src/content.config.ts`.
- **CMS:** Decap CMS 3.10.1 (formerly Netlify CMS). The admin loads at `/admin`. Config lives at `public/admin/config.yml`. Decap script is in `<body>` (not `<head>` — see `PROJECT_RULES.md` Rule 1).
- **Hosting:** Cloudflare Pages. Free tier. Automatic deploys on push to `main`. OAuth-Apps flow handled by two Cloudflare Pages Functions in `functions/api/`.
- **Domain:** Currently `pyt-website.pages.dev`. Real domain (`pytnet.org`) will be wired up in Phase 5.
- **GitHub org:** `PYTheatre`. Repo: `pyt-website`.

## Workflow

- **Chat-and-upload.** Claude writes files in sandbox. Client uploads via GitHub web UI. No git command line. No developer involvement.
- **Content edits go through the CMS**, not through chat-and-upload. The live site is the source of truth for content (see `PROJECT_RULES.md` Rule 2).

## Donations and payments

- **Donations platform:** NonprofitSoapbox (retained from PYT's existing setup because of Salesforce sync). Subdomain: `pyt.secure.nonprofitsoapbox.com`.
- **Donate approach (CHANGED 2026-05-29):** The Donate button now **links to PYT's hosted Soapbox donation page** (`https://pyt.secure.nonprofitsoapbox.com/donate`), opening in a new tab. It is NOT an on-page popup and NOT an inline embed. This replaced the earlier popup approach (`?sbxdonationsmodal=sbx1` + a loader script in `BaseLayout.astro`), which caused a 4–5 second lag and a full page reload, and depended on a Soapbox `data-id` that proved unreliable to obtain. The hosted-link approach mirrors how the MailChimp newsletter signup works and is far more robust. The Soapbox loader `<script>` was removed from `BaseLayout.astro`.
- **CMS field:** `soapbox_donate_url` on the Donate Page record holds the hosted link (defaults to the standard hosted URL if blank). This replaced the old `soapbox_embed_url` field.
- **Only the Donate page's button** points to Soapbox. The header "Donate" button and the home page "Make a Gift" button link to `/donate` instead. Reason: passing through `/donate` first shows the donor the campaign progress, donor tiers, and matching-gifts info, which leads to better-informed and often larger gifts.

## Sponsorship

- **Sponsorship is distinct from individual giving.** Two separate paths. Sponsorship page is `/sponsor`; individual giving is `/donate`. Visual styles separate them.
- **Two sponsorship ladders:** Show-level (4 tiers: Show Producer $10K / Sponsor $5K / Friend $2,500 / Supporter $1,000) and Season-level (3 tiers: Season Producer $25K / Sponsor $15K / Friend $7,500).
- **Show-aware sponsor flow:** Clicking "Sponsor This Show" on a show detail page lands on `/sponsor?show=<slug>`, displays "You're sponsoring: [Show Title]" as a banner, and updates the show-tier "Inquire about this level" buttons' mailto subjects to include the show name. Season-tier buttons are correctly not modified.
- **Per-tier donation URL:** Each tier has an optional `donation_url` CMS field. When blank (current state), the tier shows an "Inquire about this level" mailto button. When filled (when Soapbox tier-specific URLs exist), the tier shows a "Give at this level" primary button.

## Registration and class enrollment

- **Class/camp registration:** External links to Active.com (per existing PYT setup). Each Program has a `registration_url` field.

## Merch and shop

- **Shop platform:** Shopify Basic with Collections. Deferred to Phase 3.3. Will be a Shopify-embedded experience.

## Cast pages (changed from original plan)

- **Cloudflare Access rejected** (50-user free-tier cap, PYT has 150+).
- **Approach: Option A — soft client-side password gate.** The client accepted that this is bypassable by anyone who views page source. Cast page content is not legally sensitive.
- **No nav link.** Cast Pages were removed from the main menu in Phase 2.9. They will exist at unguessable URLs, linked only from newsletters. This is a redefinition from the original plan.
- **Phase 3.4 is still on the roadmap** but is smaller in scope than originally planned. No "Cast Pages index page" or nav entry.

## Cast lists and schedules

- **Rehearsal schedule: EMBEDDED Google Sheet** inside the cast page. Must be ROLE-NAMES-ONLY (no child's name anywhere, including notes column), because an embedded sheet is delivered into a page behind only a soft gate.
- **Cast list (full names → roles): NOT embedded.** It's a roster of identifiable minors, so it stays PRIVATE in Google (shared only with specific cast-family accounts / a cast Google Group) and the cast page only LINKS to it ("View the cast list" button, opens in a new tab). Google enforces real login-based access.
- **Decision changed 2026-05-29:** Originally both sheets were to be embedded. When the sample rehearsal/cast sheet turned out to contain 100+ children's full legal names mapped to roles, dates, and venues, embedding the cast list behind a soft client-side gate was judged inappropriate (the gate doesn't actually protect content delivered to the browser). Split into embed-schedule / link-private-castlist. The soft gate remains acceptable for the role-only schedule.
- Phase 3.5 (sheets) is now folded into 3.4.

## Email and newsletter

- **MailChimp** for newsletter. Phase 3.1.
- **Form location:** Dedicated `/subscribe` page (not in footer — the existing PYT signup form has 8+ fields including 6 interest checkboxes and is too big for a footer). Small "Newsletter signup" pointer link in the footer pointing to `/subscribe`.
- **Existing form fields kept:** First Name, Last Name, Email, plus six interest checkboxes (Auditions, Camps & Classes, Upcoming Public Performances, Field Trip Opportunities, Alumni News, Giving to PYT).

## Languages

- **Bilingual (EN + ES) via Astro's native i18n.** Phase 4. Pages built in Phases 0–3 are structured for clean future bilingualization.

## Branding and design

- **Design tokens** centralized in `src/styles/tokens.css`. Colors and font choices all read from CSS custom properties so a rebrand is a one-file edit.
- **Current placeholders:** Pink accent (`#e85a8c`), Newsreader (serif headings) + Inter (sans body). Will be replaced in Phase 5 with PYT's final brand identity.
- **Logo:** Placeholder `P` mark in `src/components/Logo.astro`. One-file swap when real logo arrives.
- **Body font swap to JAF Cupidus** approved by client but deferred — see `IN_FLIGHT.md`.

## Content editability (Phase 2.8 decisions)

- **Content-only editability:** Words, images, links, and numbers are editable through the CMS. Layout and structure stay in code and cannot be changed by staff. Decided 2026-05-28.
- **Page `<title>` and SEO meta tags stay in code** (not CMS-editable). Client's call. Can be added to CMS later if desired.
- **"For staff:" helper tips** previously visible on public Shows and Programs pages have been removed entirely. Implication: Phase 5 documentation must include a clear "where do I edit X in the CMS" map for staff.
- **Footer nav columns stay in code** (they're structure, not copy). Only footer tagline and copyright text are CMS-editable. When new pages are added in future phases, the footer columns are updated in code along with whatever else changes.

## Home page

- **"Now Playing" feature REMOVED (2026-05-29).** The home page originally had an auto-selecting "Now Playing" poster pulling the next upcoming show from the Shows collection. In the 2026-05-29 redesign it was first relocated to its own section below the hero, but the wide-stretched treatment looked poor, and the client chose to **remove it from the home page entirely.** The show-selection logic and poster styles were removed from `index.astro`. (Shows still have their own pages at `/shows` and `/shows/<slug>`; this only affects the home page.)
- **Home page now flows:** hero (intro text + optional wide photo banner) → "Join us" discovery cards → Impact stats → Donation teaser.
- **Optional hero banner photo (added 2026-05-29).** The home page hero has an optional `hero_image` CMS field — a wide photo banner shown under the intro text, hidden when empty.
- **Hero headline supports an editable italic accent word.** The CMS has a field `hero_heading_italic_word`; if that word appears anywhere in the heading, it renders in italic. Allows the visual rhythm of "Outstanding youth *theatre*." to be preserved while the headline is fully editable.

## About page

- **Board of Directors section** lives on the About page (not its own page). Editable as a list inside the About Page settings record. Each member: name, PYT title, optional outside-PYT job title, optional headshot. Headshots fall back to colored initials placeholder when not yet uploaded.
- **Live About JSON does not yet have the Board fields.** The page renders gracefully when they're absent. Client will populate via CMS once Phase 2.10 is live.

## Stories on Stage

- **Stories on Stage is its own content type**, parallel to Mainstage Shows. Not a program. Productions go in a separate `storiesOnStage` content collection.
- **One landing page** at `/stories-on-stage`. No per-production detail pages. Each production card shows on the lineup with two CTAs (Buy Tickets and School Bookings, each independently optional).
- **Auditions section** lives on the same page (not on the Casting page). Has its own thin strip at the top of the page linking down to it. Calendar conflicts collected via external Google Form (URL CMS-editable).
- **One annual audition fills the company.** Cast members appear in 1–3 productions across the year. This shapes the page's framing.

## Casting page

- **Image-only page** (per client). One hero image at top. Text below. Closing line pulled out in larger italic type. CTA at bottom linking to `/shows`.
- **Client-supplied text used verbatim** including the comma in "PYT casts everyone who wants a role, in any Main Stage show." (The double space in "Compatibility  with" was silently corrected; the comma stays.)

## Employment page (Phase 2.10)

- **`/employment`** URL. In main nav after About.
- **Two parallel sections:** "Roles with PYT" (paid) and "Volunteer with PYT" (unpaid). Each supports 3–4 entries.
- **Auto-hide:** Either section disappears if its list is empty.
- **Compensation is optional per role.** Some roles may show salary; some may not.
- **Text-only listings.** No images on listings.
- **Section-specific intros** (above each section), plus a page-level intro at the top.

## Rentals (Phase 3.2)

- **Astro content collection** with photos stored in the repo's `public/uploads/` folder. (Cloudflare R2 deferred — no need at the current scale.)

## Sequence priorities

- **Phase 3 sub-sequence locked:** MailChimp → Rentals → Shop → Cast Pages → Sheets. Decided 2026-05-28.
- **Phase 2.5–2.10 inserted between Phases 2 and 3** to deepen the core feature set before adding the heavier Phase 3 work. This was incremental and approved at each step.

---

## What is *not* locked, and might come up later

These are decisions the client has *not* made — flagging them so a new Claude knows they're still open if relevant work touches them:

- The Cupidus license path (Adobe Fonts vs JAF direct vs Fontstand).
- Cupidus variants (Cupidus vs Cupidus Text vs both).
- Whether to add an editable-nav feature (Option 3 from the discussion when Employment was added).
- Whether the Casting page text should be revised post–Stories on Stage launch.
- Specific MailChimp form layout once we have the embed code.
- Cast page UX details for Phase 3.4 (now that the feature is smaller-scoped).
