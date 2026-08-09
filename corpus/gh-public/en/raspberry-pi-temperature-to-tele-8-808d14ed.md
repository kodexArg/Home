---
id: raspberry-pi-temperature-to-tele-8-808d14ed
title: "raspberry-pi-temperature-to-telegram — Raspberry Pi DHT sensor logger with Telegram remote monitoring — 4. Technology stack"
visibility: public
importance: normal
source_repo: "raspberry-pi-temperature-to-telegram"
related: ["raspberry-pi-temperature-to-telegram"]
tags: ["raspberry-pi-temperature-to-telegram", "github", "public", "normal", "summary"]
---

## 4. Technology stack Derived from requirements.txt, source imports, and installation/ artifacts. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.9+ (README states 3.9 on Pi) | README.md, requirements.txt | | Sensor / GPIO | adafruit-circuitpython-dht (DHT11/DHT22 via board pin) | kweed_utils/getth.py, README checkpoint | | Scheduler | APScheduler 3.6 (BackgroundScheduler, UTC, 5s interval) | app.py, requirements.txt | | Database | MariaDB (native mariadb connector + SQLAlchemy for reads) | kweed_utils/db.py, kweed_utils/chart_th.py, installation/rpi.sql | | Telegram | python-telegram-bot 20.0b0 (async, ApplicationBuilder, polling) | kweed_utils/telegram_bot.py | | Charting | Plotly Express + Kaleido (PNG export), Pandas resampling | kweed_utils/chart_th.py | | Camera | OpenCV (cv2.VideoCapture) | kweed_utils/take_a_pic.py | | Config | python-dotenv (.env loading) | multiple kweed_utils/*.py | | Logging | loguru | app.py, kweed_utils/db.py, kweed_utils/chart_th.py | | Process manager | systemd (kweed.service) | installation/kweed.service | | Dev tooling | Black formatter (VS Code setting) | .vscode/settings.json, requirements.txt | | Backup script | Bash + mysqldump + gzip (AWS S3 upload commented out) | installation/mariadbcopy.sh |
