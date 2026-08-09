---
id: ryf-5-beb4db69
title: "Subordinación y Valor — TTRPG character companion web app — 3. Product / idea"
visibility: private
importance: normal
source_repo: "ryf"
related: []
tags: ["ryf", "github", "private", "normal", "summary"]
---

## 3. Product / idea The mental model is a **two-tier web app**: a polished SvelteKit SPA-style frontend for players, and a containerized Django API + MySQL backend for data persistence, fronted by Nginx in production-shaped Docker Compose. Users land on a themed shell (+layout.svelte) with olive/blood Tailwind palette, lazy-loaded background art, and a navbar branded **Subordinación y Valor**. Navigation popup links to home, generated characters, a placeholder "secret archives" route (still points home), and the rules page. The home route (+page.svelte) is currently a stub—most value lives under /personajes and /sistema. Character flow: list page loads API data → Deck progressively renders cards with fly-in animation and horizontal scroll (mouse-wheel mapped to horizontal scroll) → single-click enlarges, double-click opens detail. Detail page reads from sessionStorage (not a second API fetch by slug), so navigation depends on prior deck interaction. A parallel notes/ directory holds earlier prototypes—duplicate Card.svelte, SkillBar.svelte, Django-style migrations mirroring backend schema, and character route experiments—suggesting iterative development before consolidation into src/.
