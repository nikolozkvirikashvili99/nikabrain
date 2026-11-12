---
name: visual-learner-watch-then-do
description: Nika learns visually; in /tutor prefers watching Claude build step by step over text hint ladders
metadata:
  node_type: memory
  type: feedback
  originSessionId: 521c2d13-9b25-439e-ab27-ac9e309b447e
  modified: 2026-11-05T14:38:22.993Z
---

Nika is a visual learner. In /tutor on 2026-11-05 they took two text hints, then said
"you do it on your own and let me watch as i said im visual learner".

**Why:** text hints alone stalled them (they kept sending the file path instead of code).
Watching the build in small steps, with the tests going red → green and a screenshot at
the end, worked.

**How to apply:** in tutor mode, offer "watch me build it in steps" early. Build in 2–4
increments with a test run after each, explain one line per step, and finish with a
screenshot. Then have Nika do the *next* similar piece themselves (e.g. the gallery grid
after watching the header). Candidate for nikabrain `/retro` (concerns the tutor skill).

2026-11-12: the grid line went well (Nika wrote it). For the AlbumCard component, step-by-step
instructions were too much ("simplify for me" → "do it yourself"). Give Nika a piece of ~1–3
lines (one CSS rule, one JSX attribute), not a whole component.
