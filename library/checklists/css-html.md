---
name: checklist-css-html
description: Reviewer checklist for CSS, HTML and visual UI diffs. Loaded by the reviewer and ui-reviewer agents when a diff touches .css/.scss/.module.css, Tailwind classes, .html, or the markup/styling of components.
metadata:
  type: library
  source: nikabrain synthesis (2026-11-01) from vercel-labs/web-interface-guidelines (MIT) and ui-ux-pro-max (MIT) rules; no session evidence yet
---
# CSS / HTML / visual review checklist

Project tokens, component library and CLAUDE.md win over every item here.

## Broken (blocker)
- Horizontal scroll at 390 px (`scrollWidth > innerWidth`); fixed px widths on containers.
- Text clipped or overlapping; a flex child that won't shrink (missing `min-width: 0`).
- `z-index` fights caused by an unintended stacking context (`transform`, `opacity < 1`, `filter`, `position` + `z-index` on a parent).
- `user-scalable=no` / `maximum-scale=1` (disables zoom).
- `outline: none` with no `:focus-visible` replacement.

## Semantics & accessibility
- Actions are `<button>`, navigation is `<a href>`; no clickable `<div>`/`<span>`.
- Every input has a label (`<label for>` or wrapping); icon-only buttons have `aria-label`; decorative icons `aria-hidden="true"`.
- One `<h1>`, headings in order; landmarks (`header`, `nav`, `main`, `footer`).
- `<img>` has `alt` (empty for decorative) **and** `width`/`height` (prevents layout shift).
- Contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI borders/icons; not colour alone for meaning.
- Touch targets ≥ 44×44 px with ≥ 8 px between them.
- Motion respects `prefers-reduced-motion`.

## Consistency (design system)
- Colours, spacing, radius, shadows and font sizes come from tokens or the scale (CSS custom properties, Tailwind theme), not one-off magic numbers (`margin-top: 13px`, `#3b82f7`).
- Existing shared components reused (Button, Input, Card) instead of a near-copy.
- One spacing rhythm (e.g. 4/8 px steps); related items closer together than unrelated ones.
- Max ~2 font families; a type scale, not arbitrary sizes; body ≥ 16 px; line-height ~1.5 for body.
- Dark mode (if the app has it): tokens switch, not hard-coded colours; `color-scheme` set.

## States
- Hover, `:focus-visible`, active and disabled states exist and differ visibly.
- Loading, empty and error states are designed, not blank; skeletons reserve the final size.
- Long text, very long words or URLs, and 0 / 1 / many items handled (`text-overflow`, `overflow-wrap`, `line-clamp`).

## Layout & responsive
- Mobile-first; layout from flex/grid, not JS measurement.
- Grid for 2-D layout, flex for 1-D; `gap` instead of margins between siblings.
- Readable line length (~45–75 characters, `max-width: 65ch`).
- Container queries or `clamp()` where a component lives in different widths.
- Sticky headers don't cover anchored or focused content (`scroll-margin-top`).

## CSS hygiene
- No `transition: all`; animate `transform`/`opacity` only.
- No `!important` unless overriding third-party CSS (say so in a comment).
- Specificity kept low (classes, not IDs or deep descendant chains); `@layer` order respected if used.
- No unused selectors or duplicated declarations added by the diff.
- Numbers in tables and prices use `font-variant-numeric: tabular-nums`.

## Hierarchy & polish
- One clear primary action per view; secondary actions visually quieter.
- Edges aligned; optical alignment for icons next to text.
- Real copy: specific button labels ("Save changes", not "Submit"), `…` for loading text, error messages with the fix.
