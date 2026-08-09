---
id: "lambda-update-route53"
title: "lambda-update-route53 — automatic EC2-to-Route53 DNS sync"
visibility: public
importance: normal
source_repo: "lambda-update-route53"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "infrastructure"
status: "active"
related: []
tags: ["aws", "lambda", "route53", "ec2", "dns", "eventbridge", "boto3", "infrastructure", "serverless"]
problems_solved:
  - "EC2 instances with public IPs lack stable, human-readable DNS names tied to instance display names."
  - "Manual Route53 record creation and updates lag behind EC2 lifecycle events, leaving operators with stale or missing A records."
  - "Teams running small fleets of named EC2 machines need zero-touch DNS registration when instances reach the running state."
technologies:
  - "Python 3 (AWS Lambda runtime)"
  - "AWS Lambda"
  - "Amazon EventBridge"
  - "Amazon EC2"
  - "Amazon Route 53"
  - "boto3"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# lambda-update-route53

> **Problem thesis (required):** Operators who run multiple EC2 instances with public IPs and a registered DNS zone need each machine reachable by a predictable hostname derived from its instance name tag. This repository provides a minimal AWS Lambda handler that listens for EC2 state-change events (specifically instances entering the `running` state), reads the instance's `Name` tag and public IP, and upserts an A record in Route 53 — eliminating manual DNS bookkeeping every time a machine boots or is replaced.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/lambda-update-route53` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Event-driven Lambda that auto-registers EC2 instance names as Route 53 A records when instances start. |
| Audience | AWS operators, DevOps engineers, and homelab builders who manage EC2 fleets with public IPs and want DNS-by-name without a separate service-discovery layer. |

## 2. Problems it solves

### P1 — EC2 public IPs are not memorable hostnames

- **Who hurts:** Operators and developers who SSH or HTTP into EC2 boxes by IP, or who maintain a separate spreadsheet mapping instance names to addresses.
- **Pain today:** Every new or replaced instance gets a new public IP. DNS records, if maintained at all, are updated manually and drift out of sync with reality.
- **How this repo answers:** The Lambda handler (`lambda.py`) reacts to EventBridge notifications when an instance transitions to `running`. It fetches the instance's `Name` tag, normalizes it to kebab-case, reads `public_ip_address`, and calls `change_resource_record_sets` with action `UPSERT` to create or update an A record under a configured hosted zone.
- **Out of scope:** Private DNS (VPC internal), load-balancer aliases, health checks, TTL tuning beyond the hardcoded 300 seconds, multi-region orchestration, or handling instances without public IPs.

### P2 — No automation hook between EC2 lifecycle and DNS

- **Who hurts:** Small teams without Consul, external-dns, or a full IaC pipeline who still want name-based access to a handful of machines.
- **Pain today:** Setting up EventBridge rules, IAM roles, and Route 53 API calls from scratch is tedious; the README documents the exact EventBridge event pattern needed.
- **How this repo answers:** Ships a ready-to-deploy handler plus an `Even_pattern` file (EventBridge JSON pattern) that filters `aws.ec2` / `EC2 Instance State-change Notification` events where `detail.state` is `running`. Operators wire this pattern to the Lambda and configure hosted zone ID and domain suffix in the handler.
- **Out of scope:** Terraform/CloudFormation packaging, IAM policy templates, deletion of records on instance termination, or support for CNAME/AAAA/SRV record types.

## 3. Product / idea

The central idea is **reactive DNS registration**: DNS becomes a side effect of EC2 boot, not a separate provisioning step. The mental model is a single-event pipeline:

```
EC2 instance → running state
    → EventBridge rule (pattern in Even_pattern)
        → Lambda (lambda.py)
            → boto3 EC2: read Name tag + public IP
            → boto3 Route 53: UPSERT A record
```

After deployment, any EC2 instance with a `Name` tag and a public IP that reaches `running` automatically gains a DNS name of the form `{normalized-name}.{configured-domain}`.

### 3.1 North-star use cases

1. **Homelab / small fleet** — Spin up a few named EC2 instances; each becomes reachable at `machine-name.your-zone` without touching the Route 53 console.
2. **Ephemeral dev boxes** — Replace an instance; the next boot re-upserts the same logical hostname with the new IP.
3. **EventBridge wiring reference** — Copy the event pattern from `Even_pattern` or `README.md` into an EventBridge rule targeting this Lambda.

### 3.2 Non-goals

- No infrastructure-as-code for Lambda, IAM, or EventBridge (operators deploy manually).
- No handling of `stopped` / `terminated` states (records are never deleted).
- No support for instances without the `Name` tag (empty string would produce a malformed record).
- No dependency manifest (`requirements.txt`); relies on boto3 bundled in the Lambda Python runtime.
- No tests, CI, or packaging beyond the single `lambda.py` file.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python (AWS Lambda managed runtime) | `lambda.py` |
| Cloud SDK | boto3 (`ec2` resource, `route53` client) | `lambda.py` imports |
| Compute | AWS Lambda | `lambda.py` `lambda_handler` signature |
| Event source | Amazon EventBridge (EC2 state-change) | `Even_pattern`, `README.md` |
| DNS | Amazon Route 53 hosted zone | `lambda.py` `change_resource_record_sets` |
| Compute source | Amazon EC2 (instance tags, public IP) | `lambda.py` `boto3.resource('ec2')` |
| Frontend | N/A | — |
| Data | Route 53 DNS records only (no database) | `lambda.py` |
| Infra / deploy | Manual Lambda upload (no IaC in repo) | tree has no `template.yaml` / Terraform |
| AI / agents | None | no `.claude/`, `.agents/` |
| Tests | None | no test files |

### 4.1 Notable dependencies (curated)

- `boto3` — AWS SDK used for EC2 instance lookup and Route 53 record mutation; expected to be available in the Lambda execution environment (not pinned in a manifest).

## 5. Repository map (abstraction)

- **Entrypoints:** `lambda.py` — sole Lambda handler (`lambda_handler(event, context)`).
- **Domain / core:** Inline in `lambda.py` — tag extraction, name normalization (`replace(' ', '-').lower()`), and Route 53 UPSERT logic.
- **Adapters:** boto3 clients for EC2 and Route 53; EventBridge event payload (`event['detail']['instance-id']`).
- **Configuration samples:** `Even_pattern` — JSON event pattern for EventBridge rule creation.
- **Docs vaults:** `README.md` only; no `docs/`, `.docs/`, or ADR directories present.
- **Agent scaffolding:** None — `.claude/` and `.agents/` not present in the tree.
- **Generated / vendor:** None.

## 6. Configuration & contracts (no secrets)

Operators must configure two values directly in `lambda.py` before deployment:

| Setting | Location | Purpose |
|---------|----------|---------|
| `hosted_zone_id` | `lambda.py` line ~18 | Route 53 hosted zone identifier (placeholder `Z0000...` in source) |
| Domain suffix | `lambda.py` line ~19 | Base domain appended to normalized instance name (placeholder `example.org` in source) |

The Lambda execution role must grant at minimum:

- `ec2:DescribeInstances` (or broader EC2 read) for the target instance.
- `route53:ChangeResourceRecordSets` on the target hosted zone.

EventBridge delivers events matching the pattern in `Even_pattern`:

- `source`: `aws.ec2`
- `detail-type`: `EC2 Instance State-change Notification`
- `detail.state`: `running`

Record shape: A record, TTL 300 seconds, value = instance `public_ip_address`.

### 6.1 HTTP / API endpoints (when applicable)

This repository exposes **no HTTP surface**. The Lambda is invoked exclusively by EventBridge (or manual test events in the Lambda console). There is no API Gateway, ALB, or web framework.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| N/A | N/A | No HTTP endpoints | N/A |

### 6.2 Other interfaces

- **Lambda handler contract:** `lambda_handler(event, context)` — expects EventBridge EC2 state-change payload with `event['detail']['instance-id']`.
- **EventBridge rule:** Must use the JSON pattern from `Even_pattern` (or equivalent documented in `README.md`).
- **CLI / library:** None — not importable as a Python package; copy `lambda.py` into a Lambda deployment package.

## 7. Data & persistence

- **Persistence:** Amazon Route 53 DNS records (A type) in a single hosted zone.
- **Entities:** One A record per EC2 instance name (normalized); record name = `{kebab-name}.{domain}`.
- **Ephemeral reads:** EC2 instance metadata (tags, public IP) at invocation time; nothing cached between invocations.
- **Topology:** Fully serverless — EventBridge in the same AWS account/region as EC2 and Route 53; no edge, no local database, no object storage.

## 8. Docs & agent memory (required scan)

Scanned paths and findings:

1. **`README.md`** — Describes the problem, example name transformations (spaces to hyphens, lowercase), and the EventBridge event pattern. Primary operator documentation.
2. **`Even_pattern`** — Standalone JSON file duplicating the EventBridge filter from the README; intended for copy-paste into the AWS console or IaC.
3. **`lambda.py`** — Inline comments for hosted zone ID and domain configuration; implementation is the authoritative behavior spec.
4. **`LICENSE`** — MIT License, copyright 2023 Gabriel Alejandro Cavedal.
5. **`.claude/`** — Not present; no agent instruction trees to summarize.
6. **`.docs/`** — Not present; no hidden docs vault.
7. **`docs/`**, **ADRs**, **constitution** — Not present.

Evidence bullets:

- `README.md` — event pattern, use-case narrative, example hostname transforms.
- `Even_pattern` — EventBridge JSON filter.
- `lambda.py` — handler logic, boto3 calls, configurable zone/domain placeholders.
- `LICENSE` — MIT, 2023.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repository; code contains placeholder hosted zone ID and example domain — operators must replace with their own values; no live credentials found in tree.
- **Auth model:** AWS IAM — Lambda execution role permissions for EC2 read and Route 53 write; EventBridge invokes Lambda via resource-based policy on the function.
- **IAM least-privilege:** Not documented in repo; operators should scope Route 53 changes to the specific hosted zone ARN.
- **Public IP assumption:** Only instances with `public_ip_address` set will produce valid A records; private-only instances may upsert empty or invalid values.
- **This summary contains no secrets**, private keys, connection strings, or `.env` contents.

## 10. Operational picture

- **Local dev:** No local runner or `requirements.txt`; test by deploying to Lambda and sending a synthetic EventBridge event, or use the AWS Lambda console test harness with a sample EC2 state-change payload.
- **Deploy:** Manual — zip `lambda.py` (or paste inline in console), configure environment is unnecessary (hardcoded constants), attach IAM role, create EventBridge rule with pattern from `Even_pattern`, set Lambda as target.
- **CI/CD:** None evident — no `.github/workflows/`, `buildspec.yml`, or similar.
- **Monitoring:** Single `print()` statement logs the updated record name to CloudWatch Logs.
- **Hardware constraints:** None — standard AWS Lambda limits apply.

## 11. Open questions / unknowns

- **Hosted zone and domain configuration** — Hardcoded in source; no environment-variable or SSM Parameter Store indirection shown.
- **Instances without `Name` tag** — Handler yields empty `instance_name`; behavior for blank record names is undefined.
- **Instances without public IP** — `public_ip_address` may be `None`; UPSERT with null value not guarded.
- **Record cleanup on termination** — No handler for `stopped` or `terminated` events; stale A records persist.
- **Multi-hosted-zone / multi-domain** — Single zone and domain only.
- **Python runtime version** — Not specified (no `runtime` manifest); operator chooses at deploy time.
- **Typo in filename** — `Even_pattern` likely intended as `Event_pattern`; purpose is clear from contents.
- **Last activity / maintenance** — MIT license dated 2023; no recent commits or changelog visible from shallow clone.
