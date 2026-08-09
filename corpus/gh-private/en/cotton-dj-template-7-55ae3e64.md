---
id: cotton-dj-template-7-55ae3e64
title: "Cotton Django Template — opinionated Django 5 starter for component-driven HTMX apps on AWS — 3. Product / idea"
visibility: private
importance: normal
source_repo: "cotton-dj-template"
related: []
tags: ["cotton-dj-template", "github", "private", "normal", "summary"]
---

## 3. Product / idea The central idea is a **specification-first Django template** that a developer (or AI agent) clones to get a production-minded foundation without re-deciding technology choices. The mental model is: **Current state (important):** The repository README states **"under construction."** The shallow clone contains only documentation (docs/), Spec Kit memory (constitution.md), Claude agent commands (.claude/commands/), GitHub issue templates, and PRD — **not** the planned apps/, config/, templates/, manage.py, or pyproject.toml. The PRD's 19 implementation phases are largely unchecked. This repo today functions as an **architectural specification vault** and agent harness prelude, not a runnable application. After the template is fully implemented, a consumer would: uv sync → configure .env from .env.example → docker-compose up for Postgres/Redis → uv run manage.py tailwind runserver → build features via Spec Kit workflow with cotton components and HTMX patterns.
