---
id: design-kodexarg-com-2-e4e97c81
title: "design.kodexarg.com — kodexArg design system SSOT — P1 — Fragmented branding across sibling properties"
visibility: private
importance: high
source_repo: "design.kodexarg.com"
related: []
tags: ["design.kodexarg.com", "github", "private", "high", "summary"]
---

### P1 — Fragmented branding across sibling properties - **Who hurts:** An operator running multiple related static sites (home, CV, design, future properties) and agents that copy-paste styles between repos. - **Pain today:** Each site risks drifting palettes, typography, and component behavior. Orange accent usage becomes inconsistent; the wordmark casing and monospace voice get reimplemented ad hoc. - **How this repo answers:** is declared the SSOT for every property — warm charcoal inks, rationed orange accent, cream text, mate/pullover document lineage, teal/sage secondary voices, semantic aliases ( , , , etc.), and opt-in light mode via . README states sibling repos import this file directly. The live styleguide on documents every scale with hex chips and narrative notes. - **Out of scope:** Runtime theme switching infrastructure, npm package publishing, or a full component library for arbitrary apps — only and ship here; other sites vendor copies with bidirectional sync instructions (see sibling `` summary).
