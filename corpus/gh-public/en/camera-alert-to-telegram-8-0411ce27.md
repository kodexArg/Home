---
id: camera-alert-to-telegram-8-0411ce27
title: "Camera Alert to Telegram — IP camera motion detection with Telegram alerts — 4. Technology stack"
visibility: public
importance: normal
source_repo: "camera-alert-to-telegram"
related: ["camera-alert-to-telegram"]
tags: ["camera-alert-to-telegram", "github", "public", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.x | requirements.txt, shebang in app.py | | Computer vision | OpenCV 4.9 (opencv-python), NumPy | requirements.txt, app.py | | Messaging | python-telegram-bot 20.7 (async) | requirements.txt, app.py | | Logging | Loguru (console + daily rotating files) | requirements.txt, app.py | | Configuration | python-dotenv + argparse | config.py, README.md | | Frontend | N/A | — | | Backend / API | N/A (Telegram bot only) | app.py | | Data | Local filesystem (./videos, ./motion_pictures, ./logs) | config.py | | Infra / deploy | Manual python app.py on host (README cites Raspberry Pi 3) | README.md | | AI / agents | None | — | | Tests | None evident | — |
