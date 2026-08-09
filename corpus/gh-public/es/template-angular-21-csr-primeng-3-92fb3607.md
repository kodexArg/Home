---
id: template-angular-21-csr-primeng-3-92fb3607
title: "Angular 21 CSR starter — PrimeNG, Tailwind v4, Vitest, agent skills — P2 — PrimeNG and Tailwind v4 token alignment is fragile"
visibility: public
importance: normal
source_repo: "template-angular-21-csr-primeng"
related: ["template-angular-21-csr-primeng"]
tags: ["template-angular-21-csr-primeng", "github", "public", "normal", "summary"]
---

### P2 — PrimeNG and Tailwind v4 token alignment is fragile - **Who hurts:** Frontend developers and design-system-minded agents who want , , and PrimeNG Aura tokens to interoperate without duplicate color definitions or SCSS ceremony. - **Pain today:** PrimeNG 21 uses presets; Tailwind v4 uses blocks and PostCSS plugins. Without , teams either ignore Tailwind for component colors or fight conflicting token namespaces. - **How this repo answers:** The plugin is registered in via . PostCSS uses per . Skills ( , ) enforce a hierarchy: PrimeNG components and tokens first; Tailwind layout utilities second; extensions only when PrimeNG cannot model the need. is the SSOT for site colorimetry and typography—hardcoded hex outside that file is prohibited in agent rules. - **Out of scope:** A living component showcase app, Storybook, or visual regression CI—the template is a skeleton, not a design-system catalog (though skills reference showcase-style decision flows from larger kodexArg apps).
