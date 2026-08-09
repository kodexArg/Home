---
id: syv-pj-api-6-0b120cb0
title: "SyV Personajes API — procedural character engine (FastAPI + Cloudflare Worker) — 3. Product / idea (2)"
visibility: public
importance: high
source_repo: "syv-pj-api"
related: ["gh-syv-pj-api"]
tags: ["syv-pj-api", "github", "public", "high", "summary"]
---

campaign updates. **Meta flow:** clients discover factions, rank attribute tables, tag catalogs (GET /meta/{categoria} and subcategory routes like /meta/equipo/arma), milestone type hints, and fresh encounter plates. Production runs the same app module as local dev; the Worker entrypoint (worker/src/worker.py) sets KDX_RUNTIME=worker and KDX_RESOURCES_PATH to bundled resources before importing personajes.api.app.
