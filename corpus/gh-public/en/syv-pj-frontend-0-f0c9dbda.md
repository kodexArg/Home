---
id: syv-pj-frontend-0-f0c9dbda
title: "SyV Character Creator — Astro + Svelte web UI on Cloudflare — SyV Character Creator Frontend"
visibility: public
importance: normal
source_repo: "syv-pj-frontend"
related: ["gh-syv-pj-frontend"]
tags: ["syv-pj-frontend", "github", "public", "normal", "summary"]
---

# SyV Character Creator Frontend > **Problem thesis (required):** Subordinación y Valor (_SyV_) is a tabletop-style game ecosystem whose character-creation rules and canonical metadata live in a dedicated Python API ( ). This repository is the **web UI layer** for that creator: an Astro 7 + Svelte 5 application deployed as a Cloudflare Worker that renders interactive character-building screens, fetches live data from the backend motor, and enforces a component-first architecture so agents and developers can grow the UI without page-level spaghetti. At its current maturity it is an early scaffold — one landing view that proves backend connectivity by listing canonical factions — but the stack, proxy contract, and agent conventions are fully wired for expansion.
