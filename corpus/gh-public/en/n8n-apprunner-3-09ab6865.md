---
id: n8n-apprunner-3-09ab6865
title: "n8n-apprunner — n8n workflow automation on AWS App Runner — P2 — Keep secrets out of the repository while satisfying n8n's env contract"
visibility: public
importance: normal
source_repo: "n8n-apprunner"
related: ["n8n-apprunner"]
tags: ["n8n-apprunner", "github", "public", "normal", "summary"]
---
### P2 — Keep secrets out of the repository while satisfying n8n's env contract

- **Who hurts:** Operators who must satisfy n8n's requirement for , database credentials, and Basic Auth password without committing them to git.
- **Pain today:** Example configs often inline passwords or leave placeholder env files that drift into commits; RDS master credentials and n8n encryption keys are high-impact leak targets.
- **How this repo answers:** maps four Secrets Manager ARNs to env vars: , , , . README documents three named secrets ( , , optional RDS-managed JSON) and a minimal IAM instance role granting on those resources. Plain-text non-secret tuning (timezone, log format, SSL flags) stays in .
- **Out of scope:** Rotating secrets automatically; cross-account secret access; HashiCorp Vault or Parameter Store alternatives.
