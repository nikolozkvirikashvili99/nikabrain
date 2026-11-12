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
  Same root cause, 2026-11-05: a JS template literal inside `node -e "…"`
  lost its `${site.name}` (bash expanded it to nothing, giving `aria-label={}`).
  Code with `${}` or backticks goes in a script *file* (Write tool), never in an
  inline double-quoted `node -e`.
  Same root cause, 2026-11-12: a `'\r\n'` written through a bash heredoc into a
  Node script arrived as real line breaks (SyntaxError). Avoid escapes that pass
  through two languages: `String.fromCharCode(13, 10)`.
- **Files are CRLF after a git checkout or merge** (`core.autocrlf=true`): 2026-11-12, an
  edit script's multi-line `
` patterns matched nothing after a merge, while one-line
  patterns still worked. Edit scripts: normalise CRLF→LF on read, write back the file's
  own line ending, and fail when a pattern doesn't match exactly once.
- **Vitest workers crash on Nika's 8 GB machine** (2026-11-05): with VS Code,
  the dev server and Edge open, free RAM was ~1.1 GB, and the default pool
  (one jsdom worker per core, 4) died at startup with `Worker exited
  unexpectedly with exit code 134`. Only some test files ran, so the summary
  showed fewer tests, not failures. Fix: `test: { maxWorkers: 1 }` in
  `vite.config.js` (3/3 clean runs after). Watch for a test *count* drop.
  With one worker the suite was slow (60s, 75% creating jsdom per file); adding
  `pool: 'vmThreads'` (still one worker) took it to 13s, 39/39, and keeps each file
  isolated (`isolate: false` was equally fast but shares state) (2026-11-12).
- **Opening VS Code for Nika:** `code .` in the repo, not `code path/file.jsx`.
  A single file opens with no Explorer tree, and Nika couldn't find
  `src/data/` (2026-11-05).
- **Screenshots without a Playwright dep:** `npm i playwright-core` in the
  scratchpad + `chromium.launch({ channel: 'msedge' })` drives the installed
  Edge, so there's no browser download (2026-11-05).
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
