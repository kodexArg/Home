---
id: lambda-update-route53-2-85531a79
title: "lambda-update-route53 — automatic EC2-to-Route53 DNS sync — P1 — EC2 public IPs are not memorable hostnames"
visibility: public
importance: normal
source_repo: "lambda-update-route53"
related: ["lambda-update-route53"]
tags: ["lambda-update-route53", "github", "public", "normal", "summary"]
---

### P1 — EC2 public IPs are not memorable hostnames - **Who hurts:** Operators and developers who SSH or HTTP into EC2 boxes by IP, or who maintain a separate spreadsheet mapping instance names to addresses. - **Pain today:** Every new or replaced instance gets a new public IP. DNS records, if maintained at all, are updated manually and drift out of sync with reality. - **How this repo answers:** The Lambda handler (lambda.py) reacts to EventBridge notifications when an instance transitions to running. It fetches the instance's Name tag, normalizes it to kebab-case, reads public_ip_address, and calls change_resource_record_sets with action UPSERT to create or update an A record under a configured hosted zone. - **Out of scope:** Private DNS (VPC internal), load-balancer aliases, health checks, TTL tuning beyond the hardcoded 300 seconds, multi-region orchestration, or handling instances without public IPs.
