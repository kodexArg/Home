---
id: syv-pj-frontend-2-eee56230
title: "SyV Character Creator — Astro + Svelte web UI on Cloudflare — P1 — No browser surface for the SyV character creator"
visibility: public
importance: normal
source_repo: "syv-pj-frontend"
related: ["gh-syv-pj-frontend"]
tags: ["syv-pj-frontend", "github", "public", "normal", "summary"]
---
### P1 — No browser surface for the SyV character creator

- **Who hurts:** Players who need to create SyV characters interactively; game operators who maintain canonical faction and rules data in the backend API; frontend developers who must render that data without re-implementing game logic.
- **Pain today:** Game rules and metadata are authoritative in (documented in that repo's ). Without a dedicated frontend, character creation is limited to API clients, scripts, or manual table work — no polished, styled, player-facing workflow in the browser.
- **How this repo answers:** Provides a Cloudflare-hosted web application with Spanish UI chrome ( , title _Subordinación y Valor_), a dark SyV-themed design token palette in , and Svelte components that fetch live backend data. The initial component calls , receives faction objects ( , , ), and renders them as cards — proving the UI-to-motor pipeline works end-to-end.
- **Out of scope:** Implementing game rules, persistence, or character sheet logic (those belong in and its storage layer). This repo does not own the API contract.
