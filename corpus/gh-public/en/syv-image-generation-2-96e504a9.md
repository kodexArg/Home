---
id: syv-image-generation-2-96e504a9
title: "SyV Image Generation — ComfyUI portrait factory for Subordinación y Valor — P1 — Lore sheets do not become images by themselves"
visibility: public
importance: high
source_repo: "syv-image-generation"
related: ["gh-syv-image-generation"]
tags: ["syv-image-generation", "github", "public", "high", "summary"]
---
### P1 — Lore sheets do not become images by themselves

- **Who hurts:** Anyone building SyV characters who needs a **visual identity** matching faction, rank, attributes, and palette — creators, narrative designers, and agents tasked with portrait work.
- **Pain today:** Character truth lives in markdown fichas ( — 34 mock characters indexed in ). ComfyUI expects natural-language photographic prompts (especially under Z-Image Turbo), not YAML frontmatter. Manual translation is slow, inconsistent across styles (propaganda screenprint vs cinematic vs pixel-art vs watercolor), and loses the cuerpo/mente/alma stat semantics.
- **How this repo answers:** defines the **six-step portrait brain** (read ficha → read whitelist → build positive/negative or natural-language prompt → generate → deliver to → promote to ). Python compilers ( , , , ) deterministically map stats, faction, rank, equipment, and atmosphere clauses into prompt text. supplies a token-efficient SyV world clause. holds per-character ComfyUI compilations (39 fichas present in tree).
- **Out of scope:** Does not author or mutate character canon in or . Does not host ComfyUI itself (external install detected via skill / ).
