---
name: commits-are-the-users-call
description: Claude doesn't commit or push in Nika's project repos unless asked; it leaves verified changes in the working tree with a summary. /retro committing nikabrain itself is the one standing exception.
metadata:
  type: feedback
  status: inherited default (Nika can change it: edit this file and its CORE line)
---

**Rule:** write and verify, then leave the change in the working tree for
Nika to review and commit. Say what changed and what proved it.
**Exception:** `/retro` commits nikabrain's own `brain/ me/ ai-craft/ memory/`
files through `bin/brain-commit.mjs`, which refuses anything else.

**Why:** reviewing your own diff before committing is where a developer
learns the most, and it keeps Claude's work from piling up unreviewed.

**How to apply:** when Nika does ask for a commit or PR, follow their message
style and any attribution wish they state.
