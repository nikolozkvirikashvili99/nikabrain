# Answer keys (for Claude when grading; Nika: open only after you've answered)

Grading: count key items found (with the right fix), count false alarms, check that
the most serious one is ranked first. Explain each miss in ≤ 5 lines with a small
example or picture, then suggest `/teach <concept>` for the weakest area.
**Trap** = the item a passing answer must include.

## 01 Search-as-you-type
1. **Trap: no cleanup.** Every keystroke schedules a timeout that is never cleared, so
   typing "react" fires 5 requests (no real debounce). Return `() => clearTimeout(id)`.
2. **Race:** responses can arrive out of order, so results for "rea" can overwrite
   "react". Ignore flag / `AbortController` in the cleanup.
3. Empty `q` still fetches; also no `encodeURIComponent(q)` (`&`, `#` break the URL).
4. No loading / error / empty state; a failed fetch is an unhandled rejection.
5. `key={i}` on results that change: use a stable id.
6. Clickable `div`: not focusable or announced. Use `<button>` or a link.
7. `placeholder` is not a label: add `<label>` or `aria-label`; consider `type="search"`.

## 02 Confirm-delete modal
1. **Trap: stacking context.** `.card` has a `transform`, so the fixed overlay lives inside
   the card's stacking context *and* `fixed` is relative to the card (transform makes a
   containing block): it won't cover the page. Render via `createPortal(…, document.body)`
   or use `<dialog>` with `showModal()` (top layer).
2. `div` buttons: no keyboard, no role. Use `<button type="button">`.
3. No Esc to close, no focus moved into the dialog, no focus return, page behind not
   inert. `<dialog>` + `showModal()` gives most of this for free.
4. No `role="dialog"`/`aria-modal`/`aria-labelledby` if not using `<dialog>`.
5. Clicking inside `.modal` bubbles to the overlay and closes it: check
   `e.target === e.currentTarget` on the overlay.
6. Destructive action: focus should start on Cancel, not Delete.

## 03 useFetch
1. **Trap: `options = {}` default is a new object every render**, and it's a dependency,
   so the effect re-runs every render → infinite fetch loop (each `setData` re-renders).
   Callers passing inline `{ headers }` hit the same thing. Depend on `url` plus a stable/serialised option.
2. Race between URLs + no cleanup: abort with `AbortController` in the cleanup.
3. `loading` never goes back to `true` when `url` changes; stale `data` stays visible.
4. No error state; `r.ok` not checked (a 404 page is parsed as JSON and throws).
5. Senior note: for an app-wide data hook, TanStack Query / SWR (caching, dedupe, retries).

## 04 useDebouncedValue
Reference:
```js
function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}
```
**Trap:** the cleanup that clears the timer (covers fast typing, delay changes, unmount).
Check: both `value` and `delayMs` are dependencies; no `useRef` timer juggling needed.
Bonus test: `vi.useFakeTimers()`, rerender with new values, `advanceTimersByTime`.

## 05 Responsive product grid
```css
.grid { display: grid; gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr)); }
.card-wrap { container-type: inline-size; }
.card { display: grid; gap: .75rem; }
@container (width > 360px) { .card { grid-template-columns: 120px minmax(0, 1fr); } }
.card h3 { overflow-wrap: anywhere; }
```
**Trap: `min(220px, 100%)`.** Plain `minmax(220px, 1fr)` overflows a container narrower
than 220 px + padding (320 px phone with gutters). Also: `minmax(0, 1fr)` or
`overflow-wrap` so the long name can't widen a track; container query on a *wrapper*
(an element can't query itself); `auto-fit` not `auto-fill` so few items stretch.

## 06 Edit profile form
1. **Trap: state initialised from props never updates.** Picking another user keeps the
   previous user's fields. Fix: `<EditProfile key={selectedUser.id} … />`.
2. `onSubmit` doesn't `preventDefault()`: the page reloads and the save may be lost.
3. "Reset" is a `<button>` inside a form with no `type`, so it **submits**. `type="button"`.
4. No labels (placeholders vanish when typing); email should be `type="email"`,
   `autoComplete="name"` / `"email"`.
5. No pending/disabled state while saving; double submit possible.

## 07 Tabs
Check: context holds `value` + `setValue` (`Tabs` = provider; `Tab`/`Panel` read it, no
index props); `role="tablist"`, `role="tab"` with `aria-selected` + `aria-controls`,
`role="tabpanel"` with `aria-labelledby`; **trap: roving tabindex**: active tab
`tabIndex=0`, others `-1`, arrows move focus *and* select (automatic activation) or
focus only + Enter/Space (manual); Home/End. Ids via `useId()`. Panel content of
inactive tabs hidden (`hidden` attribute). Ref: WAI-ARIA APG tabs pattern.

## 08 Theme context
1. **Trap: `Widgets` is defined inside `App`**, a new component type every render, so
   all 200 widgets unmount and remount on every keystroke (and lose state). Move it out.
2. Provider `value={{ theme, setTheme }}` is a new object each render → every
   consumer re-renders on every keystroke, even with `memo`. `useMemo` the value, or split
   the contexts (theme value vs setter).
3. Put `query` state lower (in a `SearchBox` component) so typing doesn't render `App`.
4. Check after: React Profiler before/after numbers, not a guess. (React Compiler
   would memoise 2, but not fix 1.)

## 09 Optimistic like
Check: optimistic state (`useOptimistic` or local state) + rollback on failure;
**trap: concurrent clicks.** Updates must use the updater form (`c => c + 1`), and either
disable while pending, or queue / reconcile with the server's returned count, so 10
fast clicks don't drift. Error message in a live region; `aria-pressed` reflects the
*liked* state; `<button>` with an accessible name ("Like, 12 likes").
