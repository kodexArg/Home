---
id: syv-pj-frontend-4-e2b72432
title: "SyV Character Creator — Astro + Svelte web UI on Cloudflare — P3 — Unstructured page growth blocks agent and human contributors"
visibility: public
importance: normal
source_repo: "syv-pj-frontend"
related: ["gh-syv-pj-frontend"]
tags: ["syv-pj-frontend", "github", "public", "normal", "summary"]
---

### P3 — Unstructured page growth blocks agent and human contributors - **Who hurts:** Coding agents and developers adding UI to the character creator; reviewers who need predictable file boundaries. - **Pain today:** Astro projects often accumulate logic, markup, and fetch calls directly in pages, making components hard to test, reuse, or generate consistently. - **How this repo answers:** A **hard componentization rule** in : Astro pages ( ) are minimal shells that mount exactly one Svelte component with a client directive (e.g. ). All UI, state, and interaction live in . Additional conventions: zero boilerplate, zero code comments, zero example assets; use / exclusively (never npm/npx); shadcn-svelte aliases via . - **Out of scope:** Server-side rendering of complex interactive flows beyond what the Cloudflare adapter supports; the current pattern favors client-loaded Svelte islands.
