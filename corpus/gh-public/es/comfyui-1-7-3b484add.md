---
id: comfyui-1-7-3b484add
title: "ComfyUI-1 — modular node-graph engine for diffusion and generative media — 3.2 Non-goals"
visibility: public
importance: normal
source_repo: "ComfyUI-1"
related: ["comfyui-1"]
tags: ["comfyui-1", "github", "public", "normal", "summary"]
---

### 3.2 Non-goals - Replacing model training frameworks (PyTorch training loops are out of scope; inference and graph composition are in scope). - Bundling model weights in git (the models/ tree is placeholders; checkpoints are operator-supplied and gitignored). - Shipping the frontend source in this repo (UI is the separate comfyui-frontend-package wheel). - Stable ABI for every custom node on master between weekly releases (README release process warns that commits off stable tags may break extensions). - Offline-incompatible API nodes when enabled (those nodes call external providers; --disable-api-nodes restores fully offline core behavior).
