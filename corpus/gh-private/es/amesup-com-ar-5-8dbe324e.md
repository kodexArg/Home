---
id: amesup-com-ar-5-8dbe324e
title: "AMESUP — institutional mutual landing site (Angular SPA) — 3. Product / idea"
visibility: private
importance: normal
source_repo: "amesup-com-ar"
related: []
tags: ["amesup-com-ar", "github", "private", "normal", "summary"]
---

## 3. Product / idea The repository is a **single-route marketing SPA** — not a multi-app monorepo. After ng serve or production build, the user sees one long-scrolling landing page composed of vertically stacked sections wired in src/app/frontpage/landing.ts: 1. **Scroll logo** — fixed AMESUP logo that animates from hero size to navbar size on scroll (scroll-logo.ts). 2. **Navbar** — anchor links to in-page sections (Inicio, Nosotros, Servicios, Beneficios, Preguntas, Contacto). 3. **Hero** — headline promoting 100% digital credit with 24-hour turnaround; dual CTAs (scroll to contact form, open WhatsApp). 4. **About** — institutional narrative, INAES registration note, mini-stats. 5. **Stats** — animated counters (20+ years, 5000+ members, 4 services, 100% transparency). 6. **Services** — cards for Préstamos (highlighted), Subsidios, Convenios, Beneficios. 7. **Benefits** — value props (no hidden fees, 24h approval, personalized attention). 8. **Testimonials** — four fictionalized member quotes with star ratings. 9. **FAQ** — six accordion items covering membership, loan timing, subsidies, health convenios, commerce discounts, credentials. 10. **CTA** — secondary conversion block. 11. **Contact form** — lead capture with employer and motive selectors. 12. **Footer** — brand, service links, institutional links, contact block, social icons, legal bottom bar. Routing
