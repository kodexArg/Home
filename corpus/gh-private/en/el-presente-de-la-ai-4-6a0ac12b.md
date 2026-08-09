---
id: el-presente-de-la-ai-4-6a0ac12b
title: "El Presente de la AI — ALVS talk deck SSOT and agent-operated slide factory — P3 — Visual consistency for generated infographics"
visibility: private
importance: normal
source_repo: "El-presente-de-la-aI"
related: []
tags: ["el-presente-de-la-ai", "github", "private", "normal", "summary"]
---

### P3 — Visual consistency for generated infographics - **Who hurts:** Anyone generating diagram PNGs for slides — manual designers, scripts, or image models — without a shared palette, icon stroke, or layout contract. - **Pain today:** Each diagram picks random blues, mixed icon families, tiny labels, and busy backgrounds that collapse on a projector; infographics compete with the speaker instead of supporting one focal idea per slide. - **How this repo answers:** Closed three-background system in docs/design-system.md: real black #000000, warm cream #F6EADC, takeaway orange #F2660D, plus pure white #FFFFFF only for infographic canvases. Single font family Nunito (rounded sans); minimum 32 pt on screen; max five legible components per slide. docs/image-generation.md splits outputs into Type A (infographics on white), Type B (atmospheric full-bleed), Type C (recortable illustrations) with strict role separation: slide prompt supplies **what**; design docs supply **how**. contexto/iconos/ holds twenty-seven canonical Lucide SVGs; generators must read disk icons, not invent strokes (docs/image-generation.md pipeline). assets/ already contains chapter-two through chapter-four infographics (flow, orbital system, tokens, market map, pricing columns, non-chat tools grid) plus iteration variants (-v1, -v2). Python helpers in scripts/ (generate_flow_image.py,
