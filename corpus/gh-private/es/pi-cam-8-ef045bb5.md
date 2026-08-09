---
id: pi-cam-8-ef045bb5
title: "Pi-Cam — async Telegram bot for RTSP capture on Raspberry Pi — 4. Technology stack"
visibility: private
importance: normal
source_repo: "pi-cam"
related: []
tags: ["pi-cam", "github", "private", "normal", "summary"]
---

## 4. Technology stack Derived from pyproject.toml, README.md, pytest.ini, and service implementations. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python ≥ 3.9 | pyproject.toml requires-python | | Package manager | uv (uv sync, uv run) | README.md, uv.lock (lock not ingested) | | Chat / input | python-telegram-bot 21+ (async Application, CommandHandler) | pyproject.toml, input_layer/telegram_bot.py | | Video / vision | OpenCV (cv2.VideoCapture, frame diff), FFmpeg CLI via ffmpeg-python | services/rtsp_capture.py, services/rtsp_motion_sense.py | | Config / validation | dataclasses + env loading, Pydantic models in Notifier | infrastructure/system_config.py, infrastructure/notifier.py | | Logging | Loguru + structured Notifier channels | infrastructure/notifier.py | | Concurrency | asyncio, run_in_executor for blocking capture | services/rtsp_capture.py, input_layer/telegram_bot.py | | Data / files | Local filesystem cache directory | infrastructure/cache_manager.py, .gitignore cache/ | | Infra / deploy | Manual on Raspberry Pi; no IaC in repo | absence of .github/, Dockerfile* | | Tests | pytest, pytest-asyncio, pytest-mock, pytest-cov | pyproject.toml optional dev deps, pytest.ini, TESTS.md |
