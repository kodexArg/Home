---
id: alvs-fabric-config-8-f7756cf8
title: "ALVS Fabric Config — SharePoint-to-Lakehouse CLI configuration — 4. Technology stack"
visibility: private
importance: normal
source_repo: "alvs-fabric-config"
related: []
tags: ["alvs-fabric-config", "github", "private", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3 (stdlib only in scripts), Bash | scripts/*.py, scripts/*.sh, .gitignore (.python-version ignored) | | CLI tooling | Azure CLI (az), Microsoft 365 CLI (m365), Azure MCP (azmcp), Membrane CLI, GitHub CLI (gh), uv | scripts/check_tooling.py tool list | | Cloud platform | Microsoft Azure, Microsoft Fabric, SharePoint Online, Entra ID | README.md, docs/CHOSEN-PATH.md | | API surface | Microsoft Graph REST (via m365 graph get) | scripts/probe_sharepoint.py | | Agent / MCP | Azure MCP (@azure/mcp), Grok project MCP config | .grok/config.toml | | Agent skills (external) | azure-deploy, azure-storage, azure-prepare, azure-diagnostics, fabric-lakehouse, e2e-medallion-architecture, microsoft-sharepoint | AGENTS.md, scripts/check_tooling.py | | Package manager | uv (per AGENTS.md; no pyproject.toml in repo yet) | AGENTS.md rules section | | Tests | None in repo | tree scan | | CI/CD | None evident | tree scan |
