---
id: comfyui-7-82e86a00
title: "ComfyUI — modular node-graph Stable Diffusion GUI, API, and inference backend — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "ComfyUI"
related: []
tags: ["comfyui", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Interactive experimentation:** Operator loads checkpoints into models/checkpoints/, builds a txt2img or SDXL graph in the browser, queues with Ctrl+Enter, tweaks seeds or LoRA weights, and benefits from partial re-execution on subsequent runs. 2. **Advanced technique stacks:** Wire ControlNet, regional conditioning (area composition), inpainting, latent upscales, model merges, or video diffusion nodes from comfy_extras/nodes_video_model.py without leaving the graph paradigm. 3. **Headless batch / integration:** External Python or any HTTP client posts API-format prompts (enabled via UI dev mode per script_examples/basic_api_example.py), listens on WebSocket for completion, downloads results from /history + /view. 4. **Extension authoring:** Developer drops a package into custom_nodes/ implementing NODE_CLASS_MAPPINGS (see custom_nodes/example_node.py.example) and optional WEB_DIRECTORY for frontend JS extensions under web/extensions/. 5. **Shared model libraries:** Operator copies extra_model_paths.yaml.example → extra_model_paths.yaml (gitignored) to point at checkpoints shared with A1111 or another Comfy install.
