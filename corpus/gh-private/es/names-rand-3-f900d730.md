---
id: names-rand-3-f900d730
title: "Names.rand — fantasy and real-name desktop generator — P2 — Real-language personal names for characters and fixtures"
visibility: private
importance: normal
source_repo: "names.rand"
related: []
tags: ["names.rand", "github", "private", "normal", "summary"]
---
### P2 — Real-language personal names for characters and fixtures

- **Who hurts:** Writers and developers who need plausible first+last names in Spanish, English, Portuguese, German, French, Italian, Russian, Muslim, or Chinese contexts.
- **Pain today:** Picking names from baby-name sites is one-at-a-time. Test data generators often use Anglo-only defaults. Russian feminine surname inflection is easy to get wrong.
- **How this repo answers:** in pairs random entries from first-name lists with surname lists. A special case adjusts Russian female surnames ending in , , or by appending . The UI exposes male/female selection for all real-language generators.
- **Out of scope:** Does not generate addresses, phone numbers, or full identities. Name lists are static files, not live census data. README mentions future expansion but Android and PWA targets are not implemented in the current tree.
