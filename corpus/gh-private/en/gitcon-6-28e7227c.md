---
id: gitcon-6-28e7227c
title: "GITCon — GIC gym analytics console (Django shell + Oracle reporting scripts) — 3.1 North-star use cases"
visibility: private
importance: low
source_repo: "GITCon"
related: []
tags: ["gitcon", "github", "private", "low", "summary"]
---

### 3.1 North-star use cases 1. **Weekly active-member report** — analyst runs PyGic/main.py, gets a 14-week rolling window of unique members per session day, reviews printed dataframe (charts were intended but commented out). 2. **Session-day normalization** — operator applies the 10:00 rule so early-morning visits count toward the prior business session day, matching gym operating semantics. 3. **Django admin exploration** — developer starts the dev server and uses stock Django admin on SQLite (no custom models registered).
