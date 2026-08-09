---
id: dj-rpi-monitor-8-ed7b7010
title: "dj-rpi-monitor — lightweight Django IoT dashboard for Raspberry Pi temperature and humidity — 4.1 Notable dependencies (curated)"
visibility: private
importance: low
source_repo: "dj-rpi-monitor"
related: []
tags: ["dj-rpi-monitor", "github", "private", "low", "summary"]
---

### 4.1 Notable dependencies (curated) - django + djangorestframework — core web stack and JSON ingest/query API. - django-htmx — detects HTMX requests in latest_data_table to return row fragments vs full table wrapper. - plotly — server-side chart generation with Plotly Express line charts. - python-dotenv — loads SECRET_KEY, DEBUG, ALLOWED_HOSTS, and database env vars from .env (file gitignored; not read during summary). - loguru — structured stderr logging for ingest success/failure in SensorDataAPIView. - pytz — comment in requirements notes intent to convert API timestamps from UTC to GMT-3 (Argentina). - pandas — listed in requirements with comment "iba a pasar…" (planned migration); no active pandas usage found in committed core/ views. - pyperclip — explicitly marked non-production (for a describe-project.py script in gitignored scripts/).
