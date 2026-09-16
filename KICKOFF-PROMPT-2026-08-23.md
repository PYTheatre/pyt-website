I'm continuing work on the Peninsula Youth Theatre website
(repo: PYTheatre/pyt-website — public, you can clone it directly).

Please read HANDOVER-2026-08-23.md in the repo root FIRST. It is the current
handover and supersedes all earlier ones, including
HANDOVER-2026-08-21-EVENING.md. It contains the working rules, my preferences,
known traps, and everything outstanding.

Before you tell me anything, please:

1. Clone the repo and run a real build to confirm the current state — don't
   trust that anything from last session landed.
2. Read the handover, and BUILD_LOG.md if you need history.
3. Tell me where things stand and flag anything needing my attention.

NOTE ON PAGE COUNT: `find dist -name index.html | wc -l` gives 36 and Astro's
own summary gives 35. Both are correct — the difference is
public/admin/index.html, which is a static file, not an Astro page. Don't treat
the gap as a problem.

NOTE ON MEASURING THE NAV BAR: Google Fonts is unreachable from your sandbox, so
Archivo Black will NOT load in a headless browser unless you serve it yourself.
Measuring without it gives answers ~90px too small and has already shipped one
bug. `document.fonts.check()` is not sufficient — it returns true for a
fallback. See section 3.1 of the handover before measuring anything in the
header.

WORKING RULES — follow these without being asked:

1. MOCKUPS: for anything visual, generate an actual PNG image file first and
   show it to me. Do NOT use the interactive widget tool — it doesn't render on
   my end.
2. LABEL YOUR FILES: if a response contains both a mockup and files for the
   repo, say explicitly which is which. I got confused by this before and didn't
   know what to do with the mockup.
3. CODE HANDOFF: never paste raw code into the chat. Give me the file to
   download, plus a GitHub link.
4. LINKS: give me a specific GitHub link for EVERY file in a batch — edit link,
   create-new link, upload link or delete link as appropriate. I've had to ask
   for missing ones repeatedly. Never write "same links as last time".
5. NEW FILES FIRST: if a batch includes a brand-new file that other files depend
   on, say so clearly and number the steps. Also tell me whether it's safe to
   stop halfway — I often work in short bursts.
6. NEW OR AWKWARD FILENAMES: for any new file, and for anything with square
   brackets, no extension, or an unusual extension, tell me to use GitHub's
   "Create new file" and paste. Downloading and re-uploading mangles the name
   and this broke four deploys once.
7. CMS CACHE: whenever a batch changes public/admin/config.yml, remind me to
   hard-refresh the CMS (Cmd+Shift+R) or use incognito, or new fields won't
   appear for me.
8. PASTING: when you give me a file to paste over an existing one, tell me the
   expected line count and what the first line should be, so I can check before
   committing. A partial paste took the site down last time.

FIRST TASK: HANDOVER-TO-LIVE-TEAM.md was written last session but never
uploaded, so it is NOT in the repo. It's the plain-English handover for the
non-technical team taking over the site and the domain switch. Section 1 and
section 7 of HANDOVER-2026-08-23.md explain what it contained. Ask me whether I
still have the file — if not, rebuild it, and fold in the two extra go-live
findings noted in section 1 (no robots.txt, and no sitemap being generated).
