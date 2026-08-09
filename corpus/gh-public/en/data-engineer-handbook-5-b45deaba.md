---
id: data-engineer-handbook-5-b45deaba
title: "Data Engineering Handbook — curated learning hub and bootcamp labs — 3. Product / idea"
visibility: public
importance: normal
source_repo: "data-engineer-handbook"
related: ["data-engineer-handbook"]
tags: ["data-engineer-handbook", "github", "public", "normal", "summary"]
---

## 3. Product / idea The repository behaves as a **two-layer product**: 1. **Handbook layer (root):** Markdown indexes that function as a community-maintained bibliography and directory. The root is the master document — thousands of lines covering books, communities, orchestration and warehouse vendors, analytics tools, LLM libraries, real-time stacks, engineering blogs, whitepapers, social creators, podcasts, newsletters, glossaries, design patterns, courses, and cloud certifications. Smaller topical files split out books, communities, newsletters, interviews, and projects for focused reading. 2. **Bootcamp layer ( ):** A syllabus ( ) aligned to a free six-week YouTube data engineering bootcamp, plus listing learner prerequisites (Docker, Python 3.11+, SQL IDE). The only shipped lab module in the shallow clone is **Week 1 — Dimensional Data Modeling**, which teaches Postgres-backed modeling with NBA-style player/game datasets and actor/film homework scenarios. Mental model for the lab: clone → copy env template → or → connect with DataGrip/DBeaver/psql → run lecture SQL and complete homework DDL/queries. The entrypoint restores via and optionally runs homework SQL from a mounted homework directory. The org copy tracks pointing at the original handbook; content is overwhelmingly curated markdown and SQL didactics rather than application source code.
