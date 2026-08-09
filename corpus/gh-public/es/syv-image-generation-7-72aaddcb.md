---
id: syv-image-generation-7-72aaddcb
title: "SyV Image Generation — ComfyUI portrait factory for Subordinación y Valor — 3.1 North-star use cases"
visibility: public
importance: high
source_repo: "syv-image-generation"
related: ["gh-syv-image-generation"]
tags: ["syv-image-generation", "github", "public", "high", "summary"]
---

### 3.1 North-star use cases 1. **Single portrait delivery:** Agent reads ../syv-pj/resources/personajes/<slug>.md, compiles prompt via prompt_compiler.py or sheet_to_comfy.py, runs v7 slider workflow, delivers prompts/inbox/<date>-<slug>-<estilo>/ with full metadata. 2. **Batch propaganda poster sweep:** scripts/generate_portraits.py --run posts all soldier records to ComfyUI sequentially; dry-run default writes build/portrait_prompts.json. 3. **Style matrix / comparison:** generate_squad_test.py, generate_3x5_hyper.py, generate_zimage_panorama.py, build_zimage_matrix.py, generate_comparison_page.py, build_galeria_html.py for multi-style shoots and static HTML review pages in build/. 4. **LoRA dataset prep:** Curate 80–150 image+caption pairs from mock characters for Z-Image Omni-Base training (Ostris AI Toolkit) or legacy Pony path — documented in AGENTS.md training section.
