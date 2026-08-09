---
id: kdx-ng-coveris-docs-6-feed7bf8
title: "Coveris Documentation Portal — Angular docs site and QA harness — 3. Product / idea (2)"
visibility: private
importance: normal
source_repo: "kdx-ng-coveris-docs"
related: []
tags: ["kdx-ng-coveris-docs", "github", "private", "normal", "summary"]
---

linking people to positions with preview and balance math). Coverage and balance formulas drive all UI and API semantics. Mental model for the **documented application stack** (not built in this repo): Production topology (from prod-aws.md): Amplify hosts the CSR build with /api/* rewrite to App Runner (Uvicorn ASGI), RDS PostgreSQL, Cognito RS256 auth, S3 for media, Secrets Manager for credentials — deliberately avoiding Kubernetes/Lambda for operational simplicity.
