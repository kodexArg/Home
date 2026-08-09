---
id: lambda-update-route53-0-ffdaa6c2
title: "lambda-update-route53 — automatic EC2-to-Route53 DNS sync — lambda-update-route53"
visibility: public
importance: normal
source_repo: "lambda-update-route53"
related: ["lambda-update-route53"]
tags: ["lambda-update-route53", "github", "public", "normal", "summary"]
---

# lambda-update-route53 > **Problem thesis (required):** Operators who run multiple EC2 instances with public IPs and a registered DNS zone need each machine reachable by a predictable hostname derived from its instance name tag. This repository provides a minimal AWS Lambda handler that listens for EC2 state-change events (specifically instances entering the state), reads the instance's tag and public IP, and upserts an A record in Route 53 — eliminating manual DNS bookkeeping every time a machine boots or is replaced.
