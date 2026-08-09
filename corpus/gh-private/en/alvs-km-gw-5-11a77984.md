---
id: alvs-km-gw-5-11a77984
title: "ALVS km-gw — SharePoint-to-web gateway with AI-safe ChatUI router — 3. Product / idea"
visibility: private
importance: high
source_repo: "alvs-km-gw"
related: []
tags: ["alvs-km-gw", "github", "private", "high", "summary"]
---

## 3. Product / idea The central mental model is **two Fargate containers behind one ALB host**: the Astro SSR service owns all browser-facing pages; the Django ASGI service owns /api/*, /accounts/*, /admin/*, and /ws/*. PostgreSQL holds users, sessions, router audit rows, and domain data. Cognito authenticates via OIDC (Google federated through the org pool); Django owns sessions and all RBAC via Groups and DRF permission classes. The frontend delivers themed, localized-rendered pages (code and docs always English per adr-01) with variable-driven CSS custom properties (docs/DESIGN-SYSTEM.md). Users authenticate through /accounts/login/ → Cognito → /accounts/callback/, then interact with profile theming (/profile), a component showcase (/showcase/components), and the ChatUI router (/chatui). HTMX sits in the interactivity ladder before Svelte islands for server-rendered fragments. Infrastructure mirrors the SROA production precedent on shared ALVS AWS: ECS clusters alvs-dev / alvs-prod, ECR repos alvs/<project>-backend and alvs/<project>-frontend, Secrets Manager paths alvs/<env>/<project>/<component>, Cloud Map for SSR-to-backend internal calls, and a Bedrock VPC interface endpoint so Fargate tasks reach inference without NAT gateways.
