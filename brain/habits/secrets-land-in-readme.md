---
name: secrets-land-in-readme
description: Scan READMEs, notes and env/config files in the diff before handover; report file:line and key name only, never the value. Frontend env vars (VITE_, NEXT_PUBLIC_, REACT_APP_) ship to the browser, so a secret there is public.
metadata:
  type: feedback
  status: inherited (source brain: 5 times, 4 projects)
---

**Rule:** before handover, scan every README, notes file and config in the
diff for credentials. Report *that* something is there and where, never the
value. For frontend work this includes `.env`, `.env.local`, `vite.config.*`,
and any `VITE_`, `NEXT_PUBLIC_` or `REACT_APP_` key: **those are bundled into
the shipped JavaScript, so they are public by design.** A secret there is a
leak even if `.env` is gitignored.

**Why:** the natural way to document "the command I ran" is to paste it with
its arguments, and the token goes along with it.

**How to apply:**
1. `node ~/projects/nikabrain/bin/secret-scan.mjs <files>` prints file:line + pattern name only.
2. For an unknown file, print its shape (line number, length, text before the
   first `=` or `:`), never a "masked" copy.
3. Fix: use placeholders like `<api-key>`. A real secret in a frontend env var
   moves behind a server or edge function.
4. If a value leaked anyway, say so and recommend rotating it.
