---
id: kodexarg-com-5-887be183
title: "kodexarg.com — personal liminal home site — 3. Product / idea"
visibility: private
importance: high
source_repo: "kodexarg.com"
related: []
tags: ["kodexarg.com", "github", "private", "high", "summary"]
---

## 3. Product / idea The mental model is **static-first personal site + selective islands + Workers edge hosting**. After clone and , serves the site in the real workerd runtime (Astro 6 behavior). prerenders pages to with client assets under . Deploy is either manual (build + wrangler) or automatic on push to via Workers Builds. The home ( ) composes: 1. ** layout** — HTML shell, meta, favicon, imports , mounts behind page content. 2. **Header wordmark** — in mode (no blinking cursor, selectable, so it does not block the terminal). 3. **Main terminal** — pinned bottom-left: seeds history with a CV link ( ), accepts typed input that echoes on Enter like a real console (not a command interpreter), respects . Removed product elements (per ): floating "door" links, physics, on the home — do not reintroduce without explicit product decision.
