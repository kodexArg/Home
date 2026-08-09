---
id: syv-pj-flutter-4-721d6f51
title: "SyV PJ Flutter — universe-facing character viewer and Diseño Verde mobile client — P3 — Visual consistency via an in-repo, extractable design system package"
visibility: public
importance: normal
source_repo: "syv-pj-flutter"
related: ["gh-syv-pj-flutter"]
tags: ["syv-pj-flutter", "github", "public", "normal", "summary"]
---

### P3 — Visual consistency via an in-repo, extractable design system package - **Who hurts:** Flutter developers and agents adding screens who might hardcode hex values, Material elevation shadows, or English domain terms (character, model). - **Pain today:** The upstream syv-design-system repo holds DTCG JSON, but Flutter widgets need a local package with generated syv_tokens.dart, theme factory, glow background, and ten-plus Syv* components. Without bundling fonts at the app level, package widgets fail to resolve Nunito/DM Mono/Saira/Bitter families. - **How this repo answers:** packages/syv_ui is a path dependency (syv_ui: path: packages/syv_ui) materializing *Diseño Verde*: DTCG-generated tokens, syvTheme(), SyvGlow screen wrapper, accent ramps, stat SVG icons, and components documented exhaustively in docs/DESIGN-SYSTEM.md. App-level pubspec.yaml declares OFL font assets. ShowcaseView is the living specimen; widget tests assert all eight core component types render. ADR-001 enforces Spanish domain terms in code (personaje, ficha, faccion) vs framework nouns. - **Out of scope:** Editing generated token files by hand (regenerate from upstream JSON), publishing syv_ui to , or maintaining the Astro/Svelte ports (those stay in syv-design-system).
