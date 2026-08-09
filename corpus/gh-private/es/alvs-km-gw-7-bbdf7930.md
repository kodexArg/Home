---
id: alvs-km-gw-7-bbdf7930
title: "ALVS km-gw — SharePoint-to-web gateway with AI-safe ChatUI router — 3.2 Non-goals"
visibility: private
importance: high
source_repo: "alvs-km-gw"
related: []
tags: ["alvs-km-gw", "github", "private", "high", "summary"]
---

### 3.2 Non-goals - Redis, ElastiCache, or any cache server (adr-06-cache prohibits Redis; DatabaseCache only). - Cognito groups or custom claims as RBAC authority (adr-10-auth — Django Groups only). - npm or Node as the frontend toolchain (bun mandatory). - Staging environment tier (dev and prod only on this account). - Free-text LLM generation in stage 1 of the ChatUI router (adr-15-chatbot-two-tier). - NAT gateways (deliberate cost trade-off; public-subnet Fargate with documented accepted risk in docs/INFRASTRUCTURE.md).
