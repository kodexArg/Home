---
id: lambda-update-route53-7-d10125c2
title: "lambda-update-route53 — automatic EC2-to-Route53 DNS sync — 4. Technology stack"
visibility: public
importance: normal
source_repo: "lambda-update-route53"
related: ["lambda-update-route53"]
tags: ["lambda-update-route53", "github", "public", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python (AWS Lambda managed runtime) | lambda.py | | Cloud SDK | boto3 (ec2 resource, route53 client) | lambda.py imports | | Compute | AWS Lambda | lambda.py lambda_handler signature | | Event source | Amazon EventBridge (EC2 state-change) | Even_pattern, README.md | | DNS | Amazon Route 53 hosted zone | lambda.py change_resource_record_sets | | Compute source | Amazon EC2 (instance tags, public IP) | lambda.py boto3.resource('ec2') | | Frontend | N/A | — | | Data | Route 53 DNS records only (no database) | lambda.py | | Infra / deploy | Manual Lambda upload (no IaC in repo) | tree has no template.yaml / Terraform | | AI / agents | None | no .claude/, .agents/ | | Tests | None | no test files |
