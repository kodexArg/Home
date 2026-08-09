---
id: syv-image-generation-2-96e504a9
title: "SyV Image Generation — ComfyUI portrait factory for Subordinación y Valor — P1 — Lore sheets do not become images by themselves"
visibility: public
importance: high
source_repo: "syv-image-generation"
related: ["gh-syv-image-generation"]
tags: ["syv-image-generation", "github", "public", "high", "summary"]
---

### P1 — Lore sheets do not become images by themselves - **Who hurts:** Anyone building SyV characters who needs a **visual identity** matching faction, rank, attributes, and palette — creators, narrative designers, and agents tasked with portrait work. - **Pain today:** Character truth lives in markdown fichas (../syv-pj/resources/personajes/*.md — 34 mock characters indexed in _moc-personajes.md). ComfyUI expects natural-language photographic prompts (especially under Z-Image Turbo), not YAML frontmatter. Manual translation is slow, inconsistent across styles (propaganda screenprint vs cinematic vs pixel-art vs watercolor), and loses the cuerpo/mente/alma stat semantics. - **How this repo answers:** AGENTS.md defines the **six-step portrait brain** (read ficha → read whitelist → build positive/negative or natural-language prompt → generate → deliver to prompts/inbox/ → promote to prompts/whitelist.md). Python compilers (scripts/prompt_compiler.py, scripts/portrait_prompt.py, scripts/realistic_portrait_prompt.py, scripts/sheet_to_comfy.py) deterministically map stats, faction, rank, equipment, and atmosphere clauses into prompt text. prompts/atmosphere.md supplies a token-efficient SyV world clause. prompts/characters/ holds per-character ComfyUI compilations (39 fichas present in tree). - **Out of scope:** Does not author or mutate character canon in syv-pj or syv-docs.
