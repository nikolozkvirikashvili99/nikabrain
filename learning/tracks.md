# Tracks: what to learn, in what order

Copied from gigabrain's idea: **one lab app, built step by step, one concept per
step**, with a visual lesson per step and *you* writing the core (`/tutor`).
Giga's lab was a Jira-like backend; Nika's is a frontend one.

Track 0 (`ai-craft/drills.md`, working with Claude) runs alongside every track.

| # | Track | Ideas that outlive today's tools | Done when |
|---|---|---|---|
| 1 | React core | render → commit, state as a snapshot, effects as sync, identity and keys | its concepts in `me/concepts.md` reach **build**, `react-core` exam ≥ 80% in exam mode |
| 2 | CSS layout & design | cascade + layers, flow vs flex vs grid, intrinsic sizing, tokens | the lab looks right at 390 / 768 / 1280 px, light and dark; `css-layout` exam ≥ 80% |
| 3 | Data & async UI | loading/error/empty states, races, caching, optimistic updates | lab step 6 + 10 built; no flicker, no stale data in a throttled network test |
| 4 | Quality | accessibility, testing (RTL + Playwright), performance (Web Vitals, profiler) | keyboard-only run of the lab works; tests catch a planted bug |
| 5 | Polish | motion, view transitions, micro-interactions, perceived performance | `ui-reviewer` finds nothing above "nit" |

Tools change (CRA died, Vite took over). The middle column doesn't. When the lab
forces a tool choice, write *why* in `brain/patterns/` so the reasoning survives
the tool.

## The lab: `taskboard` (a small Kanban app)

Create it as its own repo (`~/projects/taskboard`, `npm create vite@latest`, React,
JavaScript), then `/onboard-project` it as kind **lab** in `labs.md`.

Every step uses the same rhythm:

1. `/teach <concept>` if the concept is at `—` or `seen` (visual lesson first).
2. `/tutor step N`: Claude writes the failing test or the empty component and the
   done-line; **you write the core lines**; hints only when you ask.
3. Proof: the test goes green, plus screenshots at 390 px and desktop.
4. `/retro`: the concept moves up a level if you built it unaided.

| Step | Build | Concept (row in `me/concepts.md`) | Done when |
|---|---|---|---|
| 0 | Static board: 3 columns of cards, semantic HTML, no JS state | Semantic HTML · Grid | columns stack under 600 px, side by side above; landmarks correct |
| 1 | Add a card (input + button) | `useState`, state as a snapshot | adding 3 cards fast adds 3 (updater function), input clears |
| 2 | Delete, edit, reorder within a column | Lists and keys · immutability | editing a card after reordering edits the right card (stable ids) |
| 3 | Move cards between columns with a `useReducer` | `useReducer` / state machines | reducer has a test per action; impossible moves are rejected |
| 4 | Persist to `localStorage` with a custom hook `usePersistentState` | Custom hooks · `useEffect` cleanup | reload keeps the board; two tabs don't corrupt each other |
| 5 | Theme: design tokens as custom properties, dark mode | Tokens, theming, `prefers-color-scheme` | toggle + system default; contrast passes in both |
| 6 | Load the board from a fake API (`setTimeout` + random delay) | Data fetching: loading/error, races | fast switching between boards never shows the wrong board |
| 7 | Card details dialog | Composition · portals · focus management | Esc closes, focus returns to the card, page behind is inert |
| 8 | Keyboard and screen-reader moving of cards | Accessibility | every action works without a mouse; announced by a live region |
| 9 | 500 cards: measure, then fix the slow part | Memoization · React Profiler | profiler shows the fix (before/after ms), not a guess |
| 10 | Optimistic add with rollback on a failed save | Transitions · `useOptimistic` | a failed save shows the card return and an error message |
| 11 | Tests: RTL for components, one Playwright flow | Testing UI · E2E | a deliberately broken reducer makes a test fail |
| 12 | Polish: card move animation, view transitions, reduced motion | Animations · `prefers-reduced-motion` | motion off when the OS asks; `ui-reviewer` clean |

Start: **step 0**. Prompt to use:

> `/tutor taskboard step 0. I write the layout CSS. Done when: 3 columns, stacked
> under 600 px, side by side above, semantic landmarks; show me 390 px and 1280 px
> screenshots. Hints only when I ask.`
