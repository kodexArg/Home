---
id: alvs-finanzas-2-a2a4e9d5
title: "alvs-finanzas — ALVS internal finanzas web app on the astro-drf-aws harness — P1 — Repeatable internal web-app delivery for ALVS finanzas"
visibility: private
importance: high
source_repo: "alvs-finanzas"
related: []
tags: ["alvs-finanzas", "github", "private", "high", "summary"]
---

### P1 — Repeatable internal web-app delivery for ALVS finanzas - **Who hurts:** ALVS engineering and product owners who need another authenticated internal tool without reinventing ECS, ALB routing, Cognito, RDS, and CI/CD each time. - **Pain today:** One-off stacks drift on auth, caching, secrets handling, and deploy mechanics; finanzas features get blocked on infrastructure decisions. - **How this repo answers:** Forks the battle-tested layout: (Astro 7 SSR + Svelte islands) and (Django 6 + DRF) behind a shared ALB with path-based routing ( , → backend; catch-all → frontend). documents the two-Fargate, no-NAT, no-CDN, Secrets Manager-only pattern. Root reproduces Postgres + backend + frontend locally with profiles , , , . - **Out of scope:** Multi-tenant SaaS, public marketing sites, edge CDN caching, Redis/ElastiCache, or a staging environment tier (only and exist per ADR doctrine).
