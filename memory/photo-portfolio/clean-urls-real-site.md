---
name: clean-urls-real-site
description: "photo-portfolio is a real client-facing site now; Nika wants clean URLs with no '#' anywhere"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 1d765bc0-9a60-49bf-a3b2-2f69cb6e0a25
  modified: 2026-11-17T15:31:10.220Z
---

Nika (2026-11-17): "this is not test page anymore its real project", and doesn't like any "#" in the URL
(not even `#work`). Switched from hash routing to `/album/<slug>` paths + a vercel.json rewrite.

**Why:** the site is live at the real domain ([[domain-porkbun-to-vercel]]); URLs should look professional.
**How to apply:** judge changes as production work (no throwaway shortcuts); never reintroduce `#` URLs; any new
route needs a matching rewrite in vercel.json and a check that a refresh on it works.
