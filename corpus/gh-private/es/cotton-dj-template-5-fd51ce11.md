---
id: cotton-dj-template-5-fd51ce11
title: "Cotton Django Template — opinionated Django 5 starter for component-driven HTMX apps on AWS — P4 — Production-ready AWS deployment path from day one"
visibility: private
importance: normal
source_repo: "cotton-dj-template"
related: []
tags: ["cotton-dj-template", "github", "private", "normal", "summary"]
---

### P4 — Production-ready AWS deployment path from day one - **Who hurts:** Developers who prototype locally then struggle to containerize and deploy to AWS with health checks, secrets management, and observability. - **Pain today:** Templates ship without Docker, ECS task definitions, RDS/Redis wiring, or CloudWatch logging — production becomes a separate project. - **How this repo answers:** Documents a **Development → Docker → ECR → ECS Fargate** pipeline in docs/deployment.md with multi-stage Dockerfile, non-root container user, /health/ endpoint via django-health-check, AWS Secrets Manager injection, RDS PostgreSQL, ElastiCache Redis, S3 media/static, SES email via django-anymail, and CloudWatch via watchtower + Loguru structured JSON logging. - **Out of scope:** Kubernetes, Terraform/CDK IaC (listed as future enhancement), EC2-based deployment, Heroku/Vercel targets.
