---
id: alvs-fabric-config-6-d0a8886c
title: "ALVS Fabric Config — SharePoint-to-Lakehouse CLI configuration — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "alvs-fabric-config"
related: []
tags: ["alvs-fabric-config", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Operator bootstrap:** Clone repo → python3 scripts/check_tooling.py → ./scripts/login_azure.sh --device → ./scripts/login_m365.sh → copy .env.example to .env → python3 scripts/probe_sharepoint.py to confirm site/drive access. 2. **Agent-assisted Fabric setup:** Agent reads AGENTS.md and docs/CHOSEN-PATH.md, uses Azure MCP (via .grok/config.toml) and installed skills to scaffold Fabric workspace + lakehouse once auth is confirmed. 3. **SharePoint inventory:** After m365 login, probe_sharepoint.py lists root site, searches sites, and enumerates document library drives — producing the inventory needed to plan Bronze ingest.
