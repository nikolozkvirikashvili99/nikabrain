---
name: svg-comments-forbid-double-hyphen
description: An SVG file is XML, and `--` inside an XML comment is illegal, so a comment mentioning a CSS custom property (`--color-text`) silently breaks the whole SVG (broken-image icon, no console error).
metadata:
  type: feedback
---

**In short:** never write `--` inside `<!-- … -->` in an `.svg` file (favicon, icon, inline asset).

A comment like `<!-- colours copied from --color-text -->` makes the SVG invalid XML.
The browser shows a broken image (or keeps the old favicon) and logs nothing useful;
the dev server still serves it with `200 image/svg+xml`.

**Why:** 2026-11-12, a camera favicon with a comment naming the `--color-text` token
rendered as a broken image in Edge. Rewording the comment ("the color-text token") fixed it.

**How to apply:** when an SVG comment needs to name a CSS variable, drop the dashes.
Prove an SVG by rendering it in an `<img>` from an HTML page (Playwright can't
`setContent` while the page is the SVG document itself), not by the HTTP status.

**Signal:** writing comments in a hand-made SVG, especially in a project that uses design tokens.

**Next time:** grep the SVG for `--` between the comment markers before calling it done.

Related: [[prove-the-built-artifact-runs]]
