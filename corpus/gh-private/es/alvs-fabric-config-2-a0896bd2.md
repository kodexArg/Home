---
id: alvs-fabric-config-2-a0896bd2
title: "ALVS Fabric Config — SharePoint-to-Lakehouse CLI configuration — P1 — SharePoint-to-Fabric lakehouse bootstrap without portal click-ops"
visibility: private
importance: normal
source_repo: "alvs-fabric-config"
related: []
tags: ["alvs-fabric-config", "github", "private", "normal", "summary"]
---
### P1 — SharePoint-to-Fabric lakehouse bootstrap without portal click-ops

- **Who hurts:** ALVS data platform engineers and operators tasked with standing up a Fabric lakehouse fed by SharePoint document libraries.
- **Pain today:** Microsoft Fabric and SharePoint configuration is typically done through web portals — slow, non-reproducible, and hard to audit. There is no single repo that documents the chosen integration path, provides auth scripts, and verifies tooling before pipeline work begins.
- **How this repo answers:** Documents the **medallion architecture decision** (SharePoint → Graph → Bronze in OneLake), ships shell scripts for and , a Python probe that lists SharePoint sites and drives via Graph, and a tooling checker that validates all required CLIs and agent skills are installed.
- **Out of scope:** Does not yet implement the actual Graph-download-to-OneLake pipeline, Fabric workspace provisioning, or unattended app-registration ingest. Those are documented as next steps in .
