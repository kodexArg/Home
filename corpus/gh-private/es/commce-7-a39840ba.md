---
id: commce-7-a39840ba
title: "ComMCE — internal Django portal for MCE communications, slot stats, and environmental monitoring — 3.2 Non-goals"
visibility: private
importance: normal
source_repo: "ComMCE"
related: []
tags: ["commce", "github", "private", "normal", "summary"]
---

### 3.2 Non-goals - Not a public customer-facing product — private internal portal with ALLOWED_HOSTS limited to loopback in committed settings. - No container/CI/deploy manifests in tree — deployment method undocumented. - No requirements.txt or pyproject.toml — dependencies inferred from committed venv/ (should not be vendored in production). - Beneficios chart is scaffold-only; live aggregated JSON is not rendered. - Temperature humidity field exists in model but is not visualized. - No agent instruction trees (.claude/), hidden docs vault (.docs/), or root README present.
