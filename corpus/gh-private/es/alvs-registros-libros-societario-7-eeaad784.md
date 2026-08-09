---
id: alvs-registros-libros-societario-7-eeaad784
title: "ALVS Registro de Libros Societarios — corporate registry web application for Grupo ALVS — 3. Product / idea"
visibility: private
importance: high
source_repo: "ALVS-REGISTROS-LIBROS-SOCIETARIOS-KODEXARG"
related: []
tags: ["alvs-registros-libros-societarios-kodexarg", "github", "private", "high", "summary"]
---

## 3. Product / idea ALVS Registro de Libros Societarios is a **two-service web application** built on the kodexArg template: Astro 7 SSR + Svelte 5 frontend and Django 6 + DRF backend, each as an AWS Fargate service behind a shared ALB. PostgreSQL 17 holds all operational state. Cognito (Google-federated OIDC) authenticates; Django Groups plus per-entity EntityPermission grants authorize. The default UI locale is Spanish (frontend/src/i18n/config.ts sets es); code, API paths, models, and documentation remain English per ADR. The mental model has four cooperating layers: 1. **Corporate registry core** — Entities are the aggregate root. Each entity owns statutory Books containing numbered Folios. Shareholders are firm-wide; Shareholding rows attach them to entities. Officers, assembly checklists, and entity documents hang off the entity detail surface. 2. **Compliance ring** — Reminders, findings, beneficial owners, tax obligations with generated due dates, regulatory filings, and administrative proceedings/renewals provide operational compliance tracking with entity scoping. 3. **Litigation ring** — Case files, docket events, procedural deadlines, powers of attorney, monetary indexes, regulated fees, and pleading templates serve firm-wide legal work (not entity-gated reads). 4. **Assistant + router** — A closed-enum ChatUI router (POST /api/router/route/) uses Bedrock Nova
