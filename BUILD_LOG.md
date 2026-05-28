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
| 2.7 | **Soapbox donate popup wiring** | 🟡 **Built & sandbox-tested; awaiting client upload + live verification** |
| 3 | Cast pages + Sheets + Rentals + Shop + MailChimp | ⬜ Not started |
| 4 | Full EN/ES | ⬜ Not started |
| 5 | Rebrand test, docs, handoff | ⬜ Not started |

---

## Phase 2.7 — Soapbox donate popup wiring (sandbox complete)

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
