---
id: syv-design-system-2-073cb6dd
title: "SyV Design System — Diseño Verde cross-platform token and component library — P1 — Cross-platform visual drift without a token SSOT"
visibility: public
importance: normal
source_repo: "syv-design-system"
related: ["gh-syv-design-system"]
tags: ["syv-design-system", "github", "public", "normal", "summary"]
---
### P1 — Cross-platform visual drift without a token SSOT

- **Who hurts:** Teams shipping SyV on Flutter ( ) and web (Astro/Svelte apps such as the kodexArg Home site), plus any future target that needs the same palette.
- **Pain today:** Hardcoded hex values in each framework diverge silently; the original *Diseño Naranja* (orange-led) and its *Diseño Verde* evolution (olive-drab-led) multiply if every app maintains its own palette. Elevation shadows and neon misuse creep in when there is no written rule.
- **How this repo answers:** is the sole authority in DTCG format. Generated outputs (classes , , , , , , , ) and ( custom properties) must be regenerated from the JSON — never hand-edited for values. documents the strict hierarchy and full token tables so agents need not grep.
- **Out of scope:** Automated regeneration CLI (not documented; manual regen with header), npm package publishing, runtime theme switching API, or managing Flutter widget implementations (those live in the external repo).
