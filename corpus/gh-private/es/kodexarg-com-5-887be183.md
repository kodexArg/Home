---
id: kodexarg-com-5-887be183
title: "kodexarg.com — personal liminal home site — 3. Product / idea"
visibility: private
importance: high
source_repo: "kodexarg.com"
related: []
tags: ["kodexarg.com", "github", "private", "high", "summary"]
---

## 3. Product / idea The mental model is **static-first personal site + selective islands + Workers edge hosting**. After clone and bun install, bun run dev serves the site in the real workerd runtime (Astro 6 behavior). bun run build prerenders pages to dist/ with client assets under dist/client/. Deploy is either manual bun run deploy (build + wrangler) or automatic on push to main via Workers Builds. The home (src/pages/index.astro) composes: 1. **Base.astro layout** — HTML shell, meta, favicon, imports global.css, mounts Aurora behind page content. 2. **Header wordmark** — Wordmark.svelte in static mode (no blinking cursor, selectable, width: max-content so it does not block the terminal). 3. **Main terminal** — Terminal.svelte pinned bottom-left: seeds history with a CV link (¿quién es kodexArg?), accepts typed input that echoes on Enter like a real console (not a command interpreter), respects prefers-reduced-motion. Removed product elements (per AGENTS.md): floating "door" links, DoorField physics, CandleLink on the home — do not reintroduce without explicit product decision.
