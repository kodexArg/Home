---
id: comfyui-6-6c0a81b3
title: "ComfyUI — modular node-graph Stable Diffusion GUI, API, and inference backend — 3. Product / idea"
visibility: private
importance: normal
source_repo: "ComfyUI"
related: []
tags: ["comfyui", "github", "private", "normal", "summary"]
---

## 3. Product / idea ComfyUI is a **local-first diffusion runtime** packaged as three cooperating layers: 1. **Core inference library (comfy/)** — PyTorch implementations of SD1.x/2.x/SDXL loaders, samplers (k_diffusion/, extra_samplers/), VAE, CLIP, ControlNet, GLIGEN, LoRA application, latent formats, and model detection/patching. This is the “engine.” 2. **Node registry and executor (nodes.py, comfy_extras/, execution.py)** — Python classes declaring INPUT_TYPES, RETURN_TYPES, and a FUNCTION entrypoint. NODE_CLASS_MAPPINGS is the plugin registry; init_custom_nodes() loads bundled extras then scans custom_nodes/. 3. **Server + web UI (server.py, main.py, web/)** — aiohttp serves the static LiteGraph frontend and JSON/WebSocket APIs. A daemon thread drains the prompt queue while the asyncio loop handles I/O and pushes progress, executing, and preview events to connected clients. The mental model: **a workflow is a JSON dict of node IDs → {class_type, inputs}**, not a linear script. Inputs reference upstream outputs as [node_id, output_index] tuples. The executor validates types, resolves the DAG, and runs output nodes (e.g. SaveImage) and their ancestors. User settings and multi-user profiles (optional) persist under user/ via app/user_manager.py.
