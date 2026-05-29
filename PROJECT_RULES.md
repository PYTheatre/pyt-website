# PYT Website — Project Rules

These are not suggestions. Every Claude session that has worked on this project has broken at least one of these rules within the first hour. Read this file before doing any work, and re-check the relevant rules before each significant action.

---

## Rule 1: Do not make confident fixes from memory for OAuth, CMS, Soapbox, or any third-party integration.

This is the single biggest trap on this project. The pattern of failure has been documented twice and recurred at least twice more:

- A bug appears in OAuth, in Decap CMS behavior, in Soapbox, in MailChimp.
- Claude pattern-matches the symptom against vague memories of similar problems.
- Claude proposes a "fix" with confidence.
- The fix is wrong.
- Claude proposes another fix, still from memory.
- That fix is also wrong.
- Only the third attempt — preceded by actual research (web search, reading official docs, asking the user for diagnostic info) — works.

This pattern has cost real client time and damaged trust. **The cost of doing it again is high; the cost of slowing down to research is low.**

Concrete examples that have happened:

- **Decap CMS script-in-head bug.** Symptom: blank `/admin` page, `Cannot read properties of null (reading 'appendChild')`. First "fix" (add a `<div id="nc-root">` mount target) was based on a memory of how an older version of the CMS worked. Wrong. Correct fix (move the script tag from `<head>` to `<body>` per the official Decap install docs) only came after the second failure forced a search.
- **GitHub OAuth Apps vs GitHub Apps.** Claude confidently told the client that an `Ov23li...` Client ID prefix proved their app was a GitHub App (and therefore the wrong type). Wrong — in 2026 GitHub uses that prefix for both types. The correct verification is to check which tab the app lives in at `github.com/settings/developers`.
- **Decap postMessage handshake.** First implementation of the OAuth callback's postMessage handshake had the wrong sequence. Took two iterations and a research pass through the canonical Decap implementation to get right.

**What to do instead:**

1. When a bug appears in any third-party integration, **before proposing a fix, gather data.** Ask the client for the console output, the network tab, the actual error text. Do not propose a fix while still uncertain about what's actually wrong.
2. **Use the web search tool** to read current documentation. The user is on a recent stack (Astro 6, Decap CMS 3.10.1) — your training data is probably out of date.
3. If you're tempted to say "I'm pretty sure this is what's wrong," stop. Say instead: "Here are two or three possibilities. Could you check X so I can narrow it down?"

---

## Rule 2: The live site (GitHub repo) is the source of truth for all CMS-managed content. The sandbox is reference-only and probably stale.

The client edits content through the CMS at `/admin` — adding shows, programs, board members, etc. Those edits commit to the GitHub repo. Your sandbox copy of those files (`src/content/**`) was last updated by an earlier Claude session and is probably out of date.

**Critical consequence:** Upload batches must never include `src/content/**` files unless the client has explicitly asked to overwrite live content.

Specifically:
- New page templates: include in uploads.
- Updated components, layouts, styles: include in uploads.
- CMS config (`public/admin/config.yml`): include in uploads.
- Brand-new settings files for new features (`src/content/settings/employment-page.json` for a brand-new Employment page): include — they're not overwriting existing content.
- Existing settings files (`src/content/settings/about-page.json`, etc.): **do not include**. Even if you've made a "small" edit. The client has edited these through the CMS and your version is stale.
- Show files, program files, board members, etc.: **never include**. The client maintains these.

**When you change a schema** (e.g., adding a new field to the About page form, or changing what values are valid in a content collection): the live content files don't have the new fields yet. The page template must handle the new field being absent gracefully. Test the empty case explicitly in your sandbox before packaging.

---

## Rule 3: Plan before you build. Get approval before you ship.

The client wants to see the plan before the work starts. Even small features.

The shape of a good plan:
- What you'd build, in concrete terms (URLs, fields, where it appears).
- The decisions baked in, surfaced as their own paragraphs.
- Tradeoffs called out with a recommendation.
- An honest list of what could go wrong.

After the plan, **wait for explicit approval** before writing any code. The client may have a small change ("change field X to Y") that, if you build first, would mean rebuilding.

After building, present the upload but **don't claim something works that you haven't verified.** If you can verify it in the sandbox (build is clean, screenshots look right, schema works), say so. If you can't fully verify it because it depends on a live third-party service (Soapbox, MailChimp, real OAuth), say *that*. The client doesn't expect you to verify the unverifiable, but does expect honesty about what's been tested and what hasn't.

---

## Rule 4: Match the established workflow.

The workflow is:

1. Client describes what they want.
2. Claude asks clarifying questions (use the `ask_user_input_v0` tool — buttons are easier than typing on mobile).
3. Claude writes a plan, surfaces decisions, recommends.
4. Client approves (or amends).
5. Claude builds in the sandbox (`/home/claude/pyt-website`).
6. Claude tests with `npm run build`, screenshots with Playwright at 390px (phone) and 1280px (desktop).
7. Claude updates `BUILD_LOG.md`.
8. Claude packages a `.zip` mirroring the repo directory structure into `/mnt/user-data/outputs/`.
9. Claude calls `present_files` to share the zip.
10. Claude writes a short upload guide: download, unzip, drag everything into GitHub's "Upload files" page, commit message, expected file replacements, expected post-deploy verification steps.
11. Client uploads, Cloudflare rebuilds in ~2 minutes.
12. Client reports back. Claude either confirms phase complete in the build log, or diagnoses and iterates.

**Do not deviate from this workflow** without explicit reason. Specifically: do not paste long blocks of code in chat for the client to copy-and-paste (the upload mechanism exists for this). Do not skip testing. Do not pre-suppose decisions the client hasn't approved.

---

## Rule 5: Be careful about deletions.

The chat-and-upload workflow can only *add or overwrite* files. It cannot delete a file from the repo. If a phase requires deleting a file (e.g., when Stories on Stage moved from being a program to being its own collection, the old `stories-on-stage.md` program file had to be deleted), the client must do that deletion separately through GitHub's web UI — and a build that depended on the deletion will fail until the deletion happens.

If a phase requires a deletion: warn the client clearly in the upload guide, provide a direct URL like `https://github.com/PYTheatre/pyt-website/delete/main/path/to/file`, and note that the deletion is non-optional if the build would otherwise fail.

---

## Rule 6: Cloudflare's "internal error" deploy failures are usually transient. Retry once before debugging.

The Cloudflare Pages deploy pipeline occasionally fails the "deploy" step (after a successful build) with an error like "Failed: an internal error occurred." This is a Cloudflare platform hiccup, not a code problem. The fix is to click "Retry deployment" on the failed deployment row.

If a retry fails the same way, the next escalation is to wait 10 minutes and try again. Only if it persists across multiple retries spaced apart does it warrant investigation.

---

## Rule 7: Some Cloudflare UI traps and GitHub gotchas.

A few specific traps that have caught earlier Claude sessions:

- **Cloudflare's "Workers vs Pages" landing.** When creating a new project, the first page heavily emphasizes Workers. To create a Pages project, you have to click a small "Looking to deploy Pages? Get started" link at the bottom.
- **Cloudflare environment variable changes don't take effect on existing deploys.** If the client changes `GITHUB_CLIENT_ID` or `GITHUB_CLIENT_SECRET`, they must manually redeploy from the Deployments tab. Otherwise the change is "saved" but not "applied."
- **The empty `peninsula-youth-theatre` GitHub org.** It exists alongside `PYTheatre`. The real repo is at `PYTheatre/pyt-website`. The original handoff notes were wrong; do not be confused by them.
- **GitHub web UI commit-count caching.** Web views of the repo sometimes lag reality by minutes. Don't trust your `web_fetch` of the GitHub repo page to be current. Trust the client's screenshot or the Cloudflare deployment status instead.

---

## Rule 8: Update the build log meticulously, but separate it from "what's true now."

`BUILD_LOG.md` is the phase-by-phase history. Add to it as you complete phases, but don't use it as the place to communicate current state. Current state lives in `HANDOFF.md` and `IN_FLIGHT.md`.

When you complete a phase: add an entry to `BUILD_LOG.md` with the goal, the decisions locked, the files changed, what was tested. When the client confirms the phase is live, update both the status table in the build log and any mention of it in `IN_FLIGHT.md` (remove from in-flight, mark complete in build log).

---

## Rule 9: Communication style.

- Use the `ask_user_input_v0` tool for clarifying questions. Buttons are easier than typing on mobile. Three questions per call is the ceiling, not a target.
- Write succinctly. The client is busy.
- Avoid technical jargon when plainer words work. Don't say "wire it into the layout"; say "add it to every page."
- Don't grovel when corrected. The client values honesty without theatrical apology.
- When something works, say so plainly. When it doesn't, say *what* didn't work without burying it under hedges.
