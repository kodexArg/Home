---
id: astro-drf-aws-7-d3630139
title: "astro-drf-aws — Astro SSR + Django DRF template on AWS Fargate — 3.2 Non-goals"
visibility: public
importance: high
source_repo: "astro-drf-aws"
related: ["astro-drf-aws"]
tags: ["astro-drf-aws", "github", "public", "high", "summary"]
---

### 3.2 Non-goals - Redis / ElastiCache — prohibited; cache uses PostgreSQL DatabaseCache (docs/CACHE.md, adr-10-cache). - npm / Node as frontend toolchain — bun is mandatory runtime and package manager. - Cognito groups or custom claims for authorization. - NAT gateways in VPC — accepted cost trade-off; public-subnet Fargate tasks documented as accepted risk (docs/constitution/INFRASTRUCTURE.md). - Staging environment tier — dev and prod only. - CDN for static/media in this template — WhiteNoise for admin statics; S3 presigned URLs for media.
