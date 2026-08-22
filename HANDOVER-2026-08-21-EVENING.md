# HANDOVER — 2026-08-21 (EVENING)

**This supersedes HANDOVER-2026-08-21.md** (the earlier one from the same
day, and every one before it). Where they disagree, this wins. The older
ones remain accurate on repo structure and long-run history.

Session covered: the Support page redesign (three rounds), the contact
form work, and the thank-you redirect.

---

## 0. THE RULES THAT MATTER MOST

From the PM directly, and from mistakes actually made. Follow without
being asked.

1. **Mock up before building anything visual.** Generate a real PNG
   (Pillow) and present it. **Never** use the interactive widget tool —
   it does not render on the PM's machine. Applies to layout, colour,
   spacing and type changes.

2. **LABEL EVERY FILE as either a deliverable or an illustration.**
   *New this session.* A mockup PNG was presented alongside the code
   file and the PM asked "what do I do with the second file?". If a
   response contains both, say explicitly which goes in the repo and
   which is only a picture.

3. **Never paste raw code into the chat.** Hand off as *files*
   (`present_files`) plus GitHub links. The PM pastes by hand.

4. **Give a GitHub link for EVERY file, every time.** A specific link
   per file — not a folder, not "the usual place".
   - edit: `https://github.com/PYTheatre/pyt-website/edit/main/<path>`
   - create new: `https://github.com/PYTheatre/pyt-website/new/main/<folder>`
   - upload: `https://github.com/PYTheatre/pyt-website/upload/main/<folder>`
   - delete: link to the file's page, then trash icon → Commit

5. **NEW FILES FIRST, and number the steps.** If a batch has a new file
   others depend on, say so loudly and put it first. Also state when an
   ordering constraint is real vs cosmetic — the PM works in bursts and
   may stop halfway, so say plainly whether a pause mid-batch is safe.

6. **Awkward filenames: tell the PM to use "Create new file" and paste**,
   never download-and-upload. Applies to square brackets, no extension,
   or an unusual extension. In practice: **prefer paste-into-GitHub for
   ALL new files** — it costs nothing and removes the whole class of
   problem. (Downloading mangled `[...slug].astro`, `_redirects` and
   `.ts` files and broke four deploys in an earlier session.)

7. **CMS CACHE: whenever a batch changes `public/admin/config.yml`,
   remind the PM to hard-refresh (Cmd+Shift+R) or use incognito.** Every
   single time. They have lost time to this more than once.

8. **Verify live state before assuming anything.**
   `git fetch origin main && git reset --hard origin/main`, then build.
   Do not trust that the last batch landed.

---

## 1. HOW TO START A SESSION

```bash
cd /home/claude
git clone --depth 50 https://github.com/PYTheatre/pyt-website.git
cd pyt-website && npm install --no-audit --no-fund
rm -rf dist && timeout 180 npm run build
find dist -name index.html | wc -l
```

- Public repo; the clone needs no credentials.
- **PAGE COUNT — read this carefully, the previous handover got it
  wrong.** There are TWO numbers and they are both correct:
  - `find dist -name index.html | wc -l` → **35**
  - Astro's own build summary → **34**
  - The difference is exactly one file: `public/admin/index.html`, the
    CMS admin page. It is a static file copied from `public/`, not an
    Astro page, so Astro doesn't count it. Neither number is wrong.
  - The last handover said "the correct number is 33", which was true
    when drafted and stale by the time it was uploaded. **Quote both
    numbers in future handovers and say what the gap is.**
- Builds take 6–15s. Use `timeout 180 npm run build`.

### Deployment
Cloudflare Pages auto-deploys from `main`. A failed build does **not**
take the site down — Cloudflare keeps serving the last good build, which
means **a broken build can go unnoticed**. If the PM asks "did that
work?", build the live repo yourself or ask them to check the Cloudflare
deployments screen.

---

## 2. STATE AT HANDOVER

**Live HEAD: `ed3ccfd`.** Build clean. 35 pages (`find`) / 34 (Astro).

Everything handed over this session has landed. Nothing is half-applied.
There is **no outstanding file batch** — the next session starts clean.

### ⚠️ THE ONE THING THE PM WAS ABOUT TO DO

**Add the two missing Formspree endpoints.** `contact-forms.json`
currently reads:

```
general      ""                                  ← MISSING
education    ""                                  ← MISSING
development  https://formspree.io/f/mgawqykj     ← live
```

While a route is blank, every form using it shows a holding note instead
of a form. So right now **most of the site's contact forms are not
working**. Affected:

- **general** — About/Contact, Volunteer, Stories on Stage auditions
- **education** — School Tickets, School Play in a Box, Classes & Camps,
  and each of the 6 Stories on Stage show pages

The PM has the step-by-step (create form in Formspree → copy the Form
Endpoint URL → paste into **Site Settings → Contact Form Endpoints** →
save/publish → wait for the rebuild → test). **They never paste an
endpoint into the site's code** — it all comes from that one CMS record.
First thing to check next session: are those two filled in, and do the
forms actually render?

### ⚠️ ALSO UNVERIFIED

The `_next` thank-you redirect (see §3) was built and confirmed present
on all 12 rendered forms, but **has never been tested against a real
Formspree submission**. It is a documented Formspree feature and should
work. Confirm with one real submission — if the visitor lands on a PYT
page rather than a formspree.io one, it's working.

---

## 3. WHAT THIS SESSION CHANGED

All of it is live.

### Housekeeping
- Deleted `src/pages/employment.astro` and
  `src/content/settings/employment-page.json` (left over from the
  Employment → Volunteer rename). `/employment` no longer builds, so the
  301 to `/volunteer` finally fires — Cloudflare gives a real page
  priority over a redirect, which is why the redirect was inert.

### Support page — round 1 (structure and CMS)
- **Found the real cause of two PM complaints at once.** "Every gift,
  every level." was the heading of a *separate* "Giving Levels" section
  (`donor-tiers.json`) that had **zero tiers in it**. The page rendered a
  heading, an empty list, then a second section holding the gift
  amounts — ~168px of dead space, and a heading living in a different CMS
  record from the list it appeared to introduce. Merged into ONE section
  in ONE record (`gift-funds.json`, now labelled *Support PYT — Giving
  Levels*). `donor-tiers.json` deleted.
- Gift amounts became a rule-separated list: amounts right-aligned in
  their own column with a real gutter, no per-row buttons, one Donate.
- **Every paragraph field on the page became a Markdown field**, so staff
  can put links in body copy.
- **Stable section anchors** (see §5).
- Sponsorship became a **repeatable CMS list** (was two hard-coded
  cards). The PM has since added a third.
- Corporate contact box moved below the tier ladder and reframed.
- Removed the 501(c)(3)/EIN strip — the same details are in the footer.
- Surfaced the **employer-matching note**, which had been saved in the
  CMS for months and rendered nowhere.

### Support page — round 2 (visual)
- **Stat sentences under the bar are now editable copy with live
  figures.** Staff write the words; the numbers are placeholders filled
  from the thermometer settings: `{raised}`, `{goal}`, `{donors}`,
  `{percent}`. So `{raised} raised of this year's {goal} goal` can never
  drift out of date the way a typed "$200,000" would. An unrecognised
  placeholder renders literally, on purpose, so a typo is visible rather
  than silently eating text. Any sentence left blank is dropped and the
  separators adjust.
- Stat line size up (1.05rem → 1.25rem; 0.98 → 1.12 on small screens).
- Both Donate buttons went **yellow** (`--highlight`, the navbar Donate
  pairing) via a local `.btn-highlight` class.
- **Corporate tiers became a ladder**, not five columns. The benefits are
  cumulative ("benefits from the $500 level plus…") so they read
  top-to-bottom; and the descriptions ran 89–291 characters, so as
  equal-height columns the short tiers sat half empty. Per-tier buttons
  removed — enquiries go through the form. This retired
  `corporate_donate_url`, `button_label` and `coming_soon_label`.
- Tier benefits were stored as newline-separated lines that rendered as
  one run-on sentence; **converted to real Markdown bullet lists**.
- **ContactForm gained a `compact` prop**: no Organization box, Subject
  becomes a hidden value, name and email share a row, no reply-time line,
  and it drops its own card framing. Roughly half the height. Defaults to
  false, so the other forms are untouched.

### Support page — round 3 (alignment)
- The campaign Donate moved from middle-right of the thermometer up to
  top-right beside the `<h1>`, mirroring the Giving Levels header row
  exactly (same breakpoint, same gap, same bottom margin), so both
  buttons share one right edge.

### Thank-you redirect
- **New page `/thank-you`** plus **new record `thank-you-page.json`**
  (Site Settings → Thank You Page: heading, Markdown message, button
  label, button link). Not in the nav, on purpose.
- Every form carries a hidden `_next` field pointing there, so visitors
  no longer land on Formspree's unbranded page. One thank-you page serves
  all the forms.
- The URL is **absolute, built from `site` in `astro.config.mjs`** —
  Formspree requires an absolute URL. See the go-live warning in §6.

---

## 4. THINGS THAT WILL BITE YOU

**Grepping built HTML gives false positives.** Class names appear in the
`<style>` block as well as the markup. Always parse with `HTMLParser` (or
strip `<style>` blocks with a regex first). This produced two wrong
conclusions in an earlier session.

**Decap CMS caches its config in the browser.** After ANY `config.yml`
change, new fields will not appear until a hard refresh or incognito.
Tell the PM every single time.

**`required` is the default in Decap.** A field without `required: false`
cannot be cleared, and the PM will report "the CMS won't let me delete
this". Decide deliberately for every new field.

**Clearing a field is only half the job.** The page must also hide the
element when the value is blank, or you get a stray label with nothing
under it.

**Astro ternaries return ONE element.** `{cond ? (<p/><Foo/>) : null}`
fails to build. Wrap in `<>…</>`.

**Python `round()` ≠ JavaScript `Math.round()`.** Python uses banker's
rounding: `round(74.5)` is 74, JS gives 75. Use `math.floor(x + 0.5)` in
mockups. (The site shows 75% for 149000/200000 — a naive Python mockup
would have shown 74%.)

**Astro scoped styles can't reach into a component.** To restyle a child
component's internals from a parent page, use `:global()` inside the
page's scoped `<style>`. Used twice now — the corporate contact frame
switching off `.contact-form-card`, and the `.rich` Markdown output.

**A component's random per-render ids defeat naive diffing.** ContactForm
generates `cf-name-<random>` ids. When diffing built pages across
branches, normalise them first or every form looks changed.

**Regression-check shared components against a clean baseline.** When
ContactForm changed, the right test was: clone live `main` to a second
directory, fill in test endpoints in BOTH, build both, diff the built
markup of every affected page. That proved the only change to the seven
untouched forms was one inert wrapper `<div>`. Do this for any shared
component.

**Restore test data.** Filling in fake Formspree endpoints to test is
necessary and fine — but `git checkout` the file afterwards. This
session's test values were nearly handed over as real ones.

---

## 5. SUPPORT PAGE — REFERENCE

Section anchors (part of the public URL — do not rename casually):

| Anchor | Section |
|---|---|
| `/ways-to-support#individual` | thermometer + Donate |
| `/ways-to-support#giving-levels` | the gift amounts list |
| `/ways-to-support#corporate` | corporate sponsorship |
| `/ways-to-support#sponsor` | show & season sponsorship (note: singular `#sponsor`, it predates the rename) |
| `/ways-to-support#recognition` | donor recognition wall |

Use the short `/ways-to-support#corporate` form inside CMS content, never
the full `pages.dev` URL — the short form survives the domain change.

CMS records feeding the page:

| Record | File | Holds |
|---|---|---|
| Fundraising Statistics (thermometer) | `donation-campaign.json` | goal/raised/donors + the three stat sentences |
| Support PYT — Main Page | `donate-page.json` | intro, Soapbox URL, matching note, sponsorship list |
| Support PYT — Giving Levels | `gift-funds.json` | heading, intro, button label, amounts |
| Support PYT — Corporate Sponsorship | `corporate-giving.json` | heading, intro, tiers, contact box copy |
| Donor Recognition | `donor-recognition.json` | recognition wall (renders nothing while all groups are empty — it is currently invisible, not broken) |

Local helpers live in `ways-to-support.astro` frontmatter: `md()` (block
Markdown, `breaks: true`) and `mdInline()` (no wrapping `<p>`, for list
rows). They are **not** in `src/lib/markdown.ts` because that helper
lacks both variants. Promote them if a second page needs them.

---

## 6. OUTSTANDING WORK

1. **The two Formspree endpoints.** See §2. Highest value — most of the
   site's forms are dead until this is done.

2. **Test the `_next` redirect** with one real submission. See §2.

3. **⚠️ THE RENTALS PAGE HAS A FOURTH, SEPARATE FORM.** It does not use
   the ContactForm component. It is hand-built in `rentals.astro` with
   its own endpoint stored in `rentals-page.json` → `form_endpoint`
   (`https://formspree.io/f/xnjrrdkb`), edited in a completely different
   CMS record from the other three. It is live and working. This is a
   duplication trap: **any future change to contact forms must be applied
   there too.** Consolidating it into ContactForm is a good future task.

4. **Formspree free tier is 50 submissions/month across the whole
   account**, not per form. The site renders **12 forms** across 4
   endpoints. Watch the dashboard for the first month or two. (The PM
   asked once about alternatives, then said to disregard it — do not
   reopen that unless they raise it.)

5. **Education used to reach two people** (`caitlyn@` and `lhatten@`).
   Formspree free generally sends to one recipient. Cleanest fix is a
   forwarding rule or a group alias, not a Formspree setting.

6. **`GOING-LIVE-CHECKLIST.md` still does not exist.** It was written in
   an earlier session and never uploaded. Rebuild it by searching
   `grep -rn "pyt-website.pages.dev" src/ public/ astro.config.mjs`
   (9 files currently hit; ignore the explanatory comments in
   `Header.astro`). It must cover:
   - `astro.config.mjs` → `site` — **now doubly important**: it builds
     the absolute thank-you URL in every form. Get it wrong and the
     forms redirect to a dead address after submission.
   - `public/admin/config.yml` → `base_url` — get it wrong and **staff
     cannot log into the CMS at all**.
   - `nav-labels.json` → `site_origin` (drives the Spanish toggle).
   - Three links buried in CMS *content*: `casting-page.json`,
     `audition-page.json`, `donate-page.json` all contain full
     `pages.dev` URLs that should be root-relative paths.
   - The hardcoded fallbacks in `ContactForm.astro` and `rentals.astro`
     are only reached if `site` is missing — harmless, but list them.

7. **Eyebrow batch 3 — 10 files, cosmetic only.** These still pass a
   now-ignored `eyebrow=` prop: calendar, press, photos, rentals,
   subscribe, school-tickets, school-play-in-a-box, judy-robe,
   shows/index, stories-on-stage/[slug]. Zero visual change; purely so a
   future session isn't misled.

8. **Image focus batch 2 (~9 files).** The "Vertical focus (%)" control
   exists only on page hero images. Still centre-cropping: home photo
   strip, discovery cards, rentals, photos page, awards (`object-fit`),
   show posters and About headshots (`background-position`).

9. **Real photos** still needed in several places; placeholders remain.

### Small things worth a minute
- `gift-funds.json`, the $12,000 line reads **"the cost of royalties
  costs for a Center Stage Musical"** — lowercase and doubled. Left
  alone rather than rewriting the PM's copy. One CMS edit.
- The Young Performers page title is stored as `"Young Performers "`
  with a **trailing space**.
- `donor-recognition.json` still carries an orphan `eyebrow` key that
  nothing reads.
- `contact-forms.json` → `unavailable_note` is empty, so the holding
  message falls back to a hardcoded default. Works fine; just be aware
  the CMS field looks blank.
- `.btn-highlight` (yellow) is local to `ways-to-support.astro`. Promote
  to `global.css` if a third place needs it.
- If `intro_heading` were ever blank, the Support page renders an empty
  `<h1>`. Not reachable through the CMS (the field is required), so left
  as is.

---

## 7. PM PREFERENCES AND DESIGN DECISIONS

### Working style
- **Works in short bursts, often pausing mid-batch.** Always re-verify
  live state when they return.
- **Sends screenshots to report problems.** Read them carefully — they
  are usually pointing at something real. A screenshot this session
  revealed the two Donate buttons were misaligned horizontally as well as
  vertically, which the written request hadn't made explicit.
- **Approves mockups fast and briefly** ("yes they look great"). Mock up,
  get the nod, build. Don't stack up questions — make reasonable calls,
  flag them, and offer the alternative in one line.
- **Will tell you to drop a thread** ("disregard that, it was
  irrelevant"). Drop it completely and don't circle back.
- Appreciates being told when something they asked for won't work, and
  why, with the alternative.
- Notices uneven spacing and unbalanced elements quickly, and is usually
  right. Measure rather than assume.

### Typography
- **Baloo 2 in exactly two places**: the home page hero headline, and the
  BE KIND / BE PREPARED / BE BRAVE words. Discovery card titles and
  subtitles also use it (confirmed to stay). Everything else is
  **Archivo Black**.
- Baloo 2 has **no italic**; `font-style: italic` gives a synthesised
  slant. The PM knows and accepts this.
- Body copy stays **Source Sans 3**. The PM once said "everything should
  be Archivo Black" — that was about headings. Archivo Black has one very
  heavy weight and is unreadable as body copy. Flagged and accepted.
- All text is **black** unless on a dark or coloured ground.

### Colour
- Panels: pale lilac `#efeaf8` (`--paper-warm`). Page background: white.
- The PM dislikes grey text and warm off-white. `--ink-soft` is now the
  same `#111111` as `--ink`.
- **Pastels fail contrast on pale grounds** (1.5–2.2 vs a 3.0 minimum for
  large display text). Pastels only on the dark band. Deep brand colours
  on lilac. **Check contrast before proposing a colour.**
- Yellow CTA is `--highlight` `#f2c419` with `--highlight-text` `#1a1a1a`
  — the navbar Donate pairing, now also the Support page Donate buttons.
- Hairlines on lilac: `--line` all but vanishes there; use `--nav-pill`.

### Layout
- Section gaps on the home page are all 8rem. Keep them even.
- When two sections have an equivalent element (e.g. a section Donate
  button), give them **identical rules and breakpoints** so they cannot
  drift apart.

### Content and CMS
- **Everything should be editable in the CMS.** Comes up repeatedly. When
  building anything with text in it, make it a field.
- **Prefer live placeholders over typed-in facts.** The stat-sentence
  design (`{raised}`, `{goal}`) is the pattern to reuse: staff control
  the words, the system controls the numbers.
- Prefers optional fields that hide cleanly when blank.
- Prefers automatic behaviour over more CMS choices (colours that rotate
  by position rather than a picker per item).
- **Wants redundant CMS fields cleaned up when a redesign makes them
  obsolete** — and wants to be told when removing a field discards a real
  value.
- **No published email addresses or phone numbers anywhere on the site.**
  This is a hard rule. Contact forms exist specifically to replace them.
  Fallback text must never print an inbox.

---

## 8. ARCHITECTURE NOTES

- **`src/lib/`** — `markdown.ts` (renderMarkdown), `imageFocus.ts`,
  `showLabels.ts`.
- **`production_type` values are load-bearing.** Stored as `"Musical"`
  and `"Studio Production"`; the Musicals and Studio Shows pages filter on
  them. The CMS *labels* say "Center Stage Musical" / "Studio Show" but
  the stored values are unchanged. **Never rename the values** — it would
  silently empty both pages.
- **`ContactForm.astro`** — routes (`general` / `education` /
  `development`) map to endpoints in `contact-forms.json`. Adding a route
  means editing one place, not every page. Has a `compact` variant. Emits
  a hidden `_next` for the thank-you redirect. **Does not cover the
  rentals form.**
- **`PageHeroImage.astro`** matches on the EXACT page path. It used to
  cascade to child pages; removed because it forced a hero onto every
  Stories on Stage production page. Also accepts `image` / `focus` / `alt`
  props for staff-created pages.
- **`nav-menu.json`** drives the whole nav. Staff-created pages can append
  themselves to a dropdown; duplicates skipped by URL.
- **`_redirects`** in `public/` is Cloudflare's redirect file, one rule
  per line: `<old>  <new>  301`. **A real page beats a redirect** — if
  both exist, the redirect never fires.
- **Pages collection** — staff create pages from the CMS
  (`src/content/pages/`, rendered by `src/pages/[...slug].astro`). Each
  has a hero photo field, nav inclusion, and a draft toggle.
- **Cloudflare Pages Functions** live in `functions/api/` — `auth.js` and
  `callback.js` handle the GitHub OAuth round-trip for CMS login. Secrets
  are Cloudflare environment variables, not in the repo.

---

## 9. TESTING STANDARD EXPECTED

For every batch:
1. Build and confirm both page counts.
2. **Parse the built HTML with `HTMLParser`** (not grep) to confirm the
   change actually rendered.
3. **Empty-safe test**: blank every new/changed CMS field and rebuild.
   Nothing should crash; no empty elements or stray labels.
4. **Edge cases**: 0, maximum, over-maximum, invalid, and partial records
   (e.g. a list item with only one of its fields filled).
5. **Shared components**: diff built markup against a clean baseline
   clone of live `main`, with random ids normalised.
6. Check the *compiled* CSS in `dist/`, not just the source.
7. **Restore any test data** and confirm with `git status`.
8. Copy files to `/mnt/user-data/outputs/` and **diff each against the
   tested source** before presenting.

Report honestly what was verified and what only the PM's own eyes or a
third-party service can confirm.
