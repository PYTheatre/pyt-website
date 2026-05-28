# PYT Website — Build Log

Newest entries at the top.

- **Repo:** https://github.com/PYTheatre/pyt-website
- **Live site (staging):** https://pyt-website.pages.dev
- **CMS:** https://pyt-website.pages.dev/admin
- **Stack:** Astro 6 (static) + Decap CMS 3.10.1 + Cloudflare Pages
- **Workflow:** Claude builds & tests in sandbox; client uploads to GitHub web UI OR edits via Decap CMS; Cloudflare auto-deploys.

---

## Phase status overview

| Phase | What | Status |
|---|---|---|
| 0 | Pipeline | ✅ Complete |
| 1 | Decap CMS login | ✅ Complete |
| 2 | Core pages (Shows, Programs, Donate, About, Casting) | ✅ Complete |
| 2.5 | Sponsorship feature | ✅ Complete |
| 2.6 | Stories on Stage section | ✅ Complete |
| 2.7 | Soapbox donate popup wiring | ✅ Complete |
| 2.8 | **Editable page content (home + page furniture)** | 🟡 **Built & sandbox-tested; awaiting client upload** |
| 3 | Cast pages + Sheets + Rentals + Shop + MailChimp | ⬜ Not started (3.1 MailChimp is next) |
| 4 | Full EN/ES | ⬜ Not started |
| 5 | Rebrand test, docs, handoff | ⬜ Not started |

---

## Deferred / awaiting client input

These are items the client has flagged for later, with enough decision-context to pick up without re-discussion:

- **Body font swap to JAF Cupidus** (https://justanotherfoundry.com/cupidus). Client wants Cupidus for body copy across the whole site. Decided 2026-05-27. **Holding for license acquisition.** Three licensing paths considered: Adobe Fonts (subscription), direct license from JAF/I Love Typography (perpetual self-host), Fontstand (monthly rental). Variant question (Cupidus vs Cupidus Text vs both) also open and pending client decision. When client has the font files (or Adobe Fonts CSS link), wiring it in is roughly a 15-minute job: update `src/styles/tokens.css` to change `--font-body` (and optionally `--font-heading`), add the font-loading mechanism to `src/layouts/BaseLayout.astro`, ship a small upload batch. The whole site reads body type from one token so the change is genuinely one-file once the font is available.

- **Casting page hero image** — placeholder still in place; client to upload via CMS when image is available.

- **Casting page text revision (optional)** — copy currently reads as universal audition info, but with Stories on Stage now having its own clearly-labeled audition section, client may want to clarify the Casting page is about Mainstage. Client to decide.

---

## Phase 2.8 — Editable page content (sandbox complete)

**Goal:** Client wants all copy, words, images, links, and numbers editable through the CMS on every page (structure/layout stays in code, can't be broken). The home page was almost entirely hardcoded; Shows/Programs had hardcoded hero text. This phase closes that gap.

### Decisions locked with client (2026-05-28)
- **Content-only editability**: all words/images/links/numbers editable; layout & structure stay in code.
- **"Now Playing" poster on home page is AUTOMATIC** — pulls the next upcoming show from the Shows collection (the show whose end_date hasn't passed; falls back to most recent if all are past). No manual field. Staff just keep the Shows list current. The poster is now also clickable through to the show detail page.
- **Page `<title>` and SEO meta tags stay in code** (not CMS-editable) — client's call.
- **"For staff:" helper tips removed** from public Shows/Programs pages entirely. NOTE: this removes the only in-page pointers telling staff where to edit content, so the Phase 5 handoff docs MUST include a clear "where do I edit X" map.

### Built (all sandbox-tested)
- `src/content/settings/home-page.json` — all home page copy: hero (eyebrow, heading, italic-word, lede, two buttons), discovery cards (×5, each with eyebrow/title/body/tags/link), impact stats (×3), section headings, donation teaser text.
- `src/content/settings/shows-page.json` — Shows page hero (eyebrow, title, lede).
- `src/content/settings/programs-page.json` — Programs page hero (eyebrow, title, lede).
- `src/content/settings/footer.json` — footer tagline + copyright extra text.
- `src/pages/index.astro` — rewired to read all content from home-page.json; "Now Playing" poster auto-selects next upcoming show; hero heading supports an editable italic accent word (splits the heading around the chosen word).
- `src/pages/shows/index.astro` — hero reads from shows-page.json; staff tip removed.
- `src/pages/programs.astro` — hero reads from programs-page.json; staff tip removed.
- `src/components/Footer.astro` — tagline + copyright read from footer.json. (Footer nav columns left in code — they're structure, and get wired correctly as Phase 3 adds pages.)
- `public/admin/config.yml` — added Site Settings records: Home Page, Shows Page (intro), Classes & Camps Page (intro), Footer. Home Page record uses nested list widgets for discovery cards (with a nested tags list) and impact stats.

### Sandbox tests passed
- ✅ Clean build, 11 pages, zero errors.
- ✅ Home page renders identically to before (layout preserved) but all content now from CMS.
- ✅ "Now Playing" auto-selection verified: with Dragons Love Tacos closed (ended 2026-05-16) and today being later, the poster correctly features Hello, Dolly! (next upcoming). Will recompute against real current date on live site.
- ✅ Hero italic-accent-word split verified: renders `Outstanding youth <span class="accent-italic">theatre</span>.` exactly as the original hardcoded design.
- ✅ Staff tips confirmed gone from both Shows and Programs (0 matches in built HTML).
- ✅ Footer tagline + copyright render from CMS.

### What staff can now edit via CMS (Site Settings)
Home Page, Shows Page (intro), Classes & Camps Page (intro), Footer — in addition to all the previously-editable records (About, Donate, Donor Tiers, Sponsorship, Casting, Stories on Stage Page, Donation Campaign).

---



**Goal:** Wire the live Donate Now button on /donate to PYT's NonprofitSoapbox donation modal.

### Decisions locked with client (2026-05-27)
- Use Soapbox's **popup widget** (not iframe embed). Subdomain: `pyt.secure.nonprofitsoapbox.com`.
- Trigger pattern: any link with `?sbxdonationsmodal=sbx1` opens the popup.
- **Only wire the Donate page's button** (not the header Donate or home page Make a Gift). Reason: a donor who passes through /donate sees the campaign progress, donor tiers, and matching-gifts info before donating, which leads to better-informed and often larger gifts. Header & home buttons stay as entry points to /donate.
- The `soapbox_embed_url` CMS field stays in place. If PYT ever obtains an inline iframe embed from Soapbox, that's pasted in the field and the Donate page swaps to inline mode automatically (Path B).
- Soapbox loader script hardcoded in BaseLayout.astro (not CMS-editable), since a typo there would break every page.

### Built (sandbox-tested as far as possible)
- `src/layouts/BaseLayout.astro` — added the Soapbox loader script, loads on every page after window 'load' event fires. Subdomain hardcoded: pyt.secure.nonprofitsoapbox.com.
- `src/pages/donate.astro` — replaced the "Donation form coming soon" placeholder with a proper Donate Now block: blurb + primary "Donate Now" button (href=`?sbxdonationsmodal=sbx1`) + secure-payment meta line.

### What I could verify in sandbox
- ✅ Clean build, no errors.
- ✅ Soapbox loader script is present on every page (verified by grepping built HTML).
- ✅ Donate Now button rendered with correct href and styling.
- ✅ Donate page layout is unchanged in everything else (progress bar, matching note, donor tiers, sponsorship pointer all intact).

### What only the live deployment can verify
- Whether the Soapbox script actually loads from their server.
- Whether the popup opens when clicked.
- Whether Soapbox's account configuration on their side correctly shows PYT's campaign.

This is the one feature where the only real test is "click it on the live site and see."

---

## Phase 2.6 — Stories on Stage ✅ COMPLETE (2026-05-27)

(Verified live by client. /stories-on-stage works, nav updated, Programs page now shows 6 not 7. CMS has new "Stories on Stage Productions" collection plus "Stories on Stage Page" settings entry.)

### Pending follow-ups (from earlier phases — flagging again)
- **Casting page hero image** still placeholder. When client provides the image, upload via CMS → Site Settings → Casting Page → Hero image.
- **Casting page text** mentions Mainstage casting only. With Stories on Stage now having its own clearly-labeled audition section, client may want to revise Casting page copy to clarify it's about Mainstage. Client to decide.

---

---

## Phase 2.5 — Sponsorship feature ✅ COMPLETE (2026-05-27)

(Verified live by client. /sponsor page works, show-aware flow works, all CTAs across Shows/show-detail/Donate work.)

## Phase 2 — Core pages ✅ COMPLETE (2026-05-27)

(Six new editable pages live. Staff workflow verified via add-a-show and edit-About tests.)

## Phase 1 — Decap CMS login ✅ COMPLETE

## Phase 0 — Pipeline ✅ COMPLETE

(See git history for earlier-phase details.)
