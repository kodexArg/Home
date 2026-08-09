---
id: syv-design-system-3-a52ae8ee
title: "SyV Design System — Diseño Verde cross-platform token and component library — P2 — One typeface cannot serve both UI chrome and long-form lore"
visibility: public
importance: normal
source_repo: "syv-design-system"
related: ["gh-syv-design-system"]
tags: ["syv-design-system", "github", "public", "normal", "summary"]
---

### P2 — One typeface cannot serve both UI chrome and long-form lore - **Who hurts:** Players and readers of SyV lore — character backstories, field reports, confession transcripts — rendered in the same rounded sans as button labels. - **Pain today:** Nunito alone reads as interface text even in paragraphs; extended reading causes fatigue and breaks the "official document" register the universe demands. - **How this repo answers:** TYPOGRAPHY.md documents the deliberate **UI ↔ reading split**: Nunito for display/headline/title/body (interface voice), Bitter slab serif for the prose role on cream.200 parchment (reading voice), DM Mono for code/terminal/kicker, Saira Stencil One exclusively for the logo wordmark. Token font.role.prose binds to <p> in base.css and SyvType.prose in Dart. Lowercase everywhere except the kicker eyebrow (sole uppercase element). - **Out of scope:** i18n typography, dynamic font loading beyond documented Google Fonts import or self-hosted TTF paths in the Flutter asset tree, or web font subsetting pipelines.
