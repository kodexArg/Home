---
id: pihome-4-7f6d187b
title: "PiHome — Django multimedia hub for Raspberry Pi — P3 — Quick filesystem-only upload for testing"
visibility: private
importance: normal
source_repo: "PiHome"
related: []
tags: ["pihome", "github", "private", "normal", "summary"]
---
### P3 — Quick filesystem-only upload for testing

- **Who hurts:** Developer validating Pi storage or upload plumbing before wiring the ORM form flow.
- **Pain today:** Every test upload requires filling a model form and hitting MySQL.
- **How this repo answers:** accepts a POST with , saves via , prints the resulting URL to stdout, and renders a template—explicitly commented as temporary and database-free.
- **Out of scope:** Durable metadata for Subida uploads; they are not registered in .
