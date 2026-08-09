---
id: lambda-update-route53-6-a9c34a58
title: "lambda-update-route53 — automatic EC2-to-Route53 DNS sync — 3.2 Non-goals"
visibility: public
importance: normal
source_repo: "lambda-update-route53"
related: ["lambda-update-route53"]
tags: ["lambda-update-route53", "github", "public", "normal", "summary"]
---

### 3.2 Non-goals - No infrastructure-as-code for Lambda, IAM, or EventBridge (operators deploy manually). - No handling of stopped / terminated states (records are never deleted). - No support for instances without the Name tag (empty string would produce a malformed record). - No dependency manifest (requirements.txt); relies on boto3 bundled in the Lambda Python runtime. - No tests, CI, or packaging beyond the single lambda.py file.
