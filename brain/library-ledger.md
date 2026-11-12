---
name: library-ledger
description: Confidence and dated evidence for every library entry (skills, reviewer checklists). /retro adds evidence when an entry is used in a real session; /curate promotes (≥0.7, 2+ projects) or retires (<0.3, or 90 days with no evidence) entries.
metadata:
  type: reference
---

Rules: `library/README.md`, section Confidence. Start 0.4 · held up +0.1 ·
wrong/outdated −0.2 + `needs-edit: …` · project convention won 0.
Evidence is one dated, generalised line: no employer/client names, URLs or code.
Rows copied from gigabrain restart at 0.4: its evidence was about another
person's projects. (gigabrain had moved all of them off "global" for lack of
measured lift over plain Claude; nikabrain makes the frontend set global again
because it *is* Nika's daily stack. Watch for that lift here.)

| Entry | Source | Added | Confidence | Evidence (date · project kind · what happened) |
|---|---|---|---|---|
| skill `ui-ux-pro-max` | ui-ux-pro-max | 2026-11-01 | 0.4 | — |
| skill `frontend-design` | anthropic-skills | 2026-11-01 | 0.4 | — |
| skill `web-design-guidelines` | vercel-web-interface-guidelines | 2026-11-01 | 0.4 | — |
| skill `react-best-practices` | vercel-agent-skills | 2026-11-01 | 0.4 | — |
| skill `composition-patterns` | vercel-agent-skills | 2026-11-01 | 0.4 | — |
| skill `react-view-transitions` | vercel-agent-skills | 2026-11-01 | 0.4 | — |
| skill `react-patterns` | ecc | 2026-11-01 | 0.4 | — |
| skill `react-testing` | ecc | 2026-11-01 | 0.4 | — |
| skill `e2e-testing` | ecc | 2026-11-01 | 0.4 | — |
| skill `accessibility` | ecc | 2026-11-01 | 0.4 | — |
| skill `make-interfaces-feel-better` | make-interfaces-feel-better | 2026-11-01 | 0.4 | 2026-11-12 · re-sourced from original upstream (ECC copy was thinner) |
| skill `visual-explainer` | visual-explainer | 2026-11-01 | 0.4 | — |
| skill `verification-loop` | ecc | 2026-11-01 | 0.4 | — |
| skill `next-dev-loop` | nextjs | 2026-11-02 | 0.4 | — |
| skill `next-bundle-optimizer` | nextjs | 2026-11-02 | 0.4 | — |
| skill `next-cache-components-adoption` | nextjs | 2026-11-02 | 0.4 | — |
| skill `next-cache-components-optimizer` | nextjs | 2026-11-02 | 0.4 | — |
| skill `next-partial-prefetching-adoption` | nextjs | 2026-11-02 | 0.4 | — |
| skill `next-partial-prefetching-optimizer` | nextjs | 2026-11-02 | 0.4 | — |
| skill `production-audit` | ecc | 2026-11-02 | 0.4 | — |
| skill `search-first` | ecc | 2026-11-01 | 0.4 | — |
| skill `secure-coding` | ecc | 2026-11-01 | 0.4 | — |
| skill `inherit-legacy-style` | ecc | 2026-11-01 | 0.4 | — |
| skill `council` | ecc | 2026-11-01 | 0.4 | — |
| skill `impeccable` | impeccable | 2026-11-12 | 0.4 | — |
| skill `core-web-vitals` | web-quality-skills | 2026-11-12 | 0.4 | — |
| skill `seo` | web-quality-skills | 2026-11-12 | 0.4 | — |
| skill `web-performance` | web-quality-skills | 2026-11-12 | 0.4 | — |
| skill `fixing-motion-performance` | ui-skills | 2026-11-12 | 0.4 | — |
| skill `fixing-metadata` | ui-skills | 2026-11-12 | 0.4 | — |
| checklist `react.md` | ecc | 2026-11-01 | 0.5 | 2026-11-12: own React SPA review, flagged lost focus on view swap and untested effects; held up |
| checklist `typescript.md` | ecc | 2026-11-01 | 0.4 | — |
| checklist `silent-failures.md` | ecc | 2026-11-01 | 0.5 | 2026-11-12: own React SPA review, caught `decodeURIComponent` throwing in render (blank page); held up |
| checklist `tests.md` | ecc | 2026-11-01 | 0.4 | — |
| checklist `security.md` | ecc | 2026-11-01 | 0.4 | — |
| checklist `types.md` | ecc | 2026-11-01 | 0.4 | — |
| checklist `css-html.md` | nikabrain | 2026-11-01 | 0.5 | 2026-11-12: own React SPA CSS cleanup review, cascade/specificity check of moved rules matched pixel-identical screenshots; held up |
