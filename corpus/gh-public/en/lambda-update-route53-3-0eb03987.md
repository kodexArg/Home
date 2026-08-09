---
id: lambda-update-route53-3-0eb03987
title: "lambda-update-route53 — automatic EC2-to-Route53 DNS sync — P2 — No automation hook between EC2 lifecycle and DNS"
visibility: public
importance: normal
source_repo: "lambda-update-route53"
related: ["lambda-update-route53"]
tags: ["lambda-update-route53", "github", "public", "normal", "summary"]
---

### P2 — No automation hook between EC2 lifecycle and DNS - **Who hurts:** Small teams without Consul, external-dns, or a full IaC pipeline who still want name-based access to a handful of machines. - **Pain today:** Setting up EventBridge rules, IAM roles, and Route 53 API calls from scratch is tedious; the README documents the exact EventBridge event pattern needed. - **How this repo answers:** Ships a ready-to-deploy handler plus an file (EventBridge JSON pattern) that filters / events where is . Operators wire this pattern to the Lambda and configure hosted zone ID and domain suffix in the handler. - **Out of scope:** Terraform/CloudFormation packaging, IAM policy templates, deletion of records on instance termination, or support for CNAME/AAAA/SRV record types.
