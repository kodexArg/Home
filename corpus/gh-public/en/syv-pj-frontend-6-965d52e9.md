---
id: syv-pj-frontend-6-965d52e9
title: "SyV Character Creator — Astro + Svelte web UI on Cloudflare — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "syv-pj-frontend"
related: ["gh-syv-pj-frontend"]
tags: ["syv-pj-frontend", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Player opens the creator** — lands on the home page, sees the SyV title and a live list of canonical factions pulled from the database-backed API, confirming the rules motor is reachable. 2. **Developer extends the creator** — adds new Svelte components under src/lib/components/, mounts them from minimal Astro pages, fetches additional /api/... routes proxied to the backend, and styles with Tailwind + shadcn tokens. 3. **Operator deploys to Cloudflare** — runs bun run build then bun run deploy (only when instructed); the frontend Worker binds to syv-pj-api in the same account with no CORS configuration needed.
