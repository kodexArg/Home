---
id: procesarocupacion-7-11296f18
title: "ProcesarOcupacion — IMAP harvester for casino device-occupation CSV reports — 4. Technology stack"
visibility: private
importance: normal
source_repo: "ProcesarOcupacion"
related: []
tags: ["procesarocupacion", "github", "private", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3 (shebang #!/usr/bin/python) | main.py, imap.py | | Email / IMAP | imap_tools (active); imaplib + email (prototype) | main.py, imap.py | | Data format | CSV (comma-separated, header row) | 20210122-daily-device_ocupation.csv, Mendoza_Sesion_20210115.csv | | Frontend | none | — | | Backend / API | none (batch script) | — | | Data | Local filesystem (CSV files in repo root) | *.csv files | | Infra / deploy | Manual execution; no CI detected | tree scan | | AI / agents | none | .claude/ absent | | Tests | none | — |
