# Track 0: working with Claude

One drill per session, on **real work**, not toy examples. Each drill has a
done-criterion, because practising that is itself drill 2. Tick it, then
`/retro`. (Adapted from gigabrain's Track 0.)

| # | Drill | Feature | Done when | ✔ |
|---|---|---|---|---|
| 1 | Onboard your main repo | `/onboard-project` | it has a lean CLAUDE.md; your next task there needs zero re-explained conventions | |
| 2 | Prove it | done-criteria | 5 tasks in a row started with "Done when…" and ended with shown proof | |
| 3 | Plan first | plan mode (Shift+Tab) | one multi-file change where you corrected the plan *before* any code was written | |
| 4 | Look at it | screenshots | a UI task finished with screenshots at 390 px and desktop that *you* asked for up front | |
| 5 | Design system first | `ui-ux-pro-max --design-system` | a new page started from generated tokens (colour, type, spacing), not from ad-hoc values | |
| 6 | Second opinion | `ui-reviewer`, `reviewer`, `/code-review` | a review found a real issue in a diff you were about to accept | |
| 7 | Two at once | `claude -w <task>` (worktree) | two independent tasks progressed in parallel sessions in the same hour | |
| 8 | Enforce, don't remind | hooks + permissions | a rule you care about (format on save, no `--no-verify`) is a hook, not a memory | |
| 9 | Debug like a pro | `debug-protocol` | one bug reported as expected/actual/hypothesis, fixed red → green | |
| 10 | Write the core | `/tutor` | one hook or reducer written by you, explained back without notes | |
| 11 | Headless | `claude -p`, `/schedule` | a script calls `claude -p` for a real job | |

## Staying current (monthly, ~30 min, or ask the `researcher` agent)

- Claude Code changelog: features you aren't using yet
- react.dev blog, Vite and Tailwind release notes
- `anthropics/skills`, `vercel-labs/agent-skills`, `ui-ux-pro-max-skill`: run `/absorb --update`

Write one line per new practice you adopt into `ai-craft/prompt-log.md`.
