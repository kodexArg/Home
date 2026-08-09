---
id: alvs-financial-gateway-5-cff96bff
title: "ALVS Financial Gateway — treasury web application for Grupo ALVS — 3. Product / idea"
visibility: private
importance: high
source_repo: "alvs-financial-gateway"
related: []
tags: ["alvs-financial-gateway", "github", "private", "high", "summary"]
---
## 3. Product / idea

ALVS Financial Gateway is a **two-service web application**: an Astro 7 SSR + Svelte 5 frontend and a Django 6 + DRF backend, each running as its own AWS Fargate task behind a shared ALB. PostgreSQL holds authoritative operational state. Cognito (federated through Google) authenticates; Django Groups authorize. Bedrock powers two disjoint AI tiers — a closed-enum navigation router ( ) and a read-only page-context assistant ( ). The mental model for treasury data is **ingest → compute → render**: 1. SharePoint workbooks are ingested into normalized tables with real stamps. 2. Pure computation services assemble positions, projections, and reports server-side (one call feeds Posición, Posición Bancaria, and Holding views). 3. The Astro frontend SSR-fetches composed payloads (e.g. ) to avoid client waterfalls, renders Spanish labels from a frontend catalog, and scopes by . Users land on a role-gated lobby ( ) or their configured , switch company scope via the navbar, and navigate eleven treasury views plus profile, control panel, chat UI, and a component showcase. Theme, sidebar side, and chat drawer preferences are user-tunable and persisted via .
