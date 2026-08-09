---
id: alvs-financial-gateway-7-300700fa
title: "ALVS Financial Gateway — treasury web application for Grupo ALVS — 3.2 Non-goals"
visibility: private
importance: high
source_repo: "alvs-financial-gateway"
related: []
tags: ["alvs-financial-gateway", "github", "private", "high", "summary"]
---

### 3.2 Non-goals - Redis or any external cache broker (DatabaseCache + LocMem only; Redis is prohibited by ADR). - Cognito groups or custom claims for RBAC (Django Groups only). - Smoke tests as CI or merge gates (owner directive; interactive kodex-only runs allowed). - Staging environment (dev local + prod cloud only). - NAT gateways in AWS VPC (accepted public-IP Fargate trade-off for cost). - Hardcoded account identifiers or credentials (everything through VARIABLES.md and Secrets Manager).
