---
id: alvs-fabric-config-3-343abb16
title: "ALVS Fabric Config — SharePoint-to-Lakehouse CLI configuration — P2 — Unified auth and tooling verification across Azure and M365 planes"
visibility: private
importance: normal
source_repo: "alvs-fabric-config"
related: []
tags: ["alvs-fabric-config", "github", "private", "normal", "summary"]
---
### P2 — Unified auth and tooling verification across Azure and M365 planes

- **Who hurts:** Agents and humans who need to work across Entra ID, Azure subscriptions, SharePoint/Graph, and Fabric — each with different CLI tools and auth caches.
- **Pain today:** Without a checklist, it is unclear whether , , , , , and required agent skills are installed and authenticated. Failures surface late during pipeline development.
- **How this repo answers:** probes every required binary, checks and , and verifies seven agent skills under . Login scripts ( , ) standardize device-code and browser auth flows, printing tenant/subscription IDs for population.
- **Out of scope:** Key Vault integration for secrets (planned per AGENTS.md rules). No automated CI/CD for auth rotation.
