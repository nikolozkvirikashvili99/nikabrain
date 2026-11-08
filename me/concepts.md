# Concepts: what Nika can actually do

Four levels, lowest first:
1. **seen**: read or watched it.
2. **explain**: explained it correctly, unaided.
3. **build**: wrote it yourself, and it worked.
4. **teach**: got someone else (or a doc) to understand it.

Raise a level only on evidence, and record that evidence. `—` = not assessed
yet. Nika may set a starting level by self-assessment; mark it "(self)" so
`/curate` knows it isn't evidenced yet.

| Concept | Area | Level | Evidence | Next step |
|---|---|---|---|---|
| Rendering & reconciliation (when and why a component re-renders) | react | — | — | `/teach react-rendering` |
| `useState` / batching / state as a snapshot | react | seen | 2026-11-05: watched the menu open/close state built | |
| `useEffect`: dependencies, cleanup, "you might not need an effect" | react | seen | 2026-11-05: watched Escape/outside-click listeners with cleanup | |
| `useRef` vs state; refs to DOM | react | seen | 2026-11-05: watched refs used for contains() and focus return | |
| Custom hooks (extracting stateful logic) | react | — | — | `/tutor`: write one |
| `useReducer` and state machines for UI | react | — | — | |
| Context: when it helps, its re-render cost | react | — | — | |
| Memoization (`memo`, `useMemo`, `useCallback`, React Compiler) | react | — | — | |
| Lists and keys | react | — | — | |
| Controlled vs uncontrolled forms; form actions (React 19) | react | — | — | |
| Data fetching: loading/error states, races, caching (TanStack Query / SWR) | react | — | — | |
| Suspense, `use`, transitions | react | — | — | |
| Component composition (children, compound components, slots) | react | — | — | |
| Server vs client components (if using Next.js) | react | — | — | |
| Semantic HTML and landmarks | html | seen | 2026-11-05: predicted correctly that RTL finds `<header>` by role and a `<div>` would fail; watched Header built red → green | build: write the next landmark/section unaided |
| Forms and native validation | html | — | — | |
| Cascade, specificity, `@layer` | css | — | — | |
| Box model, flow layout, stacking contexts (`z-index`) | css | — | — | |
| Flexbox | css | — | — | |
| Grid (incl. `minmax`, `auto-fit`, subgrid) | css | seen | 2026-11-09: read a 5-min micro-lesson on `repeat(auto-fill, minmax(min(100%, 16rem), 1fr))` and why `min(100%, …)` stops sideways scroll | build it in the gallery TODO via `/tutor` |
| Responsive design: fluid type, `clamp()`, container queries | css | — | — | |
| Design tokens / custom properties, theming, dark mode | css | — | — | |
| Transitions and animations; `prefers-reduced-motion` | css | — | — | |
| Accessibility: keyboard, focus, ARIA only when needed, contrast | a11y | — | — | |
| Closures and scope | js | — | — | |
| Event loop, promises, `async`/`await`, microtasks | js | — | — | |
| Modules, bundling, tree-shaking (Vite) | js | seen | 2026-11-05: asked "why not one file?" and "how is it connected?"; walked through export/import with site.js → Header/Intro/Footer | `/teach components-and-import-export` (offered) |
| Immutability and array/object methods | js | — | — | |
| Testing UI: React Testing Library queries, user-event | testing | — | — | |
| End-to-end tests (Playwright) | testing | — | — | |
| Web performance: Core Web Vitals (LCP, INP, CLS), images, code splitting | perf | — | — | |
| Visual design basics: spacing scale, type scale, hierarchy, colour contrast | design | — | — | `ui-ux-pro-max` on a real page |
| Context engineering (CLAUDE.md, memory, skills, hooks) | ai | seen | 2026-11-01: nikabrain set up from gigabrain | explain: what each layer of nikabrain does |
| Agent workflow (subagents, background review, worktrees, plan mode) | ai | — | — | |
