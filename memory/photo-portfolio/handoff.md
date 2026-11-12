repo: C:/Users/qartv/projects/photo-portfolio/.git
updated: 2026-11-13
## Worked
- 2026-11-13: background is milky white `#faf8f3` and the site is light only (dark `@media` block removed, `color-scheme: light`). Confirmed by Playwright with `colorScheme: 'dark'` showing rgb(250,248,243), plus the live CSS grep.
- 2026-11-13: desktop header (≥ 48rem): Work · About · Contact in a row, Instagram at the edge, ☰ hidden; phones unchanged. CSS only (overrides `.site-menu__list[hidden]`); Instagram moved after the nav in the DOM (keyboard order), `order: -1` on phones. Confirmed by screenshots at 390/768/1280/1920, Tab order check, 39/39 tests; Nika approved from the screenshot.
- All pushed (HEAD 472c034 = origin/master); each push was live on maiagabunia.com within about 30 s (grep the hashed `/assets/*.css` for the new value).
- Earlier: strict TS, cleanup, Vitest vmThreads (13 s), domain maiagabunia.com via Porkbun → Vercel.
## Failed: do not retry
- `--` inside an SVG comment: breaks the SVG (XML).
- picsum placeholders: HTTP 522; photos are local files now.
- Playwright `networkidle` on the Vite dev server: times out (HMR socket). Use `load`.
- Multi-line string edits assuming LF: files are CRLF after checkout (autocrlf).
## Not tried yet
- Screenshot the ☰ open state after waiting 250 ms (the 200 ms icon transition was caught mid-way once; cosmetic, not a bug).
- Move Vite → Next.js (same Vercel project; client-side redirect for old #album/ links).
- Real photos: overwrite `public/albums/<slug>/NN.jpg`, real alt text in `src/data/albums.ts`.
- Full-screen photo viewer (Nika deferred: "later").
- `/teach semantic-html-and-grid` (week 1 still needs the lesson + quiz).
## Next step
Ask Nika: real photos now, or the full-screen viewer, written in TS via `/tutor` (Nika types the props interface).
