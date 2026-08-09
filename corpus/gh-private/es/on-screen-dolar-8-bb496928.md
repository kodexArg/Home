---
id: on-screen-dolar-8-bb496928
title: "on-screen-dolar — fullscreen TV exchange-rate marquee with Telegram price updates — 4. Technology stack"
visibility: private
importance: normal
source_repo: "on-screen-dolar"
related: []
tags: ["on-screen-dolar", "github", "private", "normal", "summary"]
---

## 4. Technology stack Derived from requirements.txt, module imports, and README.md. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3 (pinned deps circa 2023) | requirements.txt, *.py | | Display / video | OpenCV 4.7, NumPy 1.24 | onscreen.py, requirements.txt | | Image / text | Pillow 9.5, custom TTF fonts | onscreen.py, src/fonts/ | | Remote control | python-telegram-bot 20.3 | bot.py, requirements.txt | | Logging | loguru 0.7 | bot.py, onscreen.py (import only in bot) | | HTTP (transitive) | httpx, httpcore, anyio | requirements.txt | | Data | Local JSON file | src/prices.json | | Infra / deploy | None evident — local Python process on display machine | no CI, Docker, or IaC | | AI / agents | None | no .claude/, .agents/, or skills | | Tests | None | no test configs |
