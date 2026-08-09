---
id: comfyui-4-eb54e26a
title: "ComfyUI — modular node-graph Stable Diffusion GUI, API, and inference backend — P3 — Headless API and automation over the same graphs"
visibility: private
importance: normal
source_repo: "ComfyUI"
related: []
tags: ["comfyui", "github", "private", "normal", "summary"]
---

### P3 — Headless API and automation over the same graphs - **Who hurts:** Developers building batch generators, CI image regression tests, Colab/Jupyter notebooks, or external frontends that must queue the same workflows the GUI uses. - **Pain today:** GUI-only tools force screen-scraping or duplicate inference code paths; API layers often lag behind UI features. - **How this repo answers:** server.py (PromptServer) serves REST endpoints and a WebSocket channel on port 8188 by default. Clients POST JSON prompts to /prompt, poll /history, stream progress on /ws, and fetch images via /view. script_examples/basic_api_example.py and script_examples/websockets_api_example.py demonstrate queue + completion patterns. /object_info introspects all registered node classes for dynamic client builders. - **Out of scope:** Built-in authentication, rate limiting, or multi-tenant cloud deployment — the server binds to loopback by default and assumes a trusted local operator.
