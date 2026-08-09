---
id: comfyui-1-0-86f759e9
title: "ComfyUI-1 — modular node-graph engine for diffusion and generative media — ComfyUI-1"
visibility: public
importance: normal
source_repo: "ComfyUI-1"
related: ["comfyui-1"]
tags: ["comfyui-1", "github", "public", "normal", "summary"]
---

# ComfyUI-1 > **Problem thesis (required):** ComfyUI exists because script-based or monolithic UIs for diffusion models hide the composable structure of modern generative pipelines — checkpoints, CLIP encoders, ControlNets, LoRAs, samplers, latent ops, and post-processing each deserve first-class, reusable blocks. ComfyUI exposes that structure as a **node graph**: users wire typed inputs and outputs, queue runs, and iterate without re-running unchanged subgraphs. The kodexArg repository is a **public mirror-fork** of the upstream Comfy-Org ComfyUI core (version **0.26.0** at scan time), tracking with pointing at Comfy-Org/ComfyUI and at kodexArg/ComfyUI-1. It ships the full Python backend, execution engine, built-in nodes, optional cloud API nodes, asset database layer, OpenAPI contract, and workflow blueprint library — while the browser UI is delivered as a separate pip package.
