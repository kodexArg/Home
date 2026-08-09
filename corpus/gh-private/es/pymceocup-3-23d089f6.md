---
id: pymceocup-3-23d089f6
title: "PyMceOcup — Casino Mendoza slot occupancy ETL — P2 — Many daily occupation files need one consolidated report"
visibility: private
importance: low
source_repo: "PyMceOcup"
related: []
tags: ["pymceocup", "github", "private", "low", "summary"]
---

### P2 — Many daily occupation files need one consolidated report - **Who hurts:** Analysts or supervisors who need cross-day, cross-device occupancy trends rather than isolated daily CSVs. - **Pain today:** The csvs/ directory accumulates hundreds of files in two naming conventions. The *-daily-device_ocupation.csv files are one row per device per day with hourly percentage columns — useless for spreadsheet pivoting until merged. - **How this repo answers:** join_csvs.py scans ./csvs, filters filenames ending in ocupation.csv, loads each with pandas, concatenates into a single DataFrame, and writes ocupacion.xlsx (sheet ocup, two-decimal float formatting, empty-string NA replacement). - **Out of scope:** Merging the alternate Mendoza_Sesion_YYYYMMDD.csv session reports (different schema, not handled by join_csvs.py); deduplication; incremental updates; database loading.
