# PYT Website — Build Log

Newest entries at the top.

- **Repo:** https://github.com/PYTheatre/pyt-website
- **Live site (staging):** https://pyt-website.pages.dev
- **Stack:** Astro (static) + Decap CMS + Cloudflare Pages
- **Workflow:** Claude builds & tests files; client uploads to GitHub web UI; Cloudflare auto-deploys.

---

## Phase status overview

| Phase | What | Status |
|---|---|---|
| 0 | Pipeline | ✅ Complete |
| 1 | Decap CMS login | 🟡 **In progress — files built & sandbox-tested; awaiting client upload + OAuth setup** |
| 2 | Core pages via CMS | ⬜ Not started |
| 3 | Cast pages + Sheets + Rentals + Shop + MailChimp | ⬜ Not started |
| 4 | Full EN/ES | ⬜ Not started |
| 5 | Rebrand test, docs, handoff | ⬜ Not started |

---

## Phase 1 — Decap CMS login (in progress)

**Goal:** Stand up the form-based CMS so PYT staff can edit content without code.

### Built (sandbox-tested)
- `public/admin/index.html` — the page staff visit at `/admin` to log in.
  Loads Decap CMS v3.10.1 (latest stable, Feb 2026).
- `public/admin/config.yml` — Decap configuration: GitHub backend on
  PYTheatre/pyt-website, custom OAuth endpoint at /api/auth, one
  starter collection "Site Settings → Donation Campaign".
- `functions/api/auth.js` — Cloudflare Pages Function: starts the
  GitHub OAuth flow. Reads GITHUB_CLIENT_ID env var.
- `functions/api/callback.js` — Cloudflare Pages Function: completes
  the OAuth flow, exchanges code for token, returns token to Decap
  popup via postMessage. Reads both env vars.
- `src/content/settings/donation-campaign.json` — the first CMS-edited
  file. Holds the donation campaign numbers (goal, raised, donors,
  label) that the home page reads.
- `src/pages/index.astro` — updated to import the JSON file and
  render its values in the donation teaser, proving the CMS→site loop.

### Sandbox tests passed
- ✅ `npm run build` zero errors with all new files in place.
- ✅ Admin folder ships to `dist/admin/` correctly.
- ✅ JSON values render correctly in the built home page HTML.
- ✅ **CMS edit loop proven:** changed JSON to `goal=250000,
  raised=187500, donors=287, label="Spring 2026 Push"`, rebuilt,
  confirmed all four values propagated to the live HTML. Reverted.

### What I cannot fully test in the sandbox
- The actual GitHub OAuth login flow needs:
  - A real GitHub OAuth App (client creates on github.com)
  - Real env vars set in Cloudflare Pages (client creates)
  - The live `*.pages.dev` URL talking to GitHub
  So login itself can only be tested after the client uploads the
  files and completes the OAuth App setup. This is the known-fragile
  part of Phase 1 — documented carefully in the upload instructions.

### Fallback plan
If GitHub OAuth setup gets stuck after a serious troubleshooting
attempt, fall back to Sveltia CMS — same config format, same editor
look-and-feel staff were shown, simpler Cloudflare recipe. Most of
the work above (admin folder, config, content file, home page wiring)
carries over.
