---
id: kdx-pi-cam-8-dbe1c9ed
title: "kdx-pi-cam — async Telegram bot for RTSP camera motion alerts — 4. Technology stack"
visibility: public
importance: normal
source_repo: "kdx-pi-cam"
related: ["kdx-pi-cam"]
tags: ["kdx-pi-cam", "github", "public", "normal", "summary"]
---

## 4. Technology stack Derived from pyproject.toml, README.md, and module imports. Lockfile (uv.lock) present for reproducible installs; not summarized here. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python ≥ 3.11 | pyproject.toml requires-python | | Package manager | uv | pyproject.toml [tool.uv], uv.lock, README.md install steps | | Bot / messaging | python-telegram-bot ≥ 20 (async) | pyproject.toml, bot_handler.py | | Video capture | OpenCV VideoCapture on RTSP | video_processor.py | | Clip encoding | FFmpeg via ffmpeg-python (libx264) | video_processor.py generate_clip | | Motion CV | OpenCV absdiff, threshold, contours | motion_detector.py | | Image export | Pillow (JPEG from frame) | motion_detector.py generate_photo | | Config validation | Pydantic v2 + pydantic-settings | config.py AppConfig | | System metrics | psutil (CPU throttle) | video_processor.py | | Env loading | python-dotenv (via pydantic-settings .env) | config.py model_config | | Tests | pytest, pytest-asyncio, pytest-cov (dev) | pyproject.toml, tests/ | | Build | hatchling | pyproject.toml [build-system] |
