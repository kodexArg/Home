---
id: comfyui-8-759a7ce3
title: "ComfyUI — modular node-graph Stable Diffusion GUI, API, and inference backend — 3.2 Non-goals"
visibility: private
importance: normal
source_repo: "ComfyUI"
related: []
tags: ["comfyui", "github", "private", "normal", "summary"]
---

### 3.2 Non-goals - **No automatic model downloads** — README states the app “works fully offline” and will never download weights; operators supply models/ content manually. - **Not a training framework** — fine-tuning or dataset tooling is out of scope; focus is inference and workflow composition. - **Not a secured multi-user server** — --multi-user only partitions userdata on disk; there is no auth layer on API routes. - **Pre-alpha API stability** — basic_api_example.py warns the prompt JSON format may change.
