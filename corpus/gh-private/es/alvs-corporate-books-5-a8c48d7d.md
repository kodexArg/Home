---
id: alvs-corporate-books-5-a8c48d7d
title: "ALVS Corporate Books — statutory registers, compliance, and litigation on Astro + Django — 3. Product / idea"
visibility: private
importance: high
source_repo: "alvs-corporate-books"
related: []
tags: ["alvs-corporate-books", "github", "private", "high", "summary"]
---

## 3. Product / idea The mental model is **two Dockerized services in production** — backend (ASGI uvicorn on port 8000) and frontend (Astro SSR on port 4321) — fronted by a shared ALB with host-based routing: API, accounts, admin, and static/media paths hit Django; everything else is SSR from Astro. SSR fetches the backend via Cloud Map private DNS ( ), never through the public load balancer. PostgreSQL (RDS in cloud, container locally) holds all domain state. Redis is explicitly prohibited ( ); caching uses Django database cache, HTTP cache headers, and in-process patterns. The product grew from the template but is no longer that template: project slug , owner-chosen production host (documented in and ), persistent footprint never torn down (ADR-29). Features are added by **new domain routes and TDD/BDD entries**, not by rewriting the harness. User journey (simplified): authenticate via Cognito → land in lobby/home → browse entities → drill into books, cap table, officers, compliance cards, litigation cases → act through forms gated by and entity permissions → optionally open chat drawer for page-context Q&A or use the chatui router for safe navigation intents.
