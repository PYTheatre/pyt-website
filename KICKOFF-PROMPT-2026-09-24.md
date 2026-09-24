# Kickoff prompt — 2026-09-24 (switch day)

Paste the text below as the first message of the new chat, attaching
`HANDOVER-2026-09-23.md` and `LAUNCH-PLAN-2026-09-24.md` from the repo root.

---

I'm continuing work on the Peninsula Youth Theatre website (repo:
PYTheatre/pyt-website — public, clone it directly). Preview:
pyt-website.pages.dev. Real domain: pytnet.org — NOT yet switched; today is
switch day, following LAUNCH-PLAN-2026-09-24.md. I do all GitHub and CMS
work; the DNS admin (Mike G) does all Cloudflare/registrar work remotely
and works from Appendix A of the plan.

Before anything else:

1. Clone the repo fresh and read HANDOVER-2026-09-23.md at the repo root.
   It supersedes every earlier handover, and its §1 corrects a wrong claim
   in the previous one (the domain is NOT live yet). The repo beats any
   document if they disagree.
2. Verify the state yourself: build (expect 39 pages, 0 errors, if I
   pasted the SEO batch last night; 38 if not — check for
   src/pages/sitemap.xml.ts), and check what pytnet.org currently serves
   and its NS/A/MX records (recipe in the handover §7). Tell me which of
   the two pending batches (SEO, switch) is already on main.
3. Read the handover's §5 (traps) and §6 (preferences) before doing
   anything. Same working rules as always: mock up visual changes from the
   real built site with real webfonts (fetch them first — they don't
   persist), attach every file/mockup, GitHub links in the chat with path,
   line count and first line, never raw code in chat, CMS hard-refresh
   reminder on config.yml, rebuild and measure before saying anything is
   fixed, take my corrections literally.
4. Then tell me briefly what's confirmed on main, and ask me where Mike
   has got to with Appendix A so we can pick up the switch-day checklist
   (section 4 of the plan) at the right step.

On the day, the things you own are: telling me when to paste the switch
batch (astro.config.mjs, nav-labels.json, config.yml base_url — files were
delivered as "batch8-switch"; regenerate from main if I don't have them),
reminding me about the GitHub OAuth callback change, walking the smoke
test with me, and diagnosing anything that fails — email first, CMS login
second. If something fails, find the mechanism; don't guess.

After the switch, next on the list is the image-weight batch described in
the handover §4.
