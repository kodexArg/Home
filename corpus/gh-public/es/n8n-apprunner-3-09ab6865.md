---
id: n8n-apprunner-3-09ab6865
title: "n8n-apprunner — n8n workflow automation on AWS App Runner — P2 — Keep secrets out of the repository while satisfying n8n's env contract"
visibility: public
importance: normal
source_repo: "n8n-apprunner"
related: ["n8n-apprunner"]
tags: ["n8n-apprunner", "github", "public", "normal", "summary"]
---

### P2 — Keep secrets out of the repository while satisfying n8n's env contract - **Who hurts:** Operators who must satisfy n8n's requirement for N8N_ENCRYPTION_KEY, database credentials, and Basic Auth password without committing them to git. - **Pain today:** Example configs often inline passwords or leave placeholder env files that drift into commits; RDS master credentials and n8n encryption keys are high-impact leak targets. - **How this repo answers:** apprunner.yaml run.secrets maps four Secrets Manager ARNs to env vars: N8N_ENCRYPTION_KEY, N8N_BASIC_AUTH_PASSWORD, DB_POSTGRESDB_USER, DB_POSTGRESDB_PASSWORD. README documents three named secrets (kdx-n8n-encryption-key, kdx-generic-password, optional RDS-managed rds!db-… JSON) and a minimal IAM instance role granting secretsmanager:GetSecretValue on those resources. Plain-text non-secret tuning (timezone, log format, SSL flags) stays in run.env. - **Out of scope:** Rotating secrets automatically; cross-account secret access; HashiCorp Vault or Parameter Store alternatives.
