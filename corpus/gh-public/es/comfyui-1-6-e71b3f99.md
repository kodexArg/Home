---
id: comfyui-1-6-e71b3f99
title: "ComfyUI-1 — modular node-graph engine for diffusion and generative media — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "ComfyUI-1"
related: ["comfyui-1"]
tags: ["comfyui-1", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Artist iteration** — build a text-to-image graph with checkpoint loader, CLIP encode, KSampler, VAE decode; tweak seed and prompt; only affected nodes re-run. 2. **Template workflow** — open a blueprint from blueprints/ (e.g. Flux dev, Wan 2.2 video, Hunyuan3D) and adapt parameters without reconstructing the graph. 3. **Headless batch** — POST workflow JSON to /prompt or /api/prompt; poll /queue and /history; retrieve images via /view. 4. **Low-VRAM machine** — launch with dynamic VRAM defaults; run models that would not fit if all weights stayed on GPU. 5. **Asset library** (opt-in) — start with --enable-assets; ingest outputs into SQLite-backed asset catalog with Blake3 hashing, tags, and content API.
