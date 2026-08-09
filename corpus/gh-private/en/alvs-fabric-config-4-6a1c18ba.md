---
id: alvs-fabric-config-4-6a1c18ba
title: "ALVS Fabric Config — SharePoint-to-Lakehouse CLI configuration — P3 — Agent-ready project context for Fabric/SharePoint work"
visibility: private
importance: normal
source_repo: "alvs-fabric-config"
related: []
tags: ["alvs-fabric-config", "github", "private", "normal", "summary"]
---

### P3 — Agent-ready project context for Fabric/SharePoint work - **Who hurts:** AI coding agents dispatched to configure ALVS infrastructure without domain context. - **Pain today:** Agents lack a concise mission statement, integration path, skill list, and MCP configuration to operate effectively on Azure/Fabric/SharePoint tasks. - **How this repo answers:** AGENTS.md provides agent context (goal, chosen path, skills, rules). .grok/config.toml wires Azure MCP into the Grok session. README lists installed skills (fabric-lakehouse, e2e-medallion-architecture, microsoft-sharepoint, Azure deploy/storage/prepare/diagnostics). - **Out of scope:** No .claude/ or .docs/ vault present in the tree (scanned; not found). Agent skills themselves live outside the repo under ~/.agents/skills/.
