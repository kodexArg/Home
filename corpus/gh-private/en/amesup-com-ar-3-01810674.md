---
id: amesup-com-ar-3-01810674
title: "AMESUP — institutional mutual landing site (Angular SPA) — P2 — Mobile-first lead capture for a geographically targeted audience"
visibility: private
importance: normal
source_repo: "amesup-com-ar"
related: []
tags: ["amesup-com-ar", "github", "private", "normal", "summary"]
---

### P2 — Mobile-first lead capture for a geographically targeted audience - **Who hurts:** Public employees in Mendoza province municipalities (Las Heras, Maipú, Guaymallén, Paraná, Cámara de Senadores, Departamento de Irrigación, etc.) who interact primarily via phone and messaging apps. - **Pain today:** Brochure PDFs and social posts generate interest but lack a persistent, searchable, form-based capture path with employer-type segmentation and loan amount fields. - **How this repo answers:** The contact form (src/app/frontpage/components/contact-form.ts) collects nombre, apellido, celular, DNI, monto solicitado, motivo (loan/subsidy/convenio/etc.), lugar de trabajo (employer dropdown), and optional message — then composes a pre-filled email to the institutional contact address defined in landing.data.ts. WhatsApp buttons in hero and footer provide an alternate instant channel. Design is responsive (Tailwind utility classes, min-h-[max(100svh,750px)] hero) with scroll-anchored navigation. - **Out of scope:** Loan simulator (mentioned as a future goal in AMESUP.md but not implemented), digital signature workflow, or associate self-service portal.
