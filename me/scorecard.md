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
| 2026-11-12 | own (photo-portfolio: grid, albums, favicon, background) | 36 rows since 11-09, 3 `no_done` (all 3 build prompts), 1 wrapup; by hand: ~25 prompts, 0 done-lines; answered a 3-question list with "ok"; chose "review then commit" | grid by Nika, albums by Claude ("do it yourself"), 2 commits; caught up on 3 missed sessions (11-09 lesson, 2 mintty config) |
| 2026-11-12 (2) | own (photo-portfolio: JS→TS, cleanup, GitHub) | 6 rows, 3 `no_done` (2 false: both prompts had a "done when"), 1 `vague` ("do it"); by hand: 2/2 build prompts with a done-line (first time), 1 two-option "do it" | strict TS, byte-identical dist; cleanup pixel-identical, tests 60s→13s; repo re-inited by Nika and pushed; caught up on 1 missed session (/absorb + TS lesson) |
| 2026-11-12 (3) | own (photo-portfolio: domain choice + binding) | 21 rows since 18:40, 0 flags, 1 wrapup; by hand: ~20 short questions, 0 build prompts, 6 screenshots sent unprompted | maiagabunia.com bought (Porkbun) and live on Vercel, proven by nslookup + curl 308→200 |
| 2026-11-13 | own (photo-portfolio: milky background, light only, desktop nav) | 11 rows, 1 `no_done`, 1 wrapup; by hand: ~10 prompts, 0 done-lines, but 1 prompt set its own approval gate ("send me screen, not push"); 1 dialog answered (light only) | 3 commits pushed, each proven live by grepping the deployed CSS |
| 2026-11-13 (2) | own (photo-portfolio: walkthrough after the first retro) | 3 prompts, 0 build; by hand: 1 "remember this" (saved as a habit + CORE line), 2 "I can't see it / explain again" | VS Code launch failed silently from Git Bash; fixed via PowerShell + diff tabs |
| 2026-11-13 (3) | own (photo-portfolio: footer, logo, header, About photo + text, palette, 4 real albums, hover, photo viewer, publish shortcuts) | 102 rows, 20 `no_done` (all builds); by hand: ~100 prompts, 0 done-lines, ~8 "show me versions, I'll choose", ~25 "push"; 1 `/tutor` picked then handed back; 5 text-only dialogs rejected | ~25 commits pushed, each proven live by grepping the deployed assets; caught up on 0 missed sessions |
