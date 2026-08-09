---
id: alvs-km-gw-5-11a77984
title: "ALVS km-gw — SharePoint-to-web gateway with AI-safe ChatUI router — 3. Product / idea"
visibility: private
importance: high
source_repo: "alvs-km-gw"
related: []
tags: ["alvs-km-gw", "github", "private", "high", "summary"]
---

## 3. Product / idea The central mental model is **two Fargate containers behind one ALB host**: the Astro SSR service owns all browser-facing pages; the Django ASGI service owns , , , and . PostgreSQL holds users, sessions, router audit rows, and domain data. Cognito authenticates via OIDC (Google federated through the org pool); Django owns sessions and all RBAC via Groups and DRF permission classes. The frontend delivers themed, localized-rendered pages (code and docs always English per ) with variable-driven CSS custom properties ( ). Users authenticate through → Cognito → , then interact with profile theming ( ), a component showcase ( ), and the ChatUI router ( ). HTMX sits in the interactivity ladder before Svelte islands for server-rendered fragments. Infrastructure mirrors the SROA production precedent on shared ALVS AWS: ECS clusters / , ECR repos and , Secrets Manager paths , Cloud Map for SSR-to-backend internal calls, and a Bedrock VPC interface endpoint so Fargate tasks reach inference without NAT gateways.
