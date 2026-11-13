---
name: visual-choices-get-rendered-previews
description: When Nika has to pick between looks (size, colour, layout, hover, font), render the options on the real page side by side, open the picture on Nika's screen, then ask; a text-only question gets rejected.
metadata:
  type: feedback
  status: confirmed 2026-11-13 (asked for ~8 times in one session)
---

**Rule:** a visual choice is asked with pictures, not words. Render each option
on the *real* page (inject the CSS or token override in Playwright, no file
changes), compose them side by side into one labelled image, open it in the
OS image viewer, *then* ask the question naming the file.

**Why:** 2026-11-13, photo-portfolio, one long session. Nika said "show me
versions, I'll choose" / "give me examples" about eight times (photo height,
photo layout, header height, palette, heading highlight, hover, favicon,
About text). Every time a rendered sheet came first, Nika answered in one
pick. The text-only questions (ASCII previews in the question dialog) were
rejected or bounced to "clarify" five times. Motion (hover) needed a small
local HTML demo with Subtle/Medium/Strong buttons, because a still can't show it.

**How to apply:**
- 2–4 options plus "NOW (live)", each labelled with the measured number
  (px, contrast ratio) and one-line trade-off; desktop and phone if both differ.
- Fake content stays in the preview only (DOM edits in the browser), and say so.
- An image open in the Windows viewer locks the file: write a new filename
  for the next round instead of overwriting.
- Recommend one option, but let the picture do the arguing
  ([[argued-recommendations]]).

**Signal:** a request with a vague amount ("a little smaller", "more cozy",
"highlight it", "make it shiny") or "show me / which one".

**Next time:** don't build first and ask after; render 3 options, open them,
ask once. [[visual-learner-watch-then-do]] [[show-and-explain-new-techniques]]
