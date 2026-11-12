---
name: show-and-explain-new-techniques
description: When the work used something new or unusual for Nika (a CSS trick, a pattern, a tool), finish with a short "what we did, technically" walkthrough, opened in VS Code at the exact lines, without being asked.
metadata:
  type: feedback
  status: confirmed 2026-11-13 (Nika's explicit request)
---

**Rule:** if a task used a technique Nika hasn't met before, the handover
ends with a short technical walkthrough. Nika shouldn't have to ask for it.

**Why:** 2026-11-13, photo-portfolio. After the desktop header shipped, Nika
asked "open VS Code and show me what we did in a technical way so I learn",
then: "remember that if we do something unusual, new and extra, show me,
explain it to me so I could learn from it." Nika is a visual learner
([[visual-learner-watch-then-do]]), and seeing the real lines beat a summary.

**How to apply:**
- What counts: a CSS trick (`[hidden]` overridden by a media query, flexbox
  `order`), a new React pattern, a tool or deploy step, a fix whose cause
  wasn't obvious. Routine edits (a colour value, copy) don't count.
- Open the files at the lines: `code . -g file:line` (one `-g` per file).
- Shape: one section per file → what changed, a ≤ 8-line snippet with
  comments, and **"the idea to learn"** in 1–2 sentences. Then how it was proven.
- Keep it short (one screen). End by offering `/teach <topic>` or `/tutor` for
  the next similar piece. Don't start the lesson unasked.
- In `/tutor`, the walkthrough comes *after* Nika's attempt, not instead of it.

**Signal:** the diff contains something Nika hasn't seen in `me/concepts.md`,
or Claude would explain a choice with "the trick is…".
**Next time:** add the walkthrough as the last part of the handover, files already open.
Related: [[visual-learner-watch-then-do]], [[answer-shape-short-first-map-for-how]].
