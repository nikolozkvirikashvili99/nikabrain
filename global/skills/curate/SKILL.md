---
name: curate
description: Weekly deep-clean of the nikabrain brain. Promote or discard inbox candidates, confirm or drop inherited gigabrain entries, prune stale ones, re-score Nika's scorecard monthly, promote or retire library skills by ledger evidence, and run the health checks. Use when Nika says /curate, "curate the brain", "clean up the brain", "process the inbox", or when a session-start note says candidates are waiting.
---

# Curate the brain

The brain is what every future session reads first, so every line costs
attention in every project. **Your job is mostly to say no.** A good run
promotes 0–3 things and prunes more than it adds. `N` = `~/projects/nikabrain`.

## 1. Load

- `N/brain/CORE.md`; names + descriptions of `N/brain/habits/` and
  `N/brain/patterns/` (open a file only when a candidate overlaps it).
- Every `N/inbox/*.md` candidate.

## 2. Judge each candidate

All four must hold: **reusable · evidenced · changes behaviour · new**.

| Candidate | Goes to |
|---|---|
| habit | `brain/habits/<slug>.md` (+ one CORE line *only* if it shapes every session) |
| pattern | `brain/patterns/<slug>.md` |
| prompt lesson | `ai-craft/prompt-log.md` |
| concept | `me/concepts.md` row (raise only with evidence) |
| project fact | that project's memory dir. Work projects stay local, never in `N` |
| anything else | delete |

Overlap → merge into the existing entry; never create a sibling.

## 3. Inherited entries (until none are left)

List every entry with `status: inherited` or `origin: gigabrain`. For each:
- Confirmed by Nika's sessions (search `me/journal/`, the scorecard and the
  ledger) → set `status: confirmed <date>`.
- Contradicted → rewrite to Nika's way, or prune it (step 5).
- Never come up, and it's 60+ days since setup → "Ask Nika: keep?".
Patterns about stacks Nika never touches are prune candidates once 60 days pass.

## 4. Scorecard, concepts, profile

- **Monthly (first curate of the month):** re-score `me/scorecard.md` with
  Nika from evidence (`node N/bin/signals-report.mjs`, journal, session rows).
  Quote the evidence for each score in one line.
- `me/concepts.md`: list concepts with evidence this period; propose the next
  step for the two weakest (a `/teach` lesson or a `/tutor` exercise).
- `me/profile.md`: fold in repeated preferences from the journal.

## 5. Prune (every run)

- CORE.md over ~100 lines: merge lines or move the weakest into their entry files.
- Contradicted by newer evidence: fix or prune, and say so.
- Untouched 90+ days with no evidence: list for Nika as "still true?". Never delete silently.
- **Soft prune:** `git mv` to `N/brain/_attic/YYYY-MM-DD/` and append
  `YYYY-MM-DD · moved <path> → _attic/… · why · undo: git mv <back>` to
  `N/me/curate-log.md`. At most ~20 per run, each listed separately.
- **Library** (`brain/library-ledger.md`, rules in `library/README.md`):
  confidence ≥ 0.7 with evidence from 2+ projects → distil the *earned* rule
  into `brain/patterns/<slug>.md` and link it from the ledger row.
  Below 0.3, or no evidence 90 days after `Added` → "Ask Nika: retire?"
  (on a yes, delete the skill folder and its `sources.json` entry, and mark the
  ledger row retired). Rows marked `needs-edit` → suggest `/absorb --update`.

## 6. Health and hand-over

- `node N/bin/doctor.mjs` (install links, CORE budget, frontmatter, library
  vs NOTICE/sources) and `node N/bin/secret-scan.mjs --all`. Quote their
  summary lines.
- Delete processed inbox files. **Don't commit**; report:

```
Promoted (n):  <title> → <path>   (the bar it cleared)
Merged (n):    <title> → <existing entry>
Inherited:     confirmed n · rewritten n · pruned n · still open n
Discarded (n): <one reason per kind>
Pruned:        <what and why>
Library:       <promoted / to retire / needs-edit>
Health:        doctor <errors/warnings> · secret scan <clean/n> · CORE <lines>
Ask Nika:      <yes/no questions>
```
