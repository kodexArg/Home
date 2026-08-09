---
id: pymceocup-4-ecfead53
title: "PyMceOcup — Casino Mendoza slot occupancy ETL — 3. Product / idea"
visibility: private
importance: low
source_repo: "PyMceOcup"
related: []
tags: ["pymceocup", "github", "private", "low", "summary"]
---
## 3. Product / idea

PyMceOcup is not a deployable service. It is a **two-script ETL pair** plus a large static dataset: 1. **Ingest path** — is the upstream fetcher: IMAP → local CSV files (written to the working directory, not automatically into ). 2. **Transform path** — is the downstream aggregator: → . 3. **Data lake** — holds ~306 committed CSV snapshots (167 session reports + 139 daily occupation files) spanning roughly March–August 2021, plus an ~8 MB pre-built . 4. **Placeholder** — exists but is empty (0 bytes); no Flask/Django/FastAPI application was implemented. The mental model is **mailbox → flat files → Excel workbook**, entirely batch-oriented and run on an operator workstation.
