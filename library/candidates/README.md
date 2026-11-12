# library/candidates: studied, not (yet) absorbed

Scouting results, so the next `/absorb` does not redo the work. Facts come from the
GitHub API (stars, last push, licence) plus reading the cloned files. Clones are in
`~/.cache/nikabrain/upstream/<name>` (untrusted: nothing in them was run).

## Scout 2026-11-12: UI/UX design skills

Baseline before the scout: `ui-ux-pro-max` (design systems), `frontend-design` (visual
direction), `web-design-guidelines` (review rules), `make-interfaces-feel-better`
(polish, ECC's salvaged copy), `accessibility`, `react-view-transitions`.
**Gaps:** no skill for Core Web Vitals / image LCP, SEO and metadata, motion
*performance*, critique/audit **commands** for an existing page, or DESIGN.md documentation.

| Repo | Stars | Pushed | Licence | Commit at clone | Tier |
|---|---|---|---|---|---|
| pbakaus/impeccable | 108.7k | 2026-11-12 | Apache-2.0 | b4bff162 | absorb (adapted) |
| addyosmani/web-quality-skills | 3.1k | 2026-08-24 | MIT | afa8da94 | absorb (subset) |
| ibelick/ui-skills | 11.0k | 2026-11-12 | MIT | ba966a3a | absorb (subset) |
| jakubkrehel/make-interfaces-feel-better | 4.0k | 2026-08-29 | MIT | 35545ea1 | re-source (replace ECC copy) |
| Dammyjay93/interface-design | 6.0k | 2026-06-20 | MIT | 2f9be320 | later: when taskboard (an app) starts |
| Leonxlnx/taste-skill | 113.9k | 2026-11-08 | MIT | f6b76575 | read only: do not install |
| google-labs-code/stitch-skills | 8.7k | 2026-08-17 | Apache-2.0 | (not cloned) | not studied: Stitch-tool specific |
| raphaelsalaja/userinterface-wiki | 0.9k | 2026-07-29 | MIT | (not cloned) | not studied |
| cuellarfr/design-skills | 0.1k | 2026-09-30 | MIT | (not cloned) | not studied: low signal |

## Per-item triage

### impeccable (pbakaus): take `impeccable`, adapted
- Successor to Anthropic's `frontend-design` (built on it), plus 23 sub-commands:
  `critique`, `audit`, `polish`, `layout`, `typeset`, `adapt`, `animate`, `harden`, `clarify`, `document`…
  Its "Experience" mode explicitly covers **portfolios and galleries** (photo-portfolio).
- **Risk:** `scripts/impeccable` launcher **downloads a platform binary on first run**.
  It also offers a detector hook. Both conflict with "confirm installs first".
- **Adaptation:** `exclude: ["scripts"]` + replace rule so Setup goes straight to the
  documented "Launcher unavailable" path (read PRODUCT.md / DESIGN.md directly).
- **Overlap:** `frontend-design` (keep for now; retire it at `/curate` if impeccable wins
  the ledger). `ui-ux-pro-max` stays: it has the searchable palette and font data.
- Upstream path: `.claude/skills/impeccable` (the 20 other dot-folders are the same skill for other agents).

### web-quality-skills (addyosmani): take `core-web-vitals`, `seo`, `performance`
- Fills real gaps: LCP/CLS/INP with field + lab evidence, image loading, meta tags,
  structured data. Directly relevant to an image-heavy portfolio.
- Rename on absorb: `performance` → `web-performance` (generic name).
- Skip `accessibility` (we have one), `best-practices` (overlaps `secure-coding`),
  `web-quality-audit` (its `analyze.sh` needs `jq`, a grep-level HTML check; low value over the above).

### ui-skills (ibelick): take `fixing-motion-performance`, `fixing-metadata`
- Small, single-file, stack-agnostic rule lists ("quote the line, why, fix" review format).
- Skip `baseline-ui`: **mandates Tailwind, `cn`, motion/react**, which conflicts with plain-CSS
  projects (photo-portfolio CLAUDE.md: "no Tailwind"). Rules worth keeping already exist
  in `web-design-guidelines`.
- Skip `fixing-accessibility` (overlap), `component-canvas`/`create-canvas` (exploration toys),
  `ui-skills-root` (needs their CLI), `improve-ui` (overlaps impeccable `critique`).
- Maybe later: `create-design-md` (if impeccable's `document` doesn't cover it).

### make-interfaces-feel-better (jakubkrehel): re-source
- This is the original upstream of ECC's frozen copy. Upstream is far richer: adds
  `animations.md`, `icons.md`, `performance.md`, `surfaces.md`, `typography.md`, and is
  explicit about "use the project's existing styling system" (plain CSS stays plain CSS).
- Switch the skill's source from `ecc` (frozen) to this repo (mode `pull`); keep its ledger row.

### interface-design (Dammyjay93): later
- Good, but scoped to dashboards/admin/SaaS ("not for landing pages or marketing").
  Overlaps impeccable's Operate mode. Re-check when the taskboard lab starts.

### taste-skill (Leonxlnx): read only
- 39 MB, 1,600+ files, 150+ scripts, needs Node 22 + Chrome.
- Its frontmatter installs a **Stop hook that runs `node gate.mjs` after every turn**.
- House rules override the project (one section per screen, no image captions, rewrites
  contacts to `.example`), which conflicts with "project conventions win". Not absorbable as is;
  maybe mine ideas by hand later.

## Outcome (2026-11-12)

Absorbed with Nika's OK: `impeccable`, `core-web-vitals`, `seo`, `web-performance`,
`fixing-motion-performance`, `fixing-metadata`; `make-interfaces-feel-better` re-sourced from
jakubkrehel. Entries, pins, replace rules and skip reasons now live in `../sources.json`.
Still candidates: interface-design (later), taste-skill (read only).
