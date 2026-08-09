---
id: syv-design-system-4-fba7b2f3
title: "SyV Design System — Diseño Verde cross-platform token and component library — P3 — Brand mark geometry inconsistency across framework ports"
visibility: public
importance: normal
source_repo: "syv-design-system"
related: ["gh-syv-design-system"]
tags: ["syv-design-system", "github", "public", "normal", "summary"]
---

### P3 — Brand mark geometry inconsistency across framework ports - **Who hurts:** Anyone placing the SyV logo in apps, marketing, or design-sync workflows; prior Svelte port had a documented 5px cross drift. - **Pain today:** Each framework reimplemented cross + double-chevron geometry from memory; sizes diverged (~10% between Dart and web), and neon chevron opacity varied. - **How this repo answers:** is the canonical 96×96 framework-agnostic mark. holds geometry tables, variant recolor rules ( , , ), size scale, lockup rules, and a known-drift matrix. ports in Astro and Svelte derive from this spec; changelog records the Svelte cross fix. - **Out of scope:** Vectorizing the wordmark into SVG paths (wordmark stays live Saira Stencil One text), light-background logo variants, or favicon/ICO generation pipelines.
