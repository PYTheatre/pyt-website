# MASTER HANDOVER — 2026-10-16

**Read this file first.** It is the single entry point for the PYT website
project and supersedes every earlier handover as the place to START. It
does not repeat their detail; it tells you which of them to read for what,
records the full state of the live site as of today, and sets the rules.

**The repo beats any document if the two disagree.** Verify, don't trust.

---

## 1. The project in one paragraph

Peninsula Youth Theatre's website, `https://pytnet.org`, is a static site:
Astro builds it, Decap CMS (at `/admin`, GitHub login) edits it, GitHub
(`PYTheatre/pyt-website`, public) stores it, Cloudflare Pages builds and
serves it (project `pyt-website`, also at `pyt-website.pages.dev`). Every
CMS save or GitHub commit to `main` rebuilds and publishes in ~2 minutes.
The site **went live on 2026-09-24**, replacing a WordPress site on
HostGator. It has been live and stable for three weeks; the PM (the person
you're talking to) edits content daily and pastes code changes you give
them via GitHub's web editor.

## 2. Verified state of `main` today (2026-10-16)

Fresh clone, `npm ci && npm run build`: **39 pages, zero errors.**
Last commit `9e9bdc8` (2026-10-15). Since launch every commit except five
has been a CMS content edit by the PM. The five code commits:
- `c071e90` 09-24 BaseLayout: external links open in a new tab (script at
  the bottom of the layout; `noopener`; mailto/tel/internal untouched).
- `2ef8895` + `2f65726` 09-24: the image-weight batch — 28 uploads
  re-encoded with the same filenames (57 MB → 7 MB; home page 22 → 3 MB),
  plus a size hint on all 17 CMS image fields.
- `148c1f8`/`bca5f78`/`d72d296`/`e7aa348`/`12af7ee` 09-29 (a different
  chat, not documented elsewhere — **this is the record**): thermometer
  graphic on Home and Support PYT recoloured to the logo's own shades
  (comment "SAME COLOURS, LOGO SHADES"); home "Donation teaser —
  paragraph" is now a Markdown (rich text) field; Support PYT "Intro
  heading" is optional (blank = hidden, sr-only fallback).

Launch-day state and the launch itself: `HANDOVER-2026-09-23.md` §0
(domain, DNS, OAuth, favicon, smoke test — all done and passed).

## 3. Which document covers what

Read in this order, only as far as the task needs:

| Period / topic | Read |
|---|---|
| **Everything from 2026-09-23 to launch** (the big pre-launch batch: hover-pink buttons, phone nav, home spacing, Stories on Stage show pages, Contact page, Starring Volunteers, newsletter form, contact-box style, SEO/sitemap/OG, switch, favicon, traps found) | `HANDOVER-2026-09-23.md` — authoritative, verified |
| The launch procedure, DNS layout, rollback, Mailchimp warning | `LAUNCH-PLAN-2026-09-24.md` (now historical; Appendix A describes the DNS as it is) |
| **2026-09-22** (thermometer, nav/logo saga, h1 rule, registration status, contact box unification) | `HANDOVER-2026-09-22.md` (morning: cast page + old-site redirects) and the file literally named `HANDOVER — 2026-09-22` (evening, em dash, no `.md`) — **both still accurate for their content; the evening one's §2 "domain is live" claim was WRONG at the time and is now true for a different reason** |
| August (cast pages, Formspree routing, nav-menu CMS, Spanish, hero images) | `HANDOVER-2026-08-23.md` → `-08-21-EVENING` → `-08-21` → `-08-20` → `-08-19` |
| June (initial build, auditions feature, CMS design) | `HANDOVER-2026-06-16.md` back to `-06-03`, `AUDITION-FEATURE-STATUS-2026-06-09.md` |
| The team-facing explainer of the stack | `HANDOVER-TO-LIVE-TEAM.md` |
| `START_HERE.md`, `IN_FLIGHT.md`, `DECISIONS.md`, `KICKOFF-PROMPT-*` | historical only; superseded banners are correct |
| `BUILD_LOG.md`, `BUILD_LOG-ENTRIES-2026-09.md`, `BUILD_LOG` | unmerged staging logs; nothing after 09-22 is in them. Not maintained since — this file and `HANDOVER-2026-09-23.md` are the record. |

Nothing before 2026-09-23 was witnessed by the author of this file; for
that period go to the documents, not to this summary.

## 4. Architecture facts a new session needs

- **Content** = JSON/Markdown under `src/content/` (settings, shows,
  stories-on-stage, programs, pages, cast). Schema in `src/content.config.ts`.
  CMS form definitions in `public/admin/config.yml` (1358 lines; every
  field has a hint; hard-refresh `/admin` after any change to it).
- **Pages** in `src/pages/`; shared layout `src/layouts/BaseLayout.astro`
  (head: canonical, Open Graph, JSON-LD org data, favicons, external-link
  script). Components in `src/components/` — `Header.astro` (nav,
  `--nav-item-h: 34px`), `Logo.astro` (pixel-measured; read its comments
  before touching), `ContactForm.astro` (site-wide contact box; Formspree
  routes `general`/`education` set in CMS Site-wide), `NewsletterForm.astro`
  (MailChimp; checkbox↔group mapping in `GROUP_IDS`, wording in CMS).
- **Styles**: `src/styles/tokens.css` (colours, spacing, `--section-pad`),
  `src/styles/global.css` (buttons, shared `h1` clamp, hero-photo `:has()`
  rule). Home has its own `--home-pad` (96px/64px).
- **Cloudflare specifics**: `public/_redirects` (124 lines; 44 old-site
  addresses tested), `public/_headers` (noindex on `.pages.dev` and cast
  pages), `functions/api/{auth,callback}.js` (GitHub OAuth for the CMS;
  env vars in Pages settings; OAuth app "PYT CMS" owned by the PYTheatre
  org with redirect URIs for both pytnet.org and pages.dev).
- **DNS**: zone `pytnet.org` in PYT's Cloudflare account
  (`boardpresident@pytnet.org`; Mike G is Administrator); nameservers
  `cass`/`alfred.ns.cloudflare.com`; email = Google Workspace, untouched.
- **External services**: MVCPA (all ticket sales — PYT takes NO bookings
  itself, don't add booking contacts), Active (registration), Soapbox
  (donations), Formspree free (50 submissions/month across all forms;
  account being transferred to a team member), Mailchimp, Double the
  Donation widget (styled via `#dd-container`), Cloudflare Web Analytics
  (on), Google Search Console (DNS-verified; sitemap at `/sitemap.xml`).
- **Accounts/access**: CMS access = Write access on the GitHub repo
  (team members added at Settings → Access; `mcobb1600` added 09-28).

## 5. Working rules — follow without being asked (3 sessions, re-confirmed)

1. **Mock up every visual change first**, from the real built site with the
   real webfonts (fetch Archivo Black, Baloo 2, Source Sans 3 TTFs from the
   google/fonts GitHub mirror each session; `@font-face` URLs must be
   ABSOLUTE `http://localhost:PORT/...`), as PNGs labelled "MOCKUP ONLY —
   do not upload". Never the interactive widget tool.
2. **Attach every file and mockup** (SendUserFile). The PM cannot see inline
   images. If a card fails to open, re-send under plain names; small files
   can be described as line edits.
3. **Deliver code as downloadable files + GitHub edit links in the chat**,
   in paste order, each with path, line count and first line. New files via
   `github.com/PYTheatre/pyt-website/new/main?filename=<path>` and tell the
   PM to paste only in the editor (a paste into the filename box once
   created a 700-char filename). Binary files (images) go via
   `github.com/PYTheatre/pyt-website/upload/main/<dir>`.
4. **Never paste raw code in chat.** Flag a CMS hard-refresh on `config.yml`.
5. **Rebuild and measure before saying "fixed"**: edit → `npm run build` →
   restart `python3 -m http.server --directory dist` (it dies when dist is
   rebuilt; `curl` first) → Playwright screenshot + `getComputedStyle` /
   `getBoundingClientRect`. Wait ≥350ms after hover (0.18s transitions).
6. **Verify pastes**: pull `main`, diff against what you sent, build.
7. **Take corrections literally** and find the mechanism, not a new guess.
8. Write a `HANDOVER-<date>.md` at the end of every session.

## 6. Traps (full list in `HANDOVER-2026-09-23.md` §5 and `HANDOVER — 2026-09-22` §6)

- Astro doesn't scope inside `:has()` — wrap the whole selector in `:global()`.
- `img { max-width: 100% }` squashes small images in tight flex boxes.
- Shared rules: `h1` clamp, `.btn-outline` hover, `ContactForm` default
  style, `--home-pad` — one change moves many pages, by design.
- `Logo.astro` fractions are pixel-measured against the specific PNG.
- Archivo Black has one weight; "not bold" captions had to use the body font.
- CMS groups: "Newsletter Signup Form" and "Contact Page" are under About &
  Community; "Search & Sharing (SEO)" under Site-wide.
- The PM declined: body-copy size change, cropped nav logo, quarter-size home
  logo, magenta Donate, Stories on Stage eyebrow label. Don't re-propose.

## 7. Known open items

- `sponsorship-page.json` is an orphan (no CMS, no code); `favicon.svg` is
  unreferenced; a blog page file has emoji in its name (works, but awkward).
- `BUILD_LOG*` never merged.
- Formspree 50/month limit — check usage; account transfer in progress.
- HostGator hosting can be cancelled after ~24 Oct (keep the registrar!).
- 40+ unreferenced uploads remain (~50 MB) — deletable; PM has deleted some.

## 8. Verification recipe (run first, every session)

    git clone https://github.com/PYTheatre/pyt-website.git
    cd pyt-website && npm ci && npm run build     # expect 39 pages (±CMS pages), 0 errors
    git log --oneline -20                          # what changed since this file
    git ls-files | awk 'length>80'                 # junk filenames
