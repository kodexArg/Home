---
id: dj-crudo-5-64606acb
title: "dj-crudo — Django WiFi captive portal and survey CRUD — 3. Product / idea"
visibility: private
importance: normal
source_repo: "dj-crudo"
related: []
tags: ["dj-crudo", "github", "private", "normal", "summary"]
---

## 3. Product / idea The mental model is a **two-layer Django monolith in Docker**: 1. **Portal layer** — Google OAuth login at and , trilingual connected/disconnected messaging. 2. **Survey layer** — CRUD intake at and , backed by PostgreSQL. 3. **Host bridge layer (optional)** — Named FIFO pipe from container to host for shell command execution, intended for management. The Django project lives under with settings module . The root at repo root is empty (zero bytes); the real entrypoint is . Production-oriented runs **Gunicorn** on port 8000; overrides for dev: runs migrations, seeds a superuser via Django shell, and starts .
