---
id: alvs-feedlot-campo-1-efacbccd
title: "ALVS Feedlot Campo — feedlot traceability and client accounting — 1. Identity"
visibility: private
importance: high
source_repo: "alvs-feedlot-campo"
related: []
tags: ["alvs-feedlot-campo", "github", "private", "high", "summary"]
---

## 1. Identity | Field | Value | |-------|-------| | Org / repo | kodexArg/alvs-feedlot-campo | | Visibility | private | | Default branch | main (integration); prod is production deploy target | | One-line pitch | End-to-end feedlot operations platform: trace every input to animal and owner, bill through an immutable ledger, derive metrics, and expose role-scoped portals including AI advisors — built on the astro-drf-aws template stack. | | Audience | ALVS field staff (feed operators, field managers, workshop), feedlot owners/administrators, boarding clients (lot_owners), and AI coding agents working through the vendored harness. | The project was spawned from the kodexArg/astro-drf-aws template. Ownership moved to kodexArg on 2026-08-02 (fork of the prior jereezquerro92 repo, which remains upstream). Deploy identity, OIDC trust, and GitHub Actions variables are per-repository configuration (docs/GH.md, docs/adrs/adr-48-derived-project-deploy-identity.md). Runtime project slug is feedlot-campo; the public production hostname is configured separately as PROJECT_HOST (not derived from slug — see docs/VARIABLES.md).
