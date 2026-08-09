---
id: el-presente-de-la-ai-4-6a0ac12b
title: "El Presente de la AI — ALVS talk deck SSOT and agent-operated slide factory — P3 — Visual consistency for generated infographics"
visibility: private
importance: normal
source_repo: "El-presente-de-la-aI"
related: []
tags: ["el-presente-de-la-ai", "github", "private", "normal", "summary"]
---

### P3 — Visual consistency for generated infographics - **Who hurts:** Anyone generating diagram PNGs for slides — manual designers, scripts, or image models — without a shared palette, icon stroke, or layout contract. - **Pain today:** Each diagram picks random blues, mixed icon families, tiny labels, and busy backgrounds that collapse on a projector; infographics compete with the speaker instead of supporting one focal idea per slide. - **How this repo answers:** Closed three-background system in : real black , warm cream , takeaway orange , plus pure white only for infographic canvases. Single font family Nunito (rounded sans); minimum 32 pt on screen; max five legible components per slide. splits outputs into Type A (infographics on white), Type B (atmospheric full-bleed), Type C (recortable illustrations) with strict role separation: slide prompt supplies **what**; design docs supply **how**. holds twenty-seven canonical Lucide SVGs; generators must read disk icons, not invent strokes ( pipeline). already contains chapter-two through chapter-four infographics (flow, orbital system, tokens, market map, pricing columns, non-chat tools grid) plus iteration variants ( , ). Python helpers in ( , , , , ) implement early raster experiments; canonical path is SVG compose + via per design docs. - **Out of scope:** A general-purpose design system product, automated Slides API
