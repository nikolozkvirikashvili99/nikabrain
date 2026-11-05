repo: C:/Users/qartv/projects/photo-portfolio/.git
updated: 2026-11-05
## Worked
- Skeleton: tokens.css + global.css, Header / main(Intro #about, Gallery #work) / Footer #contact; data in src/data/{site,photos,socialIcons}.js. Confirmed by build + screenshots 390/1280 light+dark.
- Header: name + Instagram logo + ☰ menu button (useState/useRef/useEffect; closes on link, Escape (focus returns), outside click). Confirmed by 8 Header tests + real keyboard run in Edge.
- Footer: email, phone (tel:), Instagram/Facebook/TikTok logos via shared SocialIcon. Confirmed by tests.
- Onboarded: CLAUDE.md, labs.md row, settings.local.json (memory here; ask before commit/push/npm install).
- vitest `maxWorkers: 1` (worker OOM crash, exit 134). Confirmed: 3 clean runs, 12/12.
- Nika filled in real name, email, phone and social URLs in site.js.
## Failed: do not retry
- `! npm test` for watch mode: `!` runs once and exits. Use Nika's VS Code terminal.
## Not tried yet
- Gallery grid: `.gallery__grid` TODO in global.css (grid-template-columns repeat(auto-fill, minmax(…,1fr)) + gap token). Only 1 photo in photos.js now; add placeholders temporarily to see columns.
- Real photos: Nika puts files in public/photos/ (~2000px long side), then switch photos.js to local src + alt text.
- Stale TODO(Nika) comment in site.js (links are filled in); Nika may delete it.
- ui-reviewer pass on header menu + footer.
- Offer /teach semantic-html-and-grid around the grid work (see suggest-lessons-later.md).
## Next step
Gallery grid: ask "watch or try?", then build it with temporary placeholder photos and screenshot 390/1280.
