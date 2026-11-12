---
name: prove-refactors-against-a-baseline
description: For a change that must not change behaviour (JS→TS migration, cleanup, CSS dedupe), capture the build output and screenshots BEFORE touching code, then require byte-identical dist hashes and pixel-identical screenshots after. Allowed differences are listed up front.
metadata:
  type: feedback
  origin: Nika's sessions (2026-11-12, photo-portfolio)
---

**Rule:** "it still works" is not proof for a behaviour-preserving change. Snapshot the
baseline first, then diff against it; tests only cover what someone thought to test.

1. **Before any edit:** build, hash every file in `dist/` (`sha256sum`, sorted), copy
   `dist/` to the scratchpad, record the test count, take screenshots (390/1280 ×
   light/dark × each page). Also any state screenshots won't show: open menu, hover,
   `reducedMotion: 'reduce'` computed styles.
2. **After:** same commands, then `diff` the hashes and `cmp` the PNGs. Serve the old
   `dist/` on a second port (`vite preview --outDir <baseline> --port 4174`) to compare
   states side by side.
3. **Name the allowed differences up front** (e.g. "only the tab title changes"), so any
   other diff is a bug, not noise.

**Why:** 2026-11-12, photo-portfolio. JS→TS in strict mode: by fixing 26 strict errors with
*erasable syntax only* (annotations, `import type`, `!`; never a runtime null check), all
37 dist files came out byte-identical, which proved zero behaviour change in one line.
The later CSS cleanup (merged rules, header onto `.container`, merged reduced-motion
blocks) moved cascade order; 12/12 pixel-identical screenshots (incl. open menu, hover)
proved it. The reviewer had nothing blocking.

**How to apply:** migrations, refactors, cleanups, dependency bumps that "shouldn't change
anything". For deliberate UI changes use normal screenshots instead.
**Signal:** "output the same", "baseline to", "don't change anything", "optimize/clean up".
**Next time:** offer "byte-identical dist + pixel-identical screenshots" as the
recommended done-line, and capture the baseline before the first edit.

Related: [[regenerate-goldens-narrowly]] (when the change *is* intended),
[[prove-the-built-artifact-runs]], [[outward-claims-carry-their-proof]].
