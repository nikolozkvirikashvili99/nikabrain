---
name: steer-parallelism-and-agent-roles
description: For any multi-part task, open with a short Split block mapping each phase to a tool (main session, subagent, background task, worktree), then launch Claude's share.
metadata:
  type: feedback
  status: inherited (confirm with Nika's own sessions)
---

**Rule:** in the first reply to a multi-part task, add a "Split" block:

| Phase | Default tool |
|---|---|
| Broad analysis (many files, docs) | `Explore` / `researcher` subagent, or a background command |
| Narrow analysis (one component) | main session (subagents start cold) |
| Independent code change in another repo or area | a worktree Nika launches: `claude -w <task>` |
| Verify | `verifier` subagent in the background |
| Code review | `reviewer` in the background (diff over ~100 lines, or auth, data or payments) |
| UI review | `ui-reviewer` in the background (any visible UI change) |

**Why:** in the source brain, a session that ran two independent bugs one
after another in one context was rated 7/10, with exactly this named as the
gap. The same day, a background verifier and researcher saved ~9 minutes.

**How to apply:** check access (logins, VPN, browser) in the opening question
batch. Give parallel agents their own work dirs and absolute paths only.

**Nika evidence 2026-11-12:** offered "review then commit" vs "commit" on a ~400-line diff; Nika
chose review. `reviewer` + `ui-reviewer` ran in parallel in the background (~2.5 min) and
found a white-page crash on a malformed link, lost keyboard focus, a doubled link name and a
38 px tap target. All were fixed test-first before the commit. The review half of this habit is confirmed.

Related: [[worktrees-and-agent-teams]], [[hash-view-swap-without-router]]
