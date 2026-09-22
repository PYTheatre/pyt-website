# Peninsula Youth Theatre website — handover

**Written 23 August 2026, for the team taking over the site, the CMS and the
domain switch.**

This document assumes no technical background. Where something technical is
unavoidable, it is explained in plain terms first and the exact detail is given
afterwards so a developer can act on it.

---

## 1. What this site is, in plain terms

The site is **static**. That means there is no database and nothing is
calculated while a visitor is browsing. Every page is built in advance into
finished HTML files, and those files are what visitors download. This is why
the site is fast and why there is very little that can break at runtime.

Three pieces work together:

| Piece | What it does | Where it lives |
| --- | --- | --- |
| **The content** | The words, images, links and settings staff can edit | Files inside the GitHub repository |
| **The CMS** | The friendly editing screens staff log into | `pyt-website.pages.dev/admin` |
| **The build** | Turns content + code into the finished website | Runs automatically on Cloudflare Pages |

**The important consequence:** when a staff member saves something in the CMS,
they are really saving a file into GitHub. That triggers a rebuild, which takes
about a minute, and then the change is live. There is no "publish" step beyond
saving, and no way to preview a change before it goes out. Staff should be told
this.

**The repository:** `PYTheatre/pyt-website` on GitHub, branch `main`.
**Hosting:** Cloudflare Pages, currently serving `pyt-website.pages.dev`.
**Site size:** 35 pages.

---

## 2. THE GOING-LIVE CHECKLIST

**Read this section before switching the domain.** The site currently has its
temporary address, `pyt-website.pages.dev`, written into **nine files**. Some
of those matter enormously and two of them will cause visible failures if
missed.

Run this to see the current list at any time:

```
grep -rn "pyt-website.pages.dev" src/ public/ astro.config.mjs
```

### The two that will break things if you miss them

**a) `public/admin/config.yml` → the `base_url` line.**
This is how the CMS logs staff in. Get it wrong and **nobody can log into the
CMS at all** — they will reach the login screen and it will simply fail. This
is the single highest-risk line in the changeover.

**b) `astro.config.mjs` → the `site` line.**
This does more than it looks like it does. Every contact form on the site uses
it to build the "where to send people after they hit submit" address. Get it
wrong and forms will still send, but the person submitting will land on a dead
page and reasonably assume it failed.

### The other seven

**c) `src/content/settings/nav-labels.json` → `site_origin`.**
Drives the Spanish translation button in the footer. Wrong value, and the
button sends people to a site that does not exist. Editable in the CMS under
**Site-wide → Navigation Labels**.

**d, e, f) Three links buried inside CMS content**, in
`casting-page.json`, `audition-page.json` and `donate-page.json`. Someone
pasted full `pages.dev` web addresses into body text. They should become
root-relative paths — that is, `/judy-robe-spirits-awards/` rather than
`https://pyt-website.pages.dev/judy-robe-spirits-awards/`. Written that way
they keep working no matter what the domain is. These are editable in the CMS
under **Shows & Auditions → Casting Page / Audition Page** and
**Support & Fundraising → Support PYT — Main Page**.

**g, h) Fallback values in `ContactForm.astro` and `rentals.astro`.**
These are only used if the `site` setting above is missing entirely. Harmless,
but update them for tidiness so nothing stale remains.

**i) Explanatory comments in `Footer.astro`.** These are notes to developers,
not live settings. Leave them; they document a real bug fix (see §6).

### Search engines — one handled, one still outstanding

These are two separate issues that were found while preparing this document.
One has been dealt with; the other is a job for launch day.

**✅ HANDLED — the temporary address is no longer indexable.**

The problem: Cloudflare Pages **keeps serving `pyt-website.pages.dev` even
after the real domain is added.** Both addresses serve exactly the same site.
Left alone, Google would index both and treat the real site as a duplicate of
the temporary one, which damages search rankings.

The fix: a file called `public/_headers` now tells search engines not to index
anything served on a `.pages.dev` address. **It is matched on the web address,
so it applies only to the temporary one and never to the real domain.**

**Nothing needs to be done to this file at launch.** It corrects itself. Please
do not delete it after the switch — the temporary address will still be live.

⚠️ **Do not "improve" this by adding a `robots.txt` that blocks everything.**
That was considered and rejected for a specific reason: a `robots.txt` file
cannot tell the two addresses apart, so it would block the **real** domain too.
That failure is completely silent — no error message anywhere, the site simply
never appears in Google. The current approach avoids this. The reasoning is
also written into the top of the file itself.

**❌ STILL TO DO AT LAUNCH — there is no sitemap.**

A sitemap is a file listing every page on the site, which helps search engines
find them all. **The site does not currently generate one**, despite a comment
in `astro.config.mjs` implying it does.

This was deliberately left until the domain switch, because a sitemap built
today would list the *temporary* addresses — the opposite of what is wanted.
It is generated from the same `site` setting described in **(b)** above, so
once that is updated to the real domain, the sitemap will be correct
automatically.

**Note for the developer who does this:** the usual route is the
`@astrojs/sitemap` package, which requires changing `package.json` **and**
`package-lock.json`. That second file is around 171KB, and this site is
maintained by pasting files into GitHub's web editor — pasting a file that
size is exactly the risk described in §6. A small hand-written page that
generates the sitemap from the existing content, adding no new packages at
all, avoids the problem entirely and is the recommended approach here.

### After the switch — test these five things

1. Log out of the CMS and log back in.
2. Submit one contact form and confirm you land on the Thank You page.
3. Click the **Español** button in the footer and confirm the site translates.
4. Click through the links on the Casting, Audition and Support pages.
5. Open **https://pytnet.org/wizard-of-oz-cast-page/** and confirm the Wizard
   of Oz cast page appears (password screen first) and the address bar still
   shows that address. See "The Wizard of Oz cast page address" below.

### The Wizard of Oz cast page address (added 22 September 2026)

PYT's old site had one cast page, at `pytnet.org/wizard-of-oz-cast-page/`,
and that exact address must keep working. On the new site every cast page
normally lives at `/cast/<show>/`, so the Wizard of Oz page is really
`/cast/the-wizard-of-oz/`. **Two lines in `public/_redirects` make the old
address show that same page**, without changing what is in the address bar.
Both addresses work and show identical content. A matching rule in
`public/_headers` keeps the old address out of search engines, like every
other cast page.

Three things to know:

- **Nothing needs changing at launch.** The rule is based on the path, not
  the domain, so it works on `pyt-website.pages.dev` now and on `pytnet.org`
  after the switch.
- **Do not rename or delete the CMS cast page "The Wizard of Oz"** (file
  `the-wizard-of-oz`) while the old address is in use — the rule points at it.
  If it is ever renamed, the old address shows "page not found".
- **New shows need nothing.** Their cast pages use the normal
  `/cast/<show>/` address. Only this one old address is special.

### Old-site page addresses forward to the new pages (added 22 September 2026)

Most page addresses on the old WordPress site differ from the new site's
(for example the old `/boxoffice/the-wizard-of-oz-2/` ticket page is now
`/shows/the-wizard-of-oz/`). **`public/_redirects` forwards about 35 old
addresses, plus whole old sections (`/boxoffice/…`, `/auditions/…`,
`/get-involved/…`, `/acting-classes-camps/…`, `/for-educators/…`), to the
closest new page**, so links in Google, old emails and bookmarks keep working.
Addresses that are the same on both sites (the home page, `/about/`,
`/subscribe/`, `/shop/`, `/scholarships/`) need nothing.

- **Nothing needs changing at launch** — like the cast rule, it is path-based.
- **To change where an old address goes**, edit the second column of its two
  lines in `public/_redirects`. Never add a catch-all for `/about/*` or `/*`:
  it would also catch real new pages.
- **Not covered:** old image addresses (`/files/…`) used in past emails, and
  any old page not linked from the old site's menu. An address the site
  doesn't know shows the home page (the address bar keeps the unknown
  address). If staff find a missing one, add two lines to `public/_redirects`.
- **After the switch, test:** `pytnet.org/boxoffice/the-wizard-of-oz-2/` should
  land on the new Wizard of Oz show page, and `pytnet.org/auditions/` on
  Auditions.

---

## 3. How the CMS is organised

Staff log in at `/admin`. The sidebar has two kinds of entry.

**Content folders** — lists of things, where staff add and remove items:

- **Pages** — free-form pages staff create themselves
- **Shows** — one entry per Center Stage Musical or Studio Production
- **Classes & Camps** — one entry per programme
- **Stories on Stage Productions** — one entry per show
- **Cast Pages** — cast lists

**Settings groups** — fixed records, one per page or section, where staff edit
the wording of something that already exists:

- **Home Page**
- **Shows & Auditions** — intros for the Shows, Musicals, Studio Productions
  and Stories on Stage pages, plus Audition, Casting and Calendar
- **Classes, Camps & Schools** — Classes & Camps, School Tickets, School Play
  in a Box
- **Support & Fundraising** — the Support PYT page, giving levels, corporate
  sponsorship, gift funds, donor recognition, the fundraising thermometer, and
  the Sponsorship/Scholarships buttons
- **About & Community** — About, Volunteer, Press, Photos, Rentals, Judy Robe
  & Spirits Awards, Thank You
- **Site-wide** — navigation menu, footer, contact form delivery addresses,
  page hero images

These six groups were, until 23 August 2026, a single list of 29 records that
had become impossible to scan. **Splitting them changed only the sidebar** —
every record still points at exactly the same underlying file, so nothing moved
and nothing needed re-saving.

### The one CMS gotcha

**After any change to `public/admin/config.yml`, anyone with the CMS open must
hard-refresh it** — `Cmd+Shift+R`, or open it in a private window. Browsers
cache that file aggressively, and without a hard refresh new fields simply do
not appear. This has caused confusion repeatedly. Tell staff.

---

## 4. Contact forms — read this before changing anything

Forms are handled by **Formspree**, an external service. There are **12 forms
across the site**, using **four different delivery addresses**:

| Route | Forms | Goes to |
| --- | --- | --- |
| `education` | 8 | Education enquiries, school bookings |
| `general` | 2 | General enquiries |
| `development` | 1 | Fundraising |
| Rentals | 1 | Venue hire |

Three of those four are edited together in the CMS under
**Site-wide → Contact Form Endpoints**.

### ⚠️ The rentals form is different, and this is a trap

**The Rentals page form is built separately.** It does not use the shared
contact form component. It is hand-written into `rentals.astro` with its own
delivery address stored in a completely different CMS record
(**About & Community → Rentals Page**, the `form_endpoint` field).

It works. But **any future change to how contact forms behave must be made in
two places, or the Rentals form will quietly fall out of step.** Merging it into
the shared component is a worthwhile job for whoever picks this up.

### Two things to watch

**The submission limit is 50 per month for the whole account**, not per form —
that is Formspree's free tier. Twelve forms share that allowance. Watch the
Formspree dashboard over the first couple of months; a busy audition period
could exhaust it, and once exhausted, submissions are lost rather than queued.

**Education enquiries used to reach two people.** Formspree's free tier
generally delivers to one address. The clean fix is a forwarding rule or a group
alias on the mail side, not a Formspree setting.

---

## 5. Things that are known and deliberate

These look like bugs and are not. Please do not "fix" them without reading.

**The page count looks inconsistent.** Counting files gives 36; the build
reports 35. Both are right — the extra one is the CMS admin screen, which is a
plain file rather than a built page.

**The nav bar shows a hamburger menu below 1120px.** This is deliberate. The
full menu genuinely does not fit below that width. See §6 before changing it.

**The Spanish button is a translation proxy, not a bilingual site.** It routes
the current page through Google Translate. A genuinely bilingual site is a much
larger project.

**Some settings fields look blank in the CMS.** Several are optional and fall
back to a sensible built-in default when empty. `unavailable_note` under
Contact Form Endpoints is the main example.

---

## 6. Traps for whoever works on the code next

**⚠️ The webfont measurement trap — this one cost real time.**
The site's heading typeface, Archivo Black, is loaded from Google Fonts. If you
measure the navigation bar's width in a browser or tool where that font has not
actually loaded, you will measure a narrower substitute font and get an answer
roughly 90px too small. That happened, and it shipped a nav bar that wrapped
onto two rows at every desktop width.

Checking `document.fonts.check()` is **not sufficient** — it returns true for a
substitute. Confirm that the loaded font list genuinely contains Archivo Black
before trusting any width measurement.

**The navigation only just fits.** It needs about 1021px and has about 1060px.
If anyone adds a menu item in the CMS, re-check that the header stays on one
row above 1120px. There is a safety net that drops it to two rows rather than
breaking the page, but two rows looks unintentional.

**Editing files by pasting into GitHub's web editor is how this site is
maintained.** It works, but **you must select all the existing content first**
(`Cmd+A`) before pasting. A partial replacement leaves the old content behind
and produces a file that looks plausible and does not build. This has taken the
site down once.

**Never download and re-upload a file whose name contains square brackets** —
for example `[slug].astro`. The name gets mangled and the build breaks. Use the
web editor for those.

---

## 7. Work that was consciously parked

**A tidy-up of roughly 30 files** was prepared and deliberately not applied
before the domain switch. It removes unused fields and settings that nothing
displays. It was verified to change **nothing at all** on the live site — every
page was compared before and after and came out identical. It was held back
purely because 30 hand-pastes during handover week is more risk than the benefit
justifies. Worth doing once the domain switch has settled.

**`sponsorship-page.json` is orphaned.** It contains real, filled-in sponsorship
tier content — a $10,000 "Show Producer" level, a $5,000 "Show Sponsor" level,
and others, with benefits listed. **No page displays any of it.** Someone built
it and it was never connected. Somebody at PYT should decide whether this
content was meant to go live, because as things stand it is invisible.

**Images are centre-cropped in several places.** A "vertical focus" control
exists for page hero images only. Everywhere else — the home page photo strip,
show posters, About page headshots — images crop from the centre, which can cut
off heads. Extending that control is a known, unstarted job.

**No sitemap is generated.** Parked until the domain switch on purpose — see
§2 for why, and for the recommended way to add one.

**Placeholder photos remain in several places.**

**Small copy issues** noted but left alone rather than rewriting PYT's own
words: the $12,000 line under gift funds reads "the cost of royalties costs for
a Center Stage Musical", and the Young Performers page title has a trailing
space.

---

## 8. Where to look for more

| File | What it holds |
| --- | --- |
| `BUILD_LOG.md` | Running history of what was built and why |
| `DECISIONS.md` | Design and product decisions, with reasoning |
| `PROJECT_RULES.md` | Conventions the site is built to |
| `HANDOVER-2026-08-23.md` | The current developer handover, more technical. Supersedes all earlier `HANDOVER-*` files |

**The code itself is heavily commented**, and the comments are unusually
detailed on purpose — they explain not just what a piece of code does but why,
and what was tried before. When something looks odd, read the comment above it
before changing it. Several of them record bugs that took a long time to find.

---

## 9. If something breaks

**The site will not build.** Check the Cloudflare Pages dashboard for the failed
deployment and read the error — it names the file and line. The most common
cause by far is a partially-pasted file (see §6). Fixing that file and
committing again is enough; there is nothing to roll back manually.

**Every deployment after a failure also fails.** That is expected — they are all
building the same broken file. Fix the one cause and the next build goes green.

**Nobody can log into the CMS.** Almost certainly `base_url` in
`public/admin/config.yml` — see §2.

**A form submits but lands on a dead page.** Almost certainly the `site` value
in `astro.config.mjs` — see §2.

**Something in the CMS does not appear.** Hard-refresh with `Cmd+Shift+R`, or
open the CMS in a private window.
