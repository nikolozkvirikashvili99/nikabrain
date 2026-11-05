---
name: bang-commands-are-copy-paste-ready
description: Commands handed to Nika to paste (with `!`, or into a terminal) must run exactly as pasted. No <placeholder> (PowerShell reserves `<`, bash reads it as a redirect), no ALL-CAPS stand-ins, no trailing question on the same line, one command per block. A value only Nika has goes in as a realistic example plus "change only X".
metadata:
  type: feedback
  status: inherited default (from gigabrain, reworded for Windows; Nika can change it: edit this file and its CORE line)
---

**Rule:** any command Claude gives Nika to paste is the exact line, ready to run.

**Why:** in gigabrain's sessions (2026-10-22, 2026-10-28) a mentor lost five
rounds to syntax: `<mfa>` typed literally died as a redirect, `PASTE_TOKEN_HERE`
ran as is, a question typed after a command broke the pipe, and lines pasted
after a user switch (`sudo -iu`) were swallowed. The same failures happen on
Windows: PowerShell 5.1 rejects `<` ("The '<' operator is reserved for future
use") and Git Bash treats it as a redirect.

**How to apply:**
1. No `<…>` or `{…}` placeholders and no prose after the command. One command per code block.
2. A value Nika must supply: a filled-in realistic example and exactly which part
   to change. If the command will be run more than twice, write a small script
   that checks its input instead.
3. Say which shell it is for: `!` runs in this session's shell; PowerShell has no `&&`.
4. After a parse error, hand back the corrected full line with Nika's value in
   it. Don't re-explain the rule.
5. Long-lived secrets never go into a pasted line. Use a file or an env var the
   command reads, and never echo the value.
6. Anything that opens a new shell (`ssh`, `wsl`, a REPL) goes in its own block.
7. `!` runs once and exits: `! npm test` gives one Vitest run, not watch mode
   (2026-11-05: Claude suggested it for "live re-runs on save", and it wasn't).
   Watch modes and dev servers belong in Nika's own VS Code terminal.

**Signal:** Claude is about to write a command for Nika to paste.

Related: [[secrets-land-in-readme]]
