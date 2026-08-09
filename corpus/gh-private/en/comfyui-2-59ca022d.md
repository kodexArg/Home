---
id: comfyui-2-59ca022d
title: "ComfyUI — modular node-graph Stable Diffusion GUI, API, and inference backend — P1 — Composing advanced SD workflows without writing code"
visibility: private
importance: normal
source_repo: "ComfyUI"
related: []
tags: ["comfyui", "github", "private", "normal", "summary"]
---
### P1 — Composing advanced SD workflows without writing code

- **Who hurts:** Artists and researchers who need hires-fix passes, regional prompting, inpainting, ControlNet stacks, LoRA stacking, or model merges — workflows that exceed a single txt2img form.
- **Pain today:** Tab-based UIs encode fixed pipelines; escaping those patterns means maintaining private Python glue or fragile UI macros. Each new technique (SDXL, SVD, LCM, GLIGEN) adds another screen instead of composable primitives.
- **How this repo answers:** Every operation is a **node** with typed inputs/outputs ( , , , , etc.). Users wire nodes in a LiteGraph canvas ( ). Built-in nodes live in ; extended techniques ship in ; third parties add . Workflows serialize to JSON; PNG outputs embed workflow metadata for round-tripping. The README documents shortcuts for queueing, bypassing, and muting nodes.
- **Out of scope:** Training new base models, cloud-hosted inference SaaS, or a simplified “one button” consumer app experience.
