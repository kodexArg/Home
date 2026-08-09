---
id: commce-0-8ddf49bf
title: "ComMCE — internal Django portal for MCE communications, slot stats, and environmental monitoring — ComMCE"
visibility: private
importance: normal
source_repo: "ComMCE"
related: []
tags: ["commce", "github", "private", "normal", "summary"]
---

# ComMCE > **Problem thesis (required):** ComMCE (Comunicación MCE) is a private, Spanish-facing **internal operations portal** for an MCE slot-floor environment. It unifies three concerns in one Django monolith served over classic server-rendered HTML: **staff communications** (short internal posts), **slot-machine statistics** (read-only views over legacy MySQL tables DDBB25 and TDATOS), and **environmental monitoring** (temperature/humidity time series from Raspberry Pi sensors in tb_temperatura on a second MySQL database). Authentication is Django session login; navigation links the three modules from shared Bootstrap nav bars. The codebase dates to 2019, targets Python 3.6 and Django 2.2, and includes a committed venv/ tree — it is operational legacy software, not a modern deployable template.
