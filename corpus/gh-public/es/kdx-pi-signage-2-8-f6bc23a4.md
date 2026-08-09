---
id: kdx-pi-signage-2-8-f6bc23a4
title: "KDX Pi Signage 2 — headless Raspberry Pi digital signage from Google Drive — 4. Technology stack"
visibility: public
importance: normal
source_repo: "kdx-pi-signage-2"
related: ["kdx-pi-signage-2"]
tags: ["kdx-pi-signage-2", "github", "public", "normal", "summary"]
---

## 4. Technology stack Derived from pyproject.toml, uv.lock (versions signal only), and docs/03-technical-specifications.md. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python ≥ 3.8 | pyproject.toml requires-python | | Package manager | uv (uv sync, uv run) | README.md, pyproject.toml, uv.lock | | Multimedia | VLC via python-vlc ≥ 3.0 | pyproject.toml, app/infrastructure.py VLCPlayer | | Cloud sync | Google Drive API (google-api-python-client, google-auth, oauthlib, httplib2) | pyproject.toml, GoogleDriveRepository | | Config / validation | pydantic ≥ 2, pydantic-settings ≥ 2 | pyproject.toml | | Resilience | tenacity ≥ 8 | pyproject.toml | | Async I/O | aiofiles ≥ 23 (declared; sync threading used in app code today) | pyproject.toml | | Optional YouTube | yt-dlp ≥ 2023 ([project.optional-dependencies] youtube) | pyproject.toml, README.md | | Dev / quality | pytest, pytest-asyncio, black, isort, mypy, ruff | pyproject.toml [project.optional-dependencies] dev | | Build | hatchling | pyproject.toml [build-system] | | Data | Local filesystem only (no database) | app/application.py, docs/03-technical-specifications.md | | Infra / deploy | Manual / systemd on Pi; no CI workflows in repo | tree scan (no .github/) | | AI / agents | None — no .claude/, .agents/, or skill trees present | tree scan | | Tests |
