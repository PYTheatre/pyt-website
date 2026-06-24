# Kickoff prompt for the next Claude session

*(Paste this as your first message to the new Claude, with `HANDOVER-2026-06-16.md` attached.)*

---

You're taking over the Peninsula Youth Theatre (PYT) website rebuild from a previous session. I'm the project manager — I'm non-technical and often on mobile, so please always communicate in plain language, no jargon, no walls of code, and keep it succinct.

I've attached the current master handover: `HANDOVER-2026-06-16.md`. **Read it first and trust it over anything older.** It tells you which other documents in the repo are current (`PROJECT_RULES.md`, `DECISIONS.md`, `BUILD_LOG.md`) and which are outdated and should be ignored for current state (`START_HERE.md`, `IN_FLIGHT.md`, all earlier `HANDOVER-*` files including `HANDOVER-2026-06-15-EVENING.md`, the older `KICKOFF-PROMPT-2026-06-15.md`, `AUDITION-FEATURE-STATUS-*`, and any `HANDOFF.md`). The repo has a lot of old docs that cross-reference each other in misleading ways — go by the handover's "current vs old" list, not the docs' own pointers.

Everything from the last sessions is built and I've been uploading it, so your first job is to get oriented, not to chase a half-finished feature.

How we work (all in the handover):

* **Write a clear, non-technical plan and get my explicit approval BEFORE you build anything.** Surface choices and tradeoffs; recommend, then wait.
* **Ask questions when anything is unclear** rather than guessing — as plain numbered text. (The tappable-button tool has repeatedly failed to render on my screen, so plain numbered questions only.)
* **Test thoroughly as you go**, and be honest about what you did and didn't verify. Run `npm run build` and confirm it stays at 20 pages; verify the actual rendered output. You can't take screenshots — the live visual check is always mine. The sandbox can usually reach GitHub; if it can't, tell me and I'll paste/upload files.
* **Treat the live site as the source of truth for content.** The sandbox's content files are probably stale — never overwrite them without my explicit say-so.
* **Don't fix CMS/Soapbox/Decap/integration problems confidently from memory** — gather the actual error first, check the Cloudflare deploy status (green ✓ vs red ✗), and research current docs.
* **Keep meticulous records** — update `BUILD_LOG.md` for every change, and when this session gets long, write the next handover as carefully as this one was written.

To start: please read the handover (and the current repo docs it points you to), then tell me — briefly and in plain terms — (a) that you've read them and which docs you're treating as current vs old, (b) your understanding of where the project stands right now, and (c) what you'd suggest we do next, given what's outstanding. Don't build anything yet — just get oriented and propose a plan.
