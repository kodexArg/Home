---
id: alvs-fabric-config-0-59516878
title: "ALVS Fabric Config — SharePoint-to-Lakehouse CLI configuration — ALVS Fabric Config"
visibility: private
importance: normal
source_repo: "alvs-fabric-config"
related: []
tags: ["alvs-fabric-config", "github", "private", "normal", "summary"]
---
## ALVS Fabric Config

> **Problem thesis (required):** ALVS (an internal organization) must configure a Microsoft Fabric Data Lakehouse with SharePoint Online as the primary file source. Portal-based configuration does not scale, and ad-hoc scripts scatter auth and discovery logic. This repository centralizes the **CLI-first integration path** — Entra ID authentication, SharePoint file discovery via Microsoft Graph, Azure control-plane operations via Azure CLI and Azure MCP, and the architectural decision to land raw files in Fabric OneLake Bronze as the first medallion layer.
