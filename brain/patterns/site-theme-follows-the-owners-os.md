---
name: site-theme-follows-the-owners-os
description: A site with `prefers-color-scheme` dark mode shows its owner whatever their OS theme is; on a dark OS they never see the light design they just asked for. Ask "light only, follow the device, or a toggle?" when a light colour change comes in.
metadata:
  type: project
  status: confirmed 2026-11-13
---

**Rule:** before changing a light-theme colour on a site that follows
`prefers-color-scheme`, check which theme the owner actually sees. Their
OS setting decides it, not the site.

**Why:** 2026-11-13. Nika asked for a milky white background. Claude
changed only the light tokens, which was correct, but Nika's Windows was set
to dark, so their next message was "why I have dark mode all the time?".
One question (light only / toggle / follow the device) settled it.
Nika picked light only.

**How to apply:**
- With a light-colour request, add one line: "you'll only see this if your
  device is set to light. Should the site be light only?"
- Light only = delete the dark `@media` block *and* set `color-scheme: light`
  (otherwise scrollbars and form controls still go dark).
- Prove it with Playwright `colorScheme: 'dark'`: the background must still be
  the light value.
- Leave a favicon's own dark switch alone: it follows the browser tab bar,
  not the page.

**Signal:** "the site is always dark", "I don't see my change", or a light-only
colour request on a site that has dark tokens.
**Next time:** ask the theme question in the same reply as the first colour change.
Related: [[outward-claims-carry-their-proof]], [[commits-are-the-users-call]].
