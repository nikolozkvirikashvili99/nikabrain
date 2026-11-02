---
name: tooling-runs-on-windows
description: "Nika works on Windows 11: nikabrain tooling is Node (.mjs), not bash/python; Claude's Bash tool is Git Bash, PowerShell is 5.1 (no &&, ||, ?:); directory links use junctions (no admin needed), file symlinks need Developer Mode, so ~/.claude/CLAUDE.md is a generated @import file instead."
metadata:
  type: project
  origin: written for nikabrain 2026-11-01 (replaces gigabrain's mac/linux + zsh entries)
---

**In short:** write tooling in Node, link directories with junctions, and
pick one shell per command.

- **Node, not bash or python.** gigabrain's hooks were Python + bash and used
  `os.getuid()`, `readlink -f` and `/tmp`, none of which work on Windows.
  nikabrain's hooks and `bin/` are `.mjs` with no dependencies, so they run
  wherever Claude Code's Node runs, and they're in Nika's own language.
  (Python 3.14 is installed; it's only needed by the `ui-ux-pro-max` search script.)
- **Two shells.** Claude's Bash tool is Git Bash (POSIX, `/c/Users/...` paths).
  The PowerShell tool is Windows PowerShell 5.1: no `&&`/`||` (use
  `A; if ($?) { B }`), and no ternary or `??`.
- **Heredocs with apostrophes broke in the Bash tool** (2026-11-01, while
  building nikabrain: `unexpected EOF while looking for matching '`). For
  multi-file writes, use the Write tool, or a Node script.
- **Links:** `fs.symlinkSync(target, path, 'junction')` works for directories
  without admin rights. File symlinks need Developer Mode or admin, so
  `bin/install.mjs` writes `~/.claude/CLAUDE.md` as a 3-line file that
  `@import`s `brain/CORE.md`, and links `agents/` as a directory junction.
- **Paths in hook commands:** use forward slashes and quotes
  (`node "C:/Users/qartv/projects/nikabrain/global/hooks/coach.mjs"`). They
  work in both shells.
- **Stopping a dev server:** see [[kill-by-port-not-pkill-f]] (Windows section).

**Signal:** writing a script, hook or one-liner for Nika's machine.
**Next time:** default to Node or a PowerShell-safe one-liner, and test it here before handing it over.
