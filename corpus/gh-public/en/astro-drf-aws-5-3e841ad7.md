---
id: astro-drf-aws-5-3e841ad7
title: "astro-drf-aws — Astro SSR + Django DRF template on AWS Fargate — 3. Product / idea"
visibility: public
importance: high
source_repo: "astro-drf-aws"
related: ["astro-drf-aws"]
tags: ["astro-drf-aws", "github", "public", "high", "summary"]
---

## 3. Product / idea The central mental model is **two Docker services on Fargate** — frontend (Astro SSR on port 4321, bun runtime) and backend (Django ASGI on port 8000, uvicorn workers) — fronted by a **shared per-environment ALB** that path-splits , , , , , to the backend and everything else to the frontend. SSR fetches the backend via **Cloud Map private DNS** ( ), never through the public ALB. PostgreSQL 17 on RDS holds Django models, sessions, and cache tables. Secrets live in AWS Secrets Manager ( ); the frontend receives only plain env vars. Above the runtime sits the **harness**: an Obsidian-flavored vault (wikilinks, ADRs, BDD/TDD specs), vendored skills under , guardian subagents ( , , ), nine Claude lifecycle hooks under , and a workflow cast ( agents). Agents must hold and in memory at all times; the ABC gate (PRD → constitution → ADRs → API) governs every change. All three construction stages are **complete** per and : documents & harness structure, harness construction (skills, hooks, guardians), and project construction (backend through TDD, frontend, deploy pipeline, ephemeral reference run).
