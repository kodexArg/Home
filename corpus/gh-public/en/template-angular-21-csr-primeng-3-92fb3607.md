---
id: template-angular-21-csr-primeng-3-92fb3607
title: "Angular 21 CSR starter — PrimeNG, Tailwind v4, Vitest, agent skills — P2 — PrimeNG and Tailwind v4 token alignment is fragile"
visibility: public
importance: normal
source_repo: "template-angular-21-csr-primeng"
related: ["template-angular-21-csr-primeng"]
tags: ["template-angular-21-csr-primeng", "github", "public", "normal", "summary"]
---

### P2 — PrimeNG and Tailwind v4 token alignment is fragile - **Who hurts:** Frontend developers and design-system-minded agents who want bg-primary, text-surface-600, and PrimeNG Aura tokens to interoperate without duplicate color definitions or SCSS ceremony. - **Pain today:** PrimeNG 21 uses @primeuix/themes presets; Tailwind v4 uses @theme blocks and PostCSS plugins. Without tailwindcss-primeui, teams either ignore Tailwind for component colors or fight conflicting token namespaces. - **How this repo answers:** The tailwindcss-primeui plugin is registered in src/styles.css via @plugin 'tailwindcss-primeui'. PostCSS uses @tailwindcss/postcss per .postcssrc.json. Skills (kdx-design-system-use, kdx-tailwind-design-system) enforce a hierarchy: PrimeNG components and var(--p-*) tokens first; Tailwind layout utilities second; @theme extensions only when PrimeNG cannot model the need. src/theme.css is the SSOT for site colorimetry and typography—hardcoded hex outside that file is prohibited in agent rules. - **Out of scope:** A living component showcase app, Storybook, or visual regression CI—the template is a skeleton, not a design-system catalog (though skills reference showcase-style decision flows from larger kodexArg apps).
