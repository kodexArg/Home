---
id: pymceocup-4-ecfead53
title: "PyMceOcup — Casino Mendoza slot occupancy ETL — 3. Product / idea"
visibility: private
importance: low
source_repo: "PyMceOcup"
related: []
tags: ["pymceocup", "github", "private", "low", "summary"]
---

## 3. Product / idea PyMceOcup is not a deployable service. It is a **two-script ETL pair** plus a large static dataset: 1. **Ingest path** — download_emails.py is the upstream fetcher: IMAP → local CSV files (written to the working directory, not automatically into csvs/). 2. **Transform path** — join_csvs.py is the downstream aggregator: csvs/*-daily-device_ocupation.csv → ocupacion.xlsx. 3. **Data lake** — csvs/ holds ~306 committed CSV snapshots (167 session reports + 139 daily occupation files) spanning roughly March–August 2021, plus an ~8 MB pre-built ocupacion.xlsx. 4. **Placeholder** — app.py exists but is empty (0 bytes); no Flask/Django/FastAPI application was implemented. The mental model is **mailbox → flat files → Excel workbook**, entirely batch-oriented and run on an operator workstation.
