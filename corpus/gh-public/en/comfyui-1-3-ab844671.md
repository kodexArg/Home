---
id: comfyui-1-3-ab844671
title: "ComfyUI-1 — modular node-graph engine for diffusion and generative media — P2 — GPU VRAM and model lifecycle are the bottleneck on real hardware"
visibility: public
importance: normal
source_repo: "ComfyUI-1"
related: ["comfyui-1"]
tags: ["comfyui-1", "github", "public", "normal", "summary"]
---
### P2 — GPU VRAM and model lifecycle are the bottleneck on real hardware

- **Who hurts:** Users on 8–12 GB consumer GPUs, multi-model workflows, and anyone running several large checkpoints in one session.
- **Pain today:** Naive loaders keep every model resident; switching checkpoints OOMs; low-VRAM hacks are manual and error-prone.
- **How this repo answers:** and implement **dynamic VRAM**, async weight offload, and aggressive unload policies controlled by CLI flags ( , , , , , , etc. in ). Execution caching ( ) defaults to RAM-pressure mode so unchanged node outputs are reused. Quantization support ( , ) enables FP8 and mixed-precision paths. CPU fallback ( ) exists for environments without accelerators.
- **Out of scope:** Guaranteeing performance on every exotic accelerator without platform-specific PyTorch builds (ROCm, XPU, Ascend, Cambricon, Iluvatar each have README install notes but remain operator responsibility).
