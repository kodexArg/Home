---
id: comfyui-1-8-42d7e30f
title: "ComfyUI-1 — modular node-graph engine for diffusion and generative media — 4. Technology stack"
visibility: public
importance: normal
source_repo: "ComfyUI-1"
related: ["comfyui-1"]
tags: ["comfyui-1", "github", "public", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python ≥3.10 (3.13 well supported per README) | pyproject.toml, README.md | | ML framework | PyTorch ecosystem (torch, torchvision, torchaudio, einops, kornia) | requirements.txt | | Diffusion / transformers | Hugging Face transformers, tokenizers, sentencepiece, safetensors | requirements.txt, comfy/ | | HTTP server | aiohttp + yarl | requirements.txt, server.py | | Frontend delivery | comfyui-frontend-package, comfyui-workflow-templates, comfyui-embedded-docs (pip) | requirements.txt | | Database | SQLite via SQLAlchemy 2.0, Alembic migrations | app/database/db.py, alembic.ini, alembic_db/versions/ | | Schema validation | Pydantic ~2.0, pydantic-settings | requirements.txt, app/assets/api/ | | VRAM / kitchen | comfy-kitchen, comfy-aimdo | requirements.txt, main.py | | Media I/O | Pillow, av (PyAV), scipy | requirements.txt | | API contract | OpenAPI 3 spec, Spectral lint | openapi.yaml, .spectral.yaml, .github/workflows/openapi-lint.yml | | Lint / CI | Ruff, Pylint config, pytest | pyproject.toml, pytest.ini, .github/workflows/ | | Tests | pytest unit (tests-unit/) and GPU integration (tests/) | tests-unit/, tests/, .github/workflows/test-ci.yml |
