---
id: comfyui-5-b667c2fe
title: "ComfyUI — modular node-graph Stable Diffusion GUI, API, and inference backend — P4 — Running SD on constrained or diverse hardware"
visibility: private
importance: normal
source_repo: "ComfyUI"
related: []
tags: ["comfyui", "github", "private", "normal", "summary"]
---

### P4 — Running SD on constrained or diverse hardware - **Who hurts:** Users with &lt;3 GB VRAM GPUs, CPU-only hosts, AMD ROCm Linux boxes, Apple Silicon, Intel Arc, or Windows DirectML paths. - **Pain today:** Single-code-path UIs assume 8+ GB NVIDIA CUDA and fail obscurely elsewhere. - **How this repo answers:** comfy/cli_args.py exposes a large matrix of device and precision flags (--directml, --force-fp16, fp8 UNET modes, attention backends, --disable-xformers, etc.). README documents per-vendor install commands and env overrides (HSA_OVERRIDE_GFX_VERSION). --lowvram auto-enables on small cards; --cpu forces CPU inference. - **Out of scope:** Guaranteed performance parity across vendors; automatic driver installation.
