# Practice gym: frontend tickets with a trap

Ported from gigabrain's `bin/practice`: each ticket is a realistic task with **one
trap a senior would catch**. Two modes, as in giga's gym:

- **review**: a teammate's PR. Find every problem, rank them, say the fix. (This is
  what most of a senior's day looks like.)
- **write**: build it yourself in the `taskboard` lab or a scratch Vite app.

How to use one:

1. Do it **without Claude writing code**. Time-box: 20–40 min.
2. Then ask: `grade practice ticket 03` and paste your answer or point at your code.
   Claude grades against `learning/practice/keys.md` (don't open it first: that's
   giga's "hint only when stuck" rule), scores found / missed / false alarms, and
   explains each miss with a picture or a 5-line example.
3. A missed trap → `/teach` that concept, and `/retro` records it.

| # | Mode | Area | Ticket |
|---|---|---|---|
| 01 | review | effects | Search-as-you-type |
| 02 | review | a11y + CSS | Confirm-delete modal |
| 03 | review | async | `useFetch` hook |
| 04 | write | hooks | `useDebouncedValue` |
| 05 | write | CSS | Responsive product grid |
| 06 | review | forms | Edit profile form |
| 07 | write | composition + a11y | Tabs component |
| 08 | review | performance | Theme context |
| 09 | write | state | Optimistic like button |

---

## 01 · review · Search-as-you-type

"Search results update as you type. Works on my machine." Find the problems.

```jsx
function Search() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    setTimeout(async () => {
      const res = await fetch('/api/search?q=' + q);
      setResults(await res.json());
    }, 300);
  }, [q]);

  return (
    <div>
      <input placeholder="Search" onChange={e => setQ(e.target.value)} />
      {results.map((r, i) => <div key={i} onClick={() => open(r)}>{r.title}</div>)}
    </div>
  );
}
```

## 02 · review · Confirm-delete modal

"Adds a confirmation before deleting. Rendered inside the card that was clicked."

```jsx
function ConfirmModal({ onConfirm, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal">
        <p>Delete this item?</p>
        <div className="btn" onClick={onConfirm}>Delete</div>
        <div className="btn" onClick={onClose}>Cancel</div>
      </div>
    </div>
  );
}
```
```css
.card { transform: translateY(0); transition: transform .2s; }
.card:hover { transform: translateY(-2px); }
.overlay { position: fixed; inset: 0; z-index: 9999; background: rgb(0 0 0 / .5); }
```

## 03 · review · `useFetch` hook

"Reusable data hook for the whole app."

```jsx
export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url, options)
      .then(r => r.json())
      .then(json => { setData(json); setLoading(false); });
  }, [url, options]);

  return { data, loading };
}
```

## 04 · write · `useDebouncedValue`

Write `useDebouncedValue(value, delayMs)`: returns `value`, but only after it has
stopped changing for `delayMs`. Use it to fix ticket 01.

**Done when:** typing "react" quickly triggers **one** search, not five; changing
`delayMs` while waiting doesn't leave an old timer firing; unmounting while waiting
fires nothing. Bonus: a test with fake timers.

## 05 · write · Responsive product grid

A grid of product cards: as many columns as fit, each card at least 220 px wide,
cards stretch to fill the row, **no horizontal scroll on a 320 px phone**, a long
product name never makes one column wider than the others. Inside each card, put the
image beside the text when *the card* is wider than 360 px, otherwise stack them.

**Done when:** screenshots at 320, 768 and 1280 px; one product with a 60-character
unbroken name; no media queries used for the card's inner layout.

## 06 · review · Edit profile form

```jsx
function EditProfile({ user, onSave }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  return (
    <form onSubmit={() => onSave({ name, email })}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={() => { setName(user.name); setEmail(user.email); }}>Reset</button>
      <button>Save</button>
    </form>
  );
}
// used as: <EditProfile user={selectedUser} onSave={save} /> next to a user list
```

## 07 · write · Tabs component

Build `<Tabs>` used like this:

```jsx
<Tabs defaultValue="details">
  <Tabs.List aria-label="Product">
    <Tabs.Tab value="details">Details</Tabs.Tab>
    <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="details">…</Tabs.Panel>
  <Tabs.Panel value="reviews">…</Tabs.Panel>
</Tabs>
```

**Done when:** ← / → move between tabs, Home/End jump, only the active tab is in the
Tab order, the roles and ARIA match the WAI-ARIA tabs pattern, and no tab needs an
`index` prop. (Library skill `composition-patterns` and `accessibility` are allowed
reading *after* your first attempt.)

## 08 · review · Theme context

"Typing in the search box is laggy on the dashboard (200+ widgets)."

```jsx
const ThemeContext = createContext();

export function App() {
  const [theme, setTheme] = useState('light');
  const [query, setQuery] = useState('');
  function Widgets() { return widgets.map(w => <Widget key={w.id} {...w} />); }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <Widgets />
    </ThemeContext.Provider>
  );
}
// every Widget calls useContext(ThemeContext) to pick its colours
```

## 09 · write · Optimistic like button

A ❤ button with a count. Clicking updates **instantly**, then saves with
`await api.like(postId)` (fails 30% of the time in your fake API). On failure, the
count goes back and a short error shows. Double-clicking fast must not end up with
a count that's off by one.

**Done when:** throttled network + 10 fast clicks ends with the count matching the
server; a failed save visibly rolls back; the button has an accessible name and
`aria-pressed`.
