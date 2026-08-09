---
id: alvs-feedlot-campo-7-5826f0e6
title: "ALVS Feedlot Campo — feedlot traceability and client accounting — 3.1 North-star use cases"
visibility: private
importance: high
source_repo: "alvs-feedlot-campo"
related: []
tags: ["alvs-feedlot-campo", "github", "private", "high", "summary"]
---

### 3.1 North-star use cases 1. **Daily pen loop:** Feed operator records feedings and bunk scores; field manager records intakes, weighings, sanitary events; system posts priced ledger debits automatically. 2. **Client portal:** Lot owner logs in, sees only their animals, metrics, account balance, and may use the read-only conversational assistant on their data. 3. **Owner dashboard:** Feedlot owner reviews cross-client metrics, market prices, advisor reports, and ledger outstanding. 4. **Agent-driven delivery:** Developer or agent follows docs/DEVELOPMENT-LOOP.md — declare endpoint in docs/API.md, write TDD in docs/tdds/, implement backend, then frontend via kdx-astro-7 / HTMX-first ladder. 5. **Production deploy:** Merge to prod triggers deploy-prod.yml — preflight GitHub vars, build/push ECR images, migrate, roll Fargate services (when images exist).
