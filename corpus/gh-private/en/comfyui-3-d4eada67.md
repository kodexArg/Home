---
id: comfyui-3-d4eada67
title: "ComfyUI — modular node-graph Stable Diffusion GUI, API, and inference backend — P2 — Transparent, efficient execution of diffusion graphs"
visibility: private
importance: normal
source_repo: "ComfyUI"
related: []
tags: ["comfyui", "github", "private", "normal", "summary"]
---

### P2 — Transparent, efficient execution of diffusion graphs - **Who hurts:** Power users iterating on the last steps of a large graph (e.g. change only the KSampler seed or final upscale) on hardware where full pipeline re-runs are costly. - **Pain today:** Naive executors rerun the entire DAG every time, wasting GPU time reloading encoders and re-encoding prompts. - **How this repo answers:** execution.py implements PromptExecutor with validation, topological execution, and **change detection** — only nodes whose inputs changed (or that depend on changed upstream nodes) re-execute. README §Notes states explicitly that unchanged duplicate submissions skip work. comfy/model_management.py handles VRAM tiers (--lowvram, --novram, --highvram, --cpu), model unload, and interrupt handling. main.py runs a background prompt_worker thread consuming an async PromptQueue. - **Out of scope:** Distributed multi-GPU orchestration across machines; automatic hyperparameter search.
