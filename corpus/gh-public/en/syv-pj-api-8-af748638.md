---
id: syv-pj-api-8-af748638
title: "SyV Personajes API — procedural character engine (FastAPI + Cloudflare Worker) — 3.2 Non-goals"
visibility: public
importance: high
source_repo: "syv-pj-api"
related: ["gh-syv-pj-api"]
tags: ["syv-pj-api", "github", "public", "high", "summary"]
---

### 3.2 Non-goals - **Real LLM prose in production** — StubProseProvider returns placeholder text; Workers AI adapter exists but is not the default wiring (docs/plan-implementacion-sistema-creacion-personajes.md tracks LLM integration as future work). - **Portrait execution** — GET /personaje/{slug}/workflow returns ComfyUI API-JSON; nothing in this repo runs ComfyUI or stores PNGs yet (portrait persistence planned in implementation plan). - **List-all endpoint** — contract SSOT lists 11 core routes; GET /personajes list is identified as a planned contract delta in the implementation plan, not implemented here. - **Editing the HTTP contract from this repo** — API.md is a read-only symlink to syv-pj (ADR-003).
