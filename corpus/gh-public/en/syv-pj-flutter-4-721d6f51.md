---
id: syv-pj-flutter-4-721d6f51
title: "SyV PJ Flutter — universe-facing character viewer and Diseño Verde mobile client — P3 — Visual consistency via an in-repo, extractable design system package"
visibility: public
importance: normal
source_repo: "syv-pj-flutter"
related: ["gh-syv-pj-flutter"]
tags: ["syv-pj-flutter", "github", "public", "normal", "summary"]
---
### P3 — Visual consistency via an in-repo, extractable design system package

- **Who hurts:** Flutter developers and agents adding screens who might hardcode hex values, Material elevation shadows, or English domain terms ( , ).
- **Pain today:** The upstream repo holds DTCG JSON, but Flutter widgets need a local package with generated , theme factory, glow background, and ten-plus components. Without bundling fonts at the app level, package widgets fail to resolve Nunito/DM Mono/Saira/Bitter families.
- **How this repo answers:** is a path dependency ( ) materializing *Diseño Verde*: DTCG-generated tokens, , screen wrapper, accent ramps, stat SVG icons, and components documented exhaustively in . App-level declares OFL font assets. is the living specimen; widget tests assert all eight core component types render. ADR-001 enforces Spanish domain terms in code ( , , ) vs framework nouns.
- **Out of scope:** Editing generated token files by hand (regenerate from upstream JSON), publishing to , or maintaining the Astro/Svelte ports (those stay in ).
