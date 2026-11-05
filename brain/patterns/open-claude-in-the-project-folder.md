---
name: open-claude-in-the-project-folder
description: "Build an app by opening Claude in that app's folder, not in nikabrain. CORE, skills and agents load globally, so nothing is lost; memory, commands and the project's own CLAUDE.md follow the folder. Keep project handoffs in memory/<project>/, never in nikabrain's auto-memory."
metadata:
  type: pattern
---

Open Claude in the project's folder (`cd ~/projects/<app>`, then `claude`). Open it in
nikabrain only for brain work: `/curate`, `/retro` catch-up, editing habits, learning tracks.

**Why:** `~/.claude/CLAUDE.md` imports `brain/CORE.md`, and skills, agents and hooks are
linked globally, so the brain is there in every folder. Auto-memory, git, the dev server,
tests and the project's own CLAUDE.md all follow the working folder. A project run from
nikabrain mixes its facts into the brain's memory and runs commands in the wrong repo.

**How to apply:** when Nika asks "where should I open Claude for X", the answer is X's
folder. When a project is *started* from a nikabrain session, write its resume notes to
`memory/<project>/handoff.md` (where the guard hook injects them), not to nikabrain's
auto-memory. `/onboard-project` then sets `autoMemoryDirectory` so later sessions find them.

**Signal:** a build or app task in a session whose working folder is nikabrain; a resume
note about a project saved in `~/.claude/projects/C--...-nikabrain/memory/`.

**Next time:** say "open Claude in `<folder>`", and give a copy-paste first prompt that
points to the handoff.

Evidence:
- 2026-11-05: Nika asked whether to open Claude in nikabrain or photo-portfolio for their
  wife's site. Advice: the project folder. Nika opened photo-portfolio 17 minutes later,
  onboarded it and built the Header there. The 2026-11-03 resume note had been saved in
  nikabrain's auto-memory and went stale the same day, so it was replaced with a pointer.

[[team-claude-md-gets-a-local-sibling]]
