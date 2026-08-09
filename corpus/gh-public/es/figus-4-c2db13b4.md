---
id: figus-4-c2db13b4
title: "Figus — World Cup 2026 Panini sticker album tracker and local trade finder — P3 — Clean catalog ingestion from messy community checklists"
visibility: public
importance: normal
source_repo: "figus"
related: ["figus"]
tags: ["figus", "github", "public", "normal", "summary"]
---

### P3 — Clean catalog ingestion from messy community checklists - **Who hurts:** Developers (or agents) who need a structured sticker catalog before building UI, starting from an unofficial community Panini checklist with typos and regional variants. - **Pain today:** Raw blog checklists mix printable album pages with collectible stickers, duplicate player codes, and multiple Coca-Cola regional editions; hand-transcribing into JSON is error-prone. - **How this repo answers:** encodes cleaning rules (typo fixes, dropping "printed in album" decor pages, selecting Coca-Cola **Versión 2 LATAM** for Argentina, modeling 20 mystery players × 4 color parallels). It emits with version , team metadata for all **48** qualified nations, and sanity checks (980 unique album positions, 20 stickers per team). The committed is what the TypeScript layer imports at build time. - **Out of scope:** Legal licensing of Panini trademarks, automated scraping pipelines, or ongoing sync when Panini revises the official checklist.
