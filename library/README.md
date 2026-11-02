# library/: imported knowledge, not yet earned

`brain/` holds what Nika and Claude learned the hard way: corrections,
incidents, verified results. `library/` holds what we **read**: public skills
and review checklists, pinned to an upstream commit. A library entry is a
textbook chapter. It only becomes knowledge once a real session shows it
working (evidence in `brain/library-ledger.md`).

| Path | What | Written by |
|---|---|---|
| `skills/<name>/` | skills, linked into `~/.claude/skills/` by `bin/install.mjs` | `/absorb` (`bin/absorb.mjs`) |
| `checklists/<topic>.md` | what the `reviewer` / `ui-reviewer` agents check per diff | `/absorb`, by hand |
| `sources.json` | each source: repo, licence, pinned commit, folder mapping, replace rules, skip reasons | `/absorb` |
| `NOTICE.md` | upstream licences and credits | `/absorb` |
| `../brain/library-ledger.md` | confidence + dated evidence per entry | `/retro`, `/curate` |

## What's in it (2026-11-01)

| Skill | From | Use it for |
|---|---|---|
| `ui-ux-pro-max` | nextlevelbuilder (MIT) | design systems (style, palette, fonts, spacing) via a local search script; UX rules by priority |
| `frontend-design` | Anthropic (Apache-2.0) | distinctive, non-generic visual direction for a new page or app |
| `web-design-guidelines` | Vercel (MIT) | the rule set for reviewing UI code (a11y, focus, forms, motion, copy…) |
| `react-best-practices` | Vercel (MIT) | performance: waterfalls, bundle size, re-renders (one rule per file in `rules/`) |
| `composition-patterns` | Vercel (MIT) | compound components, avoiding boolean-prop explosions, React 19 APIs |
| `react-view-transitions` | Vercel (MIT) | page/element transitions with the View Transition API |
| `react-patterns` | ECC via gigabrain (MIT) | components, hooks, state, data fetching, forms |
| `react-testing` | ECC via gigabrain | React Testing Library, Vitest/Jest, MSW |
| `e2e-testing` | ECC via gigabrain | Playwright: page objects, flaky tests, CI |
| `accessibility` | ECC via gigabrain | WCAG 2.2, keyboard, ARIA, contrast |
| `make-interfaces-feel-better` | ECC via gigabrain | polish: micro-interactions, motion, optical details |
| `visual-explainer` | nicobailon via gigabrain (MIT) | diagrams and explainer pages (used by `/teach`) |
| `next-dev-loop` | Vercel / Next.js repo (MIT) | prove a Next.js change at runtime: `/_next/mcp` + `agent-browser` (Next 16.3+, Turbopack) |
| `next-bundle-optimizer` | Vercel / Next.js repo (MIT) | slow route startup, oversized client bundles, duplicate browser deps (`next analyze`) |
| `next-cache-components-adoption`, `-optimizer` | Vercel / Next.js repo (MIT) | turn on Cache Components and fix blocking routes; then grow the static shell, guarded by `instant()` e2e tests |
| `next-partial-prefetching-adoption`, `-optimizer` | Vercel / Next.js repo (MIT) | turn on Partial Prefetching; choose what a navigation prefetches (Next 16.3+) |
| `production-audit` | ECC via gigabrain (MIT) | "what breaks in prod?" before a launch or after a big merge, from local evidence only |
| `verification-loop`, `search-first`, `secure-coding`, `inherit-legacy-style`, `council` | ECC via gigabrain | proving work, research before code, web security, matching an old codebase's style, multi-voice decisions |

## Rules

- **Never hand-edit an absorbed skill.** Add a `replace` pair to
  `sources.json` `edits.<skill>` and re-run `node bin/absorb.mjs pull <source>`,
  so an upstream update loses nothing. (`frozen` sources were adapted by
  gigabrain; `vendored` ones were transformed by hand: see `sources.json`.)
- **Project conventions win.** A library skill is a general default. When a
  project's CLAUDE.md or its existing code disagrees, follow the project and
  record it as ledger evidence (confidence 0).
- **Every global skill costs context in every session** (its description is
  always loaded). Add a skill when a real task shows the gap, not on spec
  ([[import-knowledge-on-demand]]).
- **Licences travel with the content.** Each new source gets a NOTICE entry.

## Confidence

Every entry starts at **0.4** (plausible, unproven). `/retro` moves it:

| Event in a real session | Change |
|---|---|
| used, and its advice held up | +0.1 |
| used, and its advice was wrong or outdated | −0.2, row marked `needs-edit: …` |
| the project's own convention differed (and rightly won) | 0, evidence line only |

- **≥ 0.7 with evidence from 2+ projects:** `/curate` distils the *earned*
  rule into `brain/patterns/`.
- **< 0.3, or no evidence 90 days after `Added`:** `/curate` asks whether to retire it.
