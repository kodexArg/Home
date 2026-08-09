---
id: alvs-feedlot-campo-1-efacbccd
title: "ALVS Feedlot Campo — feedlot traceability and client accounting — 1. Identity"
visibility: private
importance: high
source_repo: "alvs-feedlot-campo"
related: []
tags: ["alvs-feedlot-campo", "github", "private", "high", "summary"]
---
## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | (integration); is production deploy target |
| One-line pitch | End-to-end feedlot operations platform: trace every input to animal and owner, bill through an immutable ledger, derive metrics, and expose role-scoped portals including AI advisors — built on the template stack. |
| Audience | ALVS field staff (feed operators, field managers, workshop), feedlot owners/administrators, boarding clients ( ), and AI coding agents working through the vendored harness. |
The project was spawned from the template. Ownership moved to on 2026-08-02 (fork of the prior repo, which remains ). Deploy identity, OIDC trust, and GitHub Actions variables are per-repository configuration ( , ). Runtime project slug is ; the public production hostname is configured separately as (not derived from slug — see ).
