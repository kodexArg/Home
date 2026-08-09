---
id: syv-frontend-4-209dba39
title: "SyV frontend — Astro static site for the Subordinación y Valor universe — P3 — Low-maintenance edge hosting for a tiny static footprint"
visibility: public
importance: normal
source_repo: "syv-frontend"
related: ["gh-syv-frontend"]
tags: ["syv-frontend", "github", "public", "normal", "summary"]
---
### P3 — Low-maintenance edge hosting for a tiny static footprint

- **Who hurts:** Operators who want SyV on a dedicated custom domain without managing VMs, containers, or a Node server in production.
- **Pain today:** Even small sites accumulate hosting choices; SyV needs static files at the edge with correct 404 behavior and session KV compatibility for the Astro Cloudflare adapter.
- **How this repo answers:** in with adapter; defines the Worker name, custom-domain route, KV binding, asset 404 handling, and observability. Build output is deployed via ( ). The project was renamed from to while keeping the same production host (per ).
- **Out of scope:** Multi-environment staging, preview deployments, D1/R2/Vectorize bindings, SSR/API routes, or active CI (the GitHub Actions workflow file exists but is **disabled** — see §10).
