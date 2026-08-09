---
id: syv-pj-api-4-e49b69dc
title: "SyV Personajes API — procedural character engine (FastAPI + Cloudflare Worker) — P3 — Edge-deployable Python game API with swappable storage"
visibility: public
importance: high
source_repo: "syv-pj-api"
related: ["gh-syv-pj-api"]
tags: ["syv-pj-api", "github", "public", "high", "summary"]
---

### P3 — Edge-deployable Python game API with swappable storage - **Who hurts:** Operators who want a low-ops public API without maintaining containers. - **Pain today:** Traditional FastAPI + uvicorn + Postgres stacks are heavy for a rules engine; Cloudflare Workers forbid threads and limit which wheels load under Pyodide; catalog YAML/Markdown must ship inside the Worker bundle. - **How this repo answers:** Production deploy is a **Cloudflare Python Worker** (worker/) that reuses the same FastAPI app through the Pyodide asgi.fetch bridge. api/deps.py selects **D1** (env.DB) per request on the Worker and **SQLite** (aiosqlite) locally. Catalog files bundle via wrangler.jsonc rules for *.yaml and *.md. All FastAPI dependencies are async def because workerd rejects sync dependency thread pools. Local dev uses KDX_PJ_DB (default ./var/kdx_pj.db, gitignored). - **Out of scope:** Workers AI prose generation in production (stub today), R2 portrait storage, and paid Cloudflare Containers escape hatch unless a future ADR authorizes it.
