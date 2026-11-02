---
name: onboard-project
description: Bring a repo into Nika's nikabrain setup. Interview once, detect the stack and real commands, write a lean CLAUDE.md (commands, conventions, design system, done-means, never, gotchas), wire its memory, add ask-first rules for risky scripts, and register it in nikabrain/labs.md. Use when Nika says /onboard-project, "set this project up", "write a CLAUDE.md here", or starts working in a repo that has no CLAUDE.md.
---

# Onboard a project

Every prompt where Nika re-explains a convention ("we use CSS modules, not
Tailwind") is a CLAUDE.md line that didn't exist yet. This skill writes it once.
`N` = `~/projects/nikabrain`.

## 1. Interview (one batch)

Ask together: own project, learning lab, or **work** (employer/client:
confidential)? Is there a team CLAUDE.md already? Anything Claude must never
touch (prod config, branches, deploy scripts)? Up to 3 rules that must never
break (e.g. "prices always come from the API, never computed client-side")?

## 2. Detect (read, don't ask)

Use an `Explore` subagent for the sweep, then confirm 2–3 files yourself:
- `package.json`: package manager (lockfile), scripts (dev, build, test, lint,
  format, preview, e2e), React version, framework (Vite / Next / Remix / CRA).
- Styling: Tailwind config, CSS modules, styled-components, plain CSS; where
  tokens/variables live; a component library (shadcn/ui, MUI, Chakra, Radix).
- Testing: Vitest/Jest, React Testing Library, Playwright/Cypress.
- Structure: `src/` layout, routing, state (Context, Zustand, Redux,
  TanStack Query), path aliases, ESLint/Prettier config.
- **Risky scripts:** anything named deploy, publish, release, db:*, seed, migrate.

## 3. Write `<repo>/CLAUDE.md` (≤ ~80 lines)

Sections: **What this is** (2 lines) · **Commands** (exact, copy-paste ready,
Windows-safe) · **Conventions** (only the ones a newcomer would get wrong:
file naming, component structure, styling approach, imports) · **Design
system** (where the tokens and shared components live; "use these before
inventing new values") · **Done means** (e.g. `npm run lint && npm test &&
npm run build` passes, plus screenshots at 390 px and desktop for UI changes)
· **Never** · **Gotchas** (seed from existing memory, if any).
Don't restate CORE.md; it's already loaded globally.

**If the team already commits a CLAUDE.md, never edit it:** put Nika's notes
in `CLAUDE.local.md` and add it to `.git/info/exclude`
([[team-claude-md-gets-a-local-sibling]]). The same for work repos where the
file shouldn't be shared.

## 4. Memory and permissions (`.claude/settings.local.json`, personal, never the team's)

- **Own/lab repos:** `"autoMemoryDirectory": "<N>/memory/<repo-name>"`, so the
  project's memory is versioned in nikabrain and `/retro` can commit it.
- **Work repos:** no `autoMemoryDirectory` (memory stays in `~/.claude/projects/…`, local only).
- `permissions.ask` for each risky script: `"Bash(npm run deploy:*)"`, `"Bash(npm publish:*)"`, …
- Show the diff to `settings.local.json`, and write it only after Nika's OK
  ([[claude-config-changes-need-human-installer]]).

## 5. Register and check

Add a row to `N/labs.md` (name, path, kind, purpose, memory location; work
repos get a neutral name, never the client's). Then run the repo's own
"done means" command once to prove the CLAUDE.md commands are real. Hand over
without committing, and say which file to review first.
