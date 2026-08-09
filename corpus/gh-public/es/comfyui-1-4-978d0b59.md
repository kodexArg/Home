---
id: comfyui-1-4-978d0b59
title: "ComfyUI-1 — modular node-graph engine for diffusion and generative media — P3 — Automation and production need the same graph the GUI edits"
visibility: public
importance: normal
source_repo: "ComfyUI-1"
related: ["comfyui-1"]
tags: ["comfyui-1", "github", "public", "normal", "summary"]
---

### P3 — Automation and production need the same graph the GUI edits - **Who hurts:** Pipeline engineers, batch operators, desktop/cloud integrators, and headless server admins. - **Pain today:** GUI-only tools cannot be queued, monitored, or embedded; separate inference servers duplicate model loading and diverge from artist workflows. - **How this repo answers:** exposes a long-lived **aiohttp** server (default ) with REST endpoints for prompt queueing, history, object metadata, uploads, jobs, assets, workflows, and settings. **WebSocket** at streams execution progress and binary preview events ( defines ). (~5k lines) is the machine-readable contract; and show minimal clients. Job APIs ( , cancel endpoints) support multi-client orchestration. Optional **API nodes** ( , 36 provider modules) call external closed-source models through Comfy's API-node layer, disable-able via . - **Out of scope:** Built-in multi-tenant auth for internet-facing deployments — default bind is localhost; exposing is an operator choice requiring external access control.
