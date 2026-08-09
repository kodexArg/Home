---
id: alvs-fabric-config-5-c63e1def
title: "ALVS Fabric Config — SharePoint-to-Lakehouse CLI configuration — 3. Product / idea"
visibility: private
importance: normal
source_repo: "alvs-fabric-config"
related: []
tags: ["alvs-fabric-config", "github", "private", "normal", "summary"]
---

## 3. Product / idea The central idea is a **CLI-first, two-plane integration** for ALVS data lakehouse setup: After cloning and running the quick-start sequence, an operator can verify tooling, authenticate to both Azure and M365, and probe SharePoint site/drive access — establishing the foundation for a future pipeline that downloads files from Graph into OneLake Bronze. The mental model is **medallion architecture on Fabric**: SharePoint document libraries are the raw file source; Microsoft Graph is the read API; Fabric Lakehouse / OneLake is the landing zone. Azure CLI + Azure MCP handle the control plane (workspaces, capacity, RBAC). Entra ID provides unified identity for both planes. Membrane CLI is acknowledged as an optional third-party SharePoint skill broker, but the chosen path prefers **direct Entra + Graph** for least privilege and auditability.
