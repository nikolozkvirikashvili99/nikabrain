# AI-usage scorecard

Re-scored **monthly** by `/curate` with Nika, from evidence (prompts, the
coach signals, transcripts), never from gut feeling. The trend matters, not a
single number. Scores run 0–10. The first score is taken at the first
`/curate` after ~2 weeks of sessions.

| # | Dimension | Target behaviour |
|---|---|---|
| 1 | Intent in prompts | the goal, the user and the constraints are in the first message |
| 2 | Customisation (memory, skills) | nikabrain loaded everywhere; project CLAUDE.md files filled in |
| 3 | Done-criteria & verification | every task has "done when…" and ends with shown proof |
| 4 | Debugging style | expected / actual / what changed / a hypothesis; Claude reproduces first |
| 5 | Context management | one goal per session; `/clear` between tasks; plan mode for big changes |
| 6 | Parallel work | subagents and background reviews routinely; a worktree when halves are independent |
| 7 | Enforcement | rules that must hold are hooks or permissions, not reminders |
| 8 | Review pass | `reviewer` / `ui-reviewer` / `/code-review` on non-trivial diffs |
| 9 | UI quality loop | design system first, screenshots at 2 widths, a11y checked |
| 10 | Automation | at least one recurring job (`/schedule`, `claude -p`) doing real work |
| 11 | Learning from AI | `/tutor` and `/teach` used; concepts move up on evidence |

## Monthly history

| Month | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-11-02 | nikabrain (own tooling) | none logged: hooks were installed at the end of the session; by hand: 4 prompts, 0 done-lines, 1 big spec | learning/ ported from gigabrain; install applied; first commit |

## Sessions (one row per `/retro`)

| Date | Project | Signals (from `inbox/signals.jsonl` since the last row) | Note |
|---|---|---|---|
| 2026-11-09 | own (photo-portfolio, 5-min micro-lesson) | 3 rows, 0 flags; by hand: 3 prompts, no build prompt (no done-line needed) | asked for one bite of learning before sleep: grid auto-fill/minmax/min() |
| 2026-11-02 | nikabrain (library growth) | 4 rows, 0 flags; by hand: 5 prompts, 0 done-lines, 3 were approvals | absorbed 6 Next.js skills + 3 gigabrain items |
| 2026-11-03 | own (photo-portfolio, started from nikabrain) | 7 rows, 1 flag (`no_done` on the learn-while-building message); by hand: 8 prompts, 0 done-lines; the dialog was rejected once, and plain-text answers came back in one line | scaffold done, paused before cleanup |
| 2026-11-05 | own (photo-portfolio) | 40 rows, 2 `no_done`, 3 `research` (all 3 false positives: concept questions); by hand: 0 done-lines, 1 self-written better prompt, 1 screenshot sent for a bug | skeleton + Header + menu + socials + phone; onboarded; first /tutor |
| 2026-11-02 | nikabrain (learning plan) | 9 rows, 0 flags (incl. 2 missed one-prompt `claude doctor` sessions); by hand: 7 prompts, 0 done-lines; 2 question dialogs rejected | 8-week learning rhythm agreed; plain-text questions work better than the dialog |
| 2026-11-05 | nikabrain (Q&A: where to work, phone access, /curate) | 6 rows, 0 flags; by hand: 6 short questions, 0 build prompts, 1 Georgian sign-off ("რეტრო") | advice on opening Claude in the project folder was followed the same evening |
