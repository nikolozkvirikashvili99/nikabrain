repo: C:/Users/qartv/projects/photo-portfolio/.git
updated: 2026-11-17
## Worked (all pushed; HEAD 17f7343 = origin/master)
- Clean URLs, no '#' anywhere: albums /album/<slug>, sections /work /about /contact (scroll, URL stays '/'),
  old /#… links cleaned up. src/hooks/usePath.ts + vercel.json catch-all rewrite + trailingSlash:false.
  Confirmed by: 69/69 tests, Edge run at 390/1280 (0 '#' links, Back/Forward, refresh), live curl: every path 200,
  /album/x/ → 308, files still served.
- Live check: `curl -sL https://maiagabunia.com/` then grep the hashed /assets/index-*.js. Deploys land in ~10-40 s.
- Earlier (still true): About = one paragraph; card text in the body font, no photo count; <dialog> viewer.
## Failed: do not retry
- Text over the photo bottom on phone cards: Nika "don't like it", reverted.
- Separate preview PNGs per option: Nika wants ONE side-by-side window. Text-only dialogs for visual choices.
- Any '#' in a URL or href (Nika's rule 2026-11-17). New route = check vercel.json still covers it.
## Not tried yet
- Phone Back closes only the viewer (now: history entry on open via pushState). Swipe between photos ("later").
- index.html meta description still has the old tagline; favicon/apple icon still cool black.
- More photos per album (Quick Share links → 2000px → strip EXIF).
- `/tutor`: the viewer's `useState` line (one TODO, one file).
## Next step
Ask which album gets more photos first, then add 02.jpg… with alt text.
