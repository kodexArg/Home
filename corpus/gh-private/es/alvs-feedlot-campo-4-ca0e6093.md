---
id: alvs-feedlot-campo-4-ca0e6093
title: "ALVS Feedlot Campo — feedlot traceability and client accounting — P3 — Cost-to-outcome visibility"
visibility: private
importance: high
source_repo: "alvs-feedlot-campo"
related: []
tags: ["alvs-feedlot-campo", "github", "private", "high", "summary"]
---

### P3 — Cost-to-outcome visibility - **Who hurts:** Owners and advisors evaluating pen performance, conversion, and sale readiness. - **Pain today:** Inputs are recorded, but asking "what did this cost buy in gain and conversion?" requires rebuilding metrics by hand across weighings, feedings, and exits. - **How this repo answers:** Read-only metrics app derives summary, daily cost, growth, conversion, mortality, and account evolution per client with explicit null contracts when data is insufficient (docs/adrs/adr-29-metrics-derivation.md). Market price connectors (market app) supply reference hacienda prices for context, not ledger currency. - **Out of scope:** Predictive ML beyond the designed Bedrock-based advisors and page-context assistant; commodity trading.
