---
name: saved-means-written-to-a-file
description: When Nika says "save this" / "keep this" / "remember this draft", write it to a file in that turn, say the path, and add a memory pointer. The transcript is not storage.
metadata:
  type: feedback
  status: inherited
---

**Rule:** "save it" means a file on disk in the same turn, plus a one-line
pointer in project memory if a later session may need it.

**Why:** in the source brain, a draft the user asked to "save" lived only in
the transcript and had to be dug out of the session log. After compaction or
in a new session it would have been gone.

**How to apply:** write `<workspace>/<topic>-<what>.md`, reply with the path,
and overwrite the same file when the draft changes.

**Signal:** "save", "keep", "remember this", "for later".
