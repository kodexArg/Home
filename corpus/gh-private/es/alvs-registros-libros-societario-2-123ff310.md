---
id: alvs-registros-libros-societario-2-123ff310
title: "ALVS Registro de Libros Societarios — corporate registry web application for Grupo ALVS — P1 — Legacy REGISTROS cannot serve modern corporate-book workflows"
visibility: private
importance: high
source_repo: "ALVS-REGISTROS-LIBROS-SOCIETARIOS-KODEXARG"
related: []
tags: ["alvs-registros-libros-societarios-kodexarg", "github", "private", "high", "summary"]
---

### P1 — Legacy REGISTROS cannot serve modern corporate-book workflows - **Who hurts:** Corporate-law operators at Grupo ALVS who maintain libros societarios, shareholder registries, and entity governance records for client companies and associations. - **Pain today:** The legacy REGISTROS desktop application held statutory books, numbered folios, cap-table shareholdings, officer rosters, and assembly preparation checklists in a monolithic Spanish codebase without web access, modern authentication, immutable audit semantics, or per-entity authorization. Opening a book, writing a folio, and sealing it with a cryptographic close hash — core Argentine corporate-registry practice — had no path to a secure multi-user web tier. - **How this repo answers:** The corporate Django app ports the domain into English identifiers with Spanish i18n labels: Entity (registered company/association), Book (rubricated statutory book), Folio (numbered leaf opened then immutably closed with SHA-256 close_hash), Shareholder/Shareholding (firm-wide registry and per-entity cap table), Officer with an approval queue (OfficerUpdateRequest), and AssemblyChecklist/ChecklistStep (LGS meeting preparation). REST endpoints under /api/corporate/ expose list/create/detail/patch/close flows; the Astro frontend implements directory pages, detail views, and editor-gated forms driven by 130+ TDD specs in
