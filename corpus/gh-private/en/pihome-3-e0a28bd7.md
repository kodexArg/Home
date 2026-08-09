---
id: pihome-3-e0a28bd7
title: "PiHome — Django multimedia hub for Raspberry Pi — P2 — Repeatable Django project skeleton on Pi-class hardware"
visibility: private
importance: normal
source_repo: "PiHome"
related: []
tags: ["pihome", "github", "private", "normal", "summary"]
---

### P2 — Repeatable Django project skeleton on Pi-class hardware - **Who hurts:** A developer standing up another Pi-side Django service who wants a known project layout (settings, WSGI, one domain app, shell runners). - **Pain today:** Each Pi experiment starts from django-admin startproject with no opinionated media paths, locale, or MySQL wiring. - **How this repo answers:** Ships a complete (if dated) Django 2.2 project with MEDIA_ROOT / MEDIA_URL, MySQL DATABASES block, es-ar language and Mendoza timezone, Bootstrap 4 via django-bootstrap4, and helper shell scripts (run.sh, src.sh) for activating a venv and launching runserver. - **Out of scope:** Production hardening (the committed settings use debug mode and empty allowed hosts), container orchestration, or infrastructure-as-code.
