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
| 2026-11-02 | nikabrain (library growth) | 4 rows, 0 flags; by hand: 5 prompts, 0 done-lines, 3 were approvals | absorbed 6 Next.js skills + 3 gigabrain items |
| 2026-11-03 | own (photo-portfolio, started from nikabrain) | 7 rows, 1 flag (`no_done` on the learn-while-building message); by hand: 8 prompts, 0 done-lines; the dialog was rejected once, and plain-text answers came back in one line | scaffold done, paused before cleanup |
| 2026-11-02 | nikabrain (learning plan) | 9 rows, 0 flags (incl. 2 missed one-prompt `claude doctor` sessions); by hand: 7 prompts, 0 done-lines; 2 question dialogs rejected | 8-week learning rhythm agreed; plain-text questions work better than the dialog |
