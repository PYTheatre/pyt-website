# Audition Feature — In-Flight Status (2026-06-09)

**Read this right after the master handover (`HANDOVER-2026-06-09.md`).** This feature was built on 2026-06-09 but is **only partially uploaded and NOT confirmed live by the PM.** Your first job is to reconcile this against the live repo before doing anything else. Do not assume done; do not assume absent.

---

## What the feature is (what the PM asked for)

A new **Audition page** at `/audition`, in plain terms:
- Lists every show that **currently has open auditions** — i.e. has an audition sign-up link AND its audition end date hasn't passed — each with its own sign-up button to the external link (Active.com). Shows drop off automatically once their deadline passes. (Same auto-close logic the `/shows` page already uses.)
- A **Stories on Stage panel** (a bit of copy + a button) linking to `/stories-on-stage`. (Stories on Stage is cast from one annual audition and doesn't carry per-show audition dates, so it's a panel, not part of the dated list — this was a deliberate decision with the PM.)
- A **casting philosophy panel** (editable copy + a button) linking to `/casting`.
- An **FAQ section**, editable in the CMS (a repeatable question/answer list). The whole FAQ section hides itself if the list is empty.

**Menu change the PM approved:** "Audition" becomes its **own top-level menu heading** (a parent with a dropdown), and **Casting moves out from under About** to live under Audition. Final agreed menu, left to right:

> Shows ▾ (Shows, Stories on Stage) · **Audition ▾ (Audition, Casting)** · Classes & Camps · Shop ▾ (Shop, Rentals, Photos) · About ▾ (About, Employment) · Support PYT · + Donate

(Note About now has only About + Employment.)

---

## The four pieces, and upload status

The feature is **four** changes. As of the end of the 06-09 session:

| # | Change | File | Type | Upload status |
|---|--------|------|------|---------------|
| 1 | New Audition page | `src/pages/audition.astro` | NEW file | PM said uploaded ✅ — **verify in repo** |
| 2 | New CMS content file | `src/content/settings/audition-page.json` | NEW file | PM said uploaded ✅ — **verify in repo** |
| 3 | Menu restructure | `src/components/Header.astro` | EDIT existing | PM said uploaded ✅ — **verify in repo** |
| 4 | CMS editor record | `public/admin/config.yml` | EDIT (insert a block) | **PENDING** — handed to PM, not confirmed done |

**The critical gap:** piece #4 (the config.yml block) was the last thing handed over and was **not confirmed committed** before the session ended. Without it, the page still works and renders fine (it falls back to the JSON's contents), but the PM **cannot edit the Audition page's wording or FAQ through `/admin`** — there's no editor form for it yet. So the likeliest live state is "page works, but not CMS-editable."

Also unconfirmed: whether the PM has done the **hard-refresh of `/admin`** needed after the config.yml change, and whether the PM has **visually checked** the live page on phone + desktop (Claude could not screenshot).

---

## YOUR FIRST STEPS (reconcile before building)

1. **Clone (or get files) and check the repo for the three uploaded files.** Confirm each exists at the right path: `src/pages/audition.astro`, `src/content/settings/audition-page.json`, and that `src/components/Header.astro` contains an "Audition" navGroup with Casting moved under it (and Casting removed from About).
2. **Check whether the config.yml block landed.** Open `public/admin/config.yml` and look for a record with `name: "audition-page"` / `label: "Audition Page"` under the Site Settings `files:` list. If it's NOT there, piece #4 is still pending — this is the most likely thing to still need doing.
3. **Check the build / page count.** A correct full build is **20 pages** (was 19; `/audition` adds one). 19 = the page didn't land; 20 = it did. (If the sandbox can't build, reason from the repo file list instead and say so.)
4. **Report to the PM in plain language** what you found live vs. pending, and propose finishing whatever's missing. Then ask before acting.

---

## How the page works (so you can verify or extend it correctly)

- The page reads `src/content/settings/audition-page.json` for all its copy. **Every field has a fallback in the page code**, so the page renders correctly even if the JSON is missing fields or the CMS record doesn't exist yet — including an **empty FAQ list** (the FAQ section hides entirely).
- The **show list is NOT CMS content** — it's read live from the `shows` collection (the same source `/shows` uses), filtered to "open auditions only."
- **The exact filter:** a show appears only if it has an `audition_url` AND an end date (`audition_end`, falling back to the legacy `audition_date`) AND that end date is today or later. Deliberately, a show with a sign-up link but **no end date does NOT appear** here (the page can't tell if it's still open). This is slightly stricter than the `/shows` page, which would still show such a show's button. This was a conscious choice for a dedicated auditions list; if the PM ever wants no-end-date shows shown too, it's a one-line change in the filter. **Flag this to the PM if it ever seems like a show "should" be listed but isn't — the missing audition end date is the likely reason.**

### The CMS fields (in `audition-page.json` / the config.yml record)
`eyebrow`, `title`, `intro`, `no_open_message` (shown in place of the list when nothing is casting), `sos_heading`, `sos_blurb`, `sos_button_label`, `casting_heading`, `casting_body`, `casting_button_label`, `faq_heading`, and `faqs` (a list of `{question, answer}`). All were cross-checked: every field the page reads exists in the config and the JSON, and vice-versa — no orphans.

---

## If piece #4 (config.yml) still needs uploading

It's an **edit-in-place insert**, the highest-risk upload type (YAML indentation). The block to paste was handed to the PM as `audition-config-block.txt` (re-generate it if lost — it's a standard Decap `files:` record matching the existing ones, with a `list` widget for `faqs` holding `question` + `answer` subfields, 6-space base indentation to match siblings). Insertion point: inside the Site Settings collection's `files:` list — the session put it between the **Casting Page** record (`name: "casting-page"`) and the **Judy Robe & Spirits Awards** record (`name: "judy-robe-spirits-awards"`), but anywhere in that `files:` list is valid. Tell the PM: paste as-is, don't change leading spaces; if the build goes red, it's the indentation; and **hard-refresh `/admin`** afterward so "Audition Page" appears in the editor. Verify the whole file parses as YAML on your end before handing it over.

---

## What was verified on 06-09, and what wasn't

**Verified (the sandbox could NOT reach GitHub that session, so this was done against files the PM pasted, using logic/parse checks — not a real site build):**
- `audition-page.json` is valid JSON with all 12 fields.
- The `navGroups` structure parses correctly: Audition group added with Casting under it; About reduced to About + Employment.
- The open-auditions filter behaves correctly across edge cases (future end date shows; passed end date hides; legacy `audition_date` works; same-day-as-deadline shows; no link hides; no end date hides).
- The config.yml block parses as valid YAML and its fields match the page one-to-one.

**NOT verified (needs the new session and/or the PM):**
- A real `npm run build` and the resulting page count (sandbox couldn't build).
- The live visual appearance on phone and desktop (Claude can't screenshot — always the PM's check).
- That pieces #1–3 actually committed cleanly to the right paths (PM said so; confirm in repo).
- That piece #4 was ever committed (most likely still pending).
