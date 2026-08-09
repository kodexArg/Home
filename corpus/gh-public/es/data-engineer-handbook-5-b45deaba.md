---
id: data-engineer-handbook-5-b45deaba
title: "Data Engineering Handbook — curated learning hub and bootcamp labs — 3. Product / idea"
visibility: public
importance: normal
source_repo: "data-engineer-handbook"
related: ["data-engineer-handbook"]
tags: ["data-engineer-handbook", "github", "public", "normal", "summary"]
---

## 3. Product / idea The repository behaves as a **two-layer product**: 1. **Handbook layer (root):** Markdown indexes that function as a community-maintained bibliography and directory. The root README.md is the master document — thousands of lines covering books, communities, orchestration and warehouse vendors, analytics tools, LLM libraries, real-time stacks, engineering blogs, whitepapers, social creators, podcasts, newsletters, glossaries, design patterns, courses, and cloud certifications. Smaller topical files split out books, communities, newsletters, interviews, and projects for focused reading. 2. **Bootcamp layer (bootcamp/):** A syllabus (introduction.md) aligned to a free six-week YouTube data engineering bootcamp, plus software.md listing learner prerequisites (Docker, Python 3.11+, SQL IDE). The only shipped lab module in the shallow clone is **Week 1 — Dimensional Data Modeling**, which teaches Postgres-backed modeling with NBA-style player/game datasets and actor/film homework scenarios. Mental model for the lab: clone → copy env template → make up or docker compose up → connect with DataGrip/DBeaver/psql → run lecture SQL and complete homework DDL/queries. The init-db.sh entrypoint restores data.dump via pg_restore and optionally runs homework SQL from a mounted homework directory. The kodexArg org copy tracks upstream pointing at the original DataExpert-io
