---
id: comfyui-1-5-742bbbc3
title: "ComfyUI-1 — modular node-graph engine for diffusion and generative media — 3. Product / idea"
visibility: public
importance: normal
source_repo: "ComfyUI-1"
related: ["comfyui-1"]
tags: ["comfyui-1", "github", "public", "normal", "summary"]
---
## 3. Product / idea

ComfyUI is three surfaces on one engine: 1. **Interactive graph editor** — browser UI loaded by from the pip frontend package; users place nodes, connect wires, queue prompts, inspect history. 2. **Inference runtime** — bootstraps paths, optional ComfyUI-Manager, database, custom nodes, then starts in . receives a prompt JSON, validates inputs ( ), walks the graph with caching, dispatches each node class from , and streams progress. 3. **Extensibility plane** — (gitignored except example) loads community extensions; versions the node authoring API ( , , ); ships first-party extra nodes (video, audio, ControlNet helpers, merging, etc.). The mental model: **models live on disk** under (checkpoints, VAE, LoRA, ControlNet, etc. — directory scaffold is committed, weights are not), **graphs are JSON**, **execution is incremental**, and **state** (settings, userdata, assets) increasingly lives in a local **SQLite** database migrated by Alembic. The kodexArg fork adds no visible product divergence in-tree: it mirrors upstream (latest commit at scan: advanced Krea 2 model-merging node). Operators treating this as kodexArg infrastructure get upstream Comfy core with an extra remote for pulling Comfy-Org changes.
