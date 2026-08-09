---
id: alvs-capacitacion-5-d4dadbcb
title: "ALVS Capacitación IA — interactive Astro presentation and executive workshop kit — 3. Product / idea"
visibility: public
importance: normal
source_repo: "alvs-capacitacion"
related: ["alvs-capacitacion"]
tags: ["alvs-capacitacion", "github", "public", "normal", "summary"]
---

## 3. Product / idea The repository is a **dual-layer product**: (1) a static Astro presentation app and (2) a markdown-based workshop operating system. **Layer 1 — Astro deck:** astro.config.mjs sets output: 'static'. src/pages/index.astro composes slides inside Presentation.astro via Astro's slot pattern. Each slide is a <section data-slide>; the Alpine deck() controller shows one active slide, hides exited slides, and supports touch swipe. Current shipped deck has five slides (cover, agenda, stat, strengths grid, closing). Brand tokens live in CSS variables; Tailwind utility classes handle responsive typography with clamp()-based slide font sizes. **Layer 2 — Workshop corpus:** plan/00-plan-maestro.md is the authoritative 4-hour schedule (hook → mental model + tool tour → CQR → Excel/dashboard star demo → system prompts → governance). answers.md captures the design questionnaire (audience of four executives, Spanish rioplatense, Claude Desktop primary, instructor-only keyboard). capitulos/ expands each block into facilitator-ready prose. research/ holds synthesized briefs on adult learning, curriculum design, tool selection, and executive objections. PLAN-PROPUESTA.md is a parallel, more ambitious 21-slide keynote script ("El presente de la AI") with vendor logo grids and speaker warnings about fast-moving model names—intended to extend the Astro component library. **Mental
