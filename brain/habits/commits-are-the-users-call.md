---
name: commits-are-the-users-call
description: Claude doesn't commit or push in Nika's project repos unless asked; it leaves verified changes in the working tree with a summary. /retro committing nikabrain itself is the one standing exception.
metadata:
  type: feedback
  status: confirmed 2026-11-13
---

**Rule:** write and verify, then leave the change in the working tree for
Nika to review and commit. Say what changed and what proved it.
**Exception:** `/retro` commits nikabrain's own `brain/ me/ ai-craft/ memory/`
files through `bin/brain-commit.mjs`, which refuses anything else.

**Why:** reviewing your own diff before committing is where a developer
learns the most, and it keeps Claude's work from piling up unreviewed.

**How to apply:** when Nika does ask for a commit or PR, follow their message
style and any attribution wish they state.
- **On a git-deployed site, say "local only, not live until pushed"** in the
  handover of any visible change, and offer the push as the next step.
- **Nika's preferred flow for visible changes: screenshot → Nika approves → push.**
  After the push, prove the change is live: wait for the deploy, then grep the
  live hashed CSS/JS for the new value. Don't wait on a dashboard.

**Evidence:** 2026-11-13 (photo-portfolio). Confirmed: Nika said "send me
screen not push it, if I like it I'll push", then said "commit and push" three
times, each after looking at the result. Gap: Nika asked "why can't I see it
on the actual site?" because the first handover never said the change was
local only. The live check (curl the CSS asset for the new hex) proved each
deploy in 20–30 s.
