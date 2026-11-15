repo: C:/Users/qartv/projects/photo-portfolio/.git
updated: 2026-11-15
## Worked (all pushed; HEAD e28beb5 = origin/master)
- Live check: `curl -sL https://maiagabunia.com/` (bare domain 308 → www; without -L you get "Redirecting..."), then grep the hashed /assets/index-*.js. Deploys land in ~20-40 s.
- About: one paragraph only (site.ts). Album cards: optional `description` in albums.ts, shown under the title in the body font (Archivo, inherited); no photo count on cards (album pages keep theirs). Link name = title (aria-labelledby), text = aria-describedby. 56/56 tests.
- Card-text font was picked from one side-by-side sheet (scratchpad compare.cjs pattern), then Nika chose the About body font instead.
- Earlier (still true): warm linen/espresso palette, sticky logo header, 4 albums × 1 cover, <dialog> photo viewer, Ctrl+Shift+B publish.
## Failed: do not retry
- Text over the photo bottom on phone cards (grid-area stack + scrim): Nika "don't like it", reverted.
- Separate preview PNGs per option: Nika wants ONE side-by-side window.
- Text-only question dialogs for visual choices; overwriting a PNG open in the viewer (EBUSY).
## Not tried yet
- Phone Back closes only the viewer (history entry on open). Swipe between photos ("later").
- index.html meta description still has the old tagline; favicon/apple icon still cool black.
- More photos per album (Quick Share links → 2000px → strip EXIF).
- `/tutor`: the viewer's `useState` line (one TODO, one file).
## Next step
Ask which album gets more photos first, then add 02.jpg… with alt text.
