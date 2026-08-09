---
id: rpi-door-access-rfid-8-3844a268
title: "rpi-door-access-rfid — Raspberry Pi RFID shower-door access control with admin panel — 4. Technology stack"
visibility: public
importance: normal
source_repo: "rpi-door-access-rfid"
related: ["rpi-door-access-rfid"]
tags: ["rpi-door-access-rfid", "github", "public", "normal", "summary"]
---

## 4. Technology stack Derived from requirements.txt, package.json, PRD.md, ADRs, and app/ structure. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.x | requirements.txt, run.py shebang | | Web framework | FastAPI 0.136 + Uvicorn 0.44 | requirements.txt, app/main.py | | ORM / data | SQLAlchemy 2.0 + SQLite (WAL) | requirements.txt, app/infrastructure/database.py | | Templates / UI | Jinja2 + HTMX 2 + Alpine.js | app/templates/, app/static/vendor/ | | CSS | Tailwind CSS 3 (build script) | package.json, tailwind.config.js, scripts/build-css.sh | | Auth | JWT HS256 (python-jose), passlib/bcrypt | app/core/security.py, requirements.txt | | GPIO / RFID | gpiozero, mfrc522, spidev | requirements.txt, app/infrastructure/hardware/gpio_impl.py | | Settings | pydantic-settings | app/core/config.py | | Tests | pytest, pytest-asyncio, pytest-cov, httpx | requirements.txt, tests/ | | Infra / deploy | Manual on Pi (no CI workflow in tree) | ADR 0003 mentions future GitHub Actions; no .github/ present | | AI / agents | AGENTS.md, skills/ tree, skills.sh dispatcher | AGENTS.md, skills/README.md |
