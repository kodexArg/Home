---
id: "amesup-com-ar"
title: "AMESUP — institutional mutual landing site (Angular SPA)"
visibility: private
importance: normal
source_repo: "amesup-com-ar"
org: "kodexArg"
default_branch: "main"
primary_language: "TypeScript"
repo_kind: "application"
status: "active"
related: []
tags: ["angular", "typescript", "primeng", "tailwindcss", "spa", "landing-page", "mutual", "mendoza", "aws-amplify", "vitest", "conversion", "financial-services"]
problems_solved:
  - "Replaces an outdated mutual website with a modern, mobile-first institutional presence aligned to 2026 brand and product messaging."
  - "Captures loan and membership leads from Mendoza public-sector employees through a conversion-focused landing page with digital-first CTAs."
  - "Centralizes AMESUP service, benefit, FAQ, and contact information in a single-page experience deployable as static assets on AWS Amplify."
technologies:
  - "Angular 21 (standalone components)"
  - "PrimeNG 21 + PrimeIcons"
  - "Tailwind CSS 4 + tailwindcss-primeui"
  - "Vitest (via @angular/build:unit-test)"
  - "AWS Amplify Hosting"
  - "Google Tag Manager"
  - "GitHub Actions CI"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# AMESUP institutional website

> **Problem thesis (required):** AMESUP (Asociación Mutual de Empleados de Sindicatos Unidos y Privados) needed a new public-facing web presence to replace legacy sites and brochures-only outreach. This repository delivers a production Angular single-page application: a conversion-oriented landing page for Mendoza public-sector employees seeking personal loans (up to five million ARS), subsidies, convenios, and membership benefits — deployed as static files on AWS Amplify with analytics via Google Tag Manager.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/amesup-com-ar` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Mobile-first institutional landing SPA for a Mendoza mutual, optimized for loan lead capture and WhatsApp handoff. |
| Audience | Mendoza public-sector employees and retirees (target borrowers), AMESUP marketing/commercial staff, and internal developers maintaining the site. |

## 2. Problems it solves

### P1 — Outdated digital presence blocks conversion

- **Who hurts:** AMESUP commercial team and prospective associates who discover the mutual through social campaigns, brochures, or word of mouth but land on an obsolete or inconsistent web experience.
- **Pain today:** Legacy domains and old contact channels (documented in `AMESUP.md`) diverge from current brand, product limits, and official contact data. Campaign materials promise a fully digital loan process, but the old site cannot reflect that promise or drive structured leads.
- **How this repo answers:** Delivers a modern Angular 21 SPA with a full landing funnel — hero with animated brand logo, services, benefits, stats, testimonials, FAQ, CTA blocks, and a structured contact form. Content is data-driven from `src/app/frontpage/data/landing.data.ts`, making copy updates centralized. Hero and CTA components route users to the contact form or external WhatsApp deep link. Visual identity uses a navy-blue + orange PrimeNG preset defined in `src/app/app.config.ts`.
- **Out of scope:** Backend loan origination, credit scoring, member portal, payment processing, CRM integration, or admin CMS. The contact form currently opens the user's mail client (`mailto:`) rather than posting to an API.

### P2 — Mobile-first lead capture for a geographically targeted audience

- **Who hurts:** Public employees in Mendoza province municipalities (Las Heras, Maipú, Guaymallén, Paraná, Cámara de Senadores, Departamento de Irrigación, etc.) who interact primarily via phone and messaging apps.
- **Pain today:** Brochure PDFs and social posts generate interest but lack a persistent, searchable, form-based capture path with employer-type segmentation and loan amount fields.
- **How this repo answers:** The contact form (`src/app/frontpage/components/contact-form.ts`) collects nombre, apellido, celular, DNI, monto solicitado, motivo (loan/subsidy/convenio/etc.), lugar de trabajo (employer dropdown), and optional message — then composes a pre-filled email to the institutional contact address defined in `landing.data.ts`. WhatsApp buttons in hero and footer provide an alternate instant channel. Design is responsive (Tailwind utility classes, `min-h-[max(100svh,750px)]` hero) with scroll-anchored navigation.
- **Out of scope:** Loan simulator (mentioned as a future goal in `AMESUP.md` but not implemented), digital signature workflow, or associate self-service portal.

### P3 — Repeatable deployable frontend asset pipeline

- **Who hurts:** Developers and operators who must ship UI changes safely without manual server administration.
- **Pain today:** Marketing updates require coordinated rebuilds; without CI/CD, regressions in build or tests could reach production unnoticed.
- **How this repo answers:** `amplify.yml` defines an AWS Amplify build (`npm ci`, `ng build --configuration production`, artifact `dist/amesup/browser`). GitHub Actions (`ci.yml`) runs on push/PR to `main`: Node 22, `npm ci`, `npm test`, `npm run build:prod`. Static SPA output with long-cache headers for JS/CSS. Version tracked in `src/app/version.ts` (currently `1.1.0` per changelog).
- **Out of scope:** Infrastructure-as-code for AWS beyond Amplify's native config; multi-environment wrangler/workers patterns (this is pure static hosting).

## 3. Product / idea

The repository is a **single-route marketing SPA** — not a multi-app monorepo. After `ng serve` or production build, the user sees one long-scrolling landing page composed of vertically stacked sections wired in `src/app/frontpage/landing.ts`:

1. **Scroll logo** — fixed AMESUP logo that animates from hero size to navbar size on scroll (`scroll-logo.ts`).
2. **Navbar** — anchor links to in-page sections (Inicio, Nosotros, Servicios, Beneficios, Preguntas, Contacto).
3. **Hero** — headline promoting 100% digital credit with 24-hour turnaround; dual CTAs (scroll to contact form, open WhatsApp).
4. **About** — institutional narrative, INAES registration note, mini-stats.
5. **Stats** — animated counters (20+ years, 5000+ members, 4 services, 100% transparency).
6. **Services** — cards for Préstamos (highlighted), Subsidios, Convenios, Beneficios.
7. **Benefits** — value props (no hidden fees, 24h approval, personalized attention).
8. **Testimonials** — four fictionalized member quotes with star ratings.
9. **FAQ** — six accordion items covering membership, loan timing, subsidies, health convenios, commerce discounts, credentials.
10. **CTA** — secondary conversion block.
11. **Contact form** — lead capture with employer and motive selectors.
12. **Footer** — brand, service links, institutional links, contact block, social icons, legal bottom bar.

Routing (`src/app/app.routes.ts`) is minimal: `/` → landing, `/notfound` → 404 page, `**` → redirect to notfound. No lazy-loaded feature modules; all frontpage components are eagerly imported into `LandingComponent`.

Business context and copy direction live in `AMESUP.md` (Spanish business brief extracted from 2026 brochures) and `CLAUDE.md` (developer/agent orientation). `CHANGELOG.md` records v1.0.0 initial launch and v1.1.0 GTM integration.

### 3.1 North-star use cases

1. **Prospective borrower** lands from a social ad → reads services/FAQ → fills contact form or taps WhatsApp → commercial team receives structured inquiry.
2. **Marketing operator** updates copy, stats, or FAQ entries in `landing.data.ts` → CI passes → Amplify redeploys static bundle.
3. **Developer** runs `npm start` locally, iterates on standalone components under `src/app/frontpage/`, verifies with Vitest smoke test in `app.spec.ts`.

### 3.2 Non-goals

- No authenticated member area or loan status tracking (explicitly listed as future in `AMESUP.md` §6.2).
- No server-side API, database, or serverless functions in this repo.
- No loan calculator/simulator UI (planned in business doc, not built).
- No i18n — all user-facing strings are Spanish.
- E2E test framework not configured (README notes `ng e2e` requires external framework choice).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Node 22 (CI), TypeScript 5.9 | `.github/workflows/ci.yml`, `package.json` |
| Frontend framework | Angular 21 standalone SPA | `package.json`, `angular.json`, `src/main.ts` |
| UI kit | PrimeNG 21, PrimeIcons, Aura preset (custom AMESUP colors) | `package.json`, `src/app/app.config.ts` |
| Styling | Tailwind CSS 4 + tailwindcss-primeui, PostCSS | `package.json`, `postcss.config.json`, `src/styles.css` |
| Backend / API | None — static SPA | No `src/server`, no API routes |
| Data | In-memory TypeScript constants only | `src/app/frontpage/data/landing.data.ts` |
| Infra / deploy | AWS Amplify Hosting (static) | `amplify.yml` |
| Analytics | Google Tag Manager container embedded in `index.html` | `src/index.html`, `CHANGELOG.md` |
| CI | GitHub Actions: test + prod build | `.github/workflows/ci.yml` |
| Tests | Vitest via Angular unit-test builder | `package.json`, `src/app/app.spec.ts` |
| Tooling | Prettier, Angular CLI 21, VS Code MCP config for Angular CLI | `.prettierrc`, `.vscode/mcp.json` |

### 4.1 Notable dependencies (curated)

- `@angular/*` ^21.2 — core framework; standalone components, signals in contact form, `provideHttpClient(withFetch())` registered but no HTTP calls observed.
- `primeng` ^21.1 — Button, InputText, Textarea, Select, ScrollTop, Divider modules across landing sections.
- `@primeuix/themes` — Aura preset extended with navy surface palette and orange primary for brand alignment.
- `tailwindcss` ^4.2 — utility-first layout; `@theme inline` maps PrimeNG CSS variables to Tailwind color tokens.
- `vitest` ^4.0 — unit test runner behind `ng test`.
- `rxjs` ~7.8 — Angular peer dependency.

**Package manager note:** `package.json` scripts and CI use `npm`/`package-lock.json`. `angular.json` CLI metadata lists `packageManager: "bun"` — a configuration inconsistency; actual lockfile and CI are npm-based.

## 5. Repository map (abstraction)

- **Entrypoints:** `src/main.ts` bootstraps `App` with `appConfig`; `src/index.html` shell with GTM snippets.
- **App shell:** `src/app/app.ts` — router outlet only; `src/app/app.routes.ts` — route table; `src/app/app.config.ts` — router, HTTP, PrimeNG theme providers.
- **Domain / core (content):** `src/app/frontpage/data/landing.data.ts` — all marketing copy, contact info, services, benefits, stats, testimonials, FAQ; `src/app/frontpage/models/landing.models.ts` — TypeScript interfaces.
- **Presentation (landing):** `src/app/frontpage/landing.ts` orchestrates section components; `src/app/frontpage/components/` — hero, about, stats, services, benefits, testimonials, faq, cta, contact-form, footer, navbar, scroll-logo; `src/app/frontpage/shared/` — reusable atoms (section-header, stat-item, faq-item, nav-link, etc.).
- **Pages:** `src/app/pages/notfound/` — 404 fallback.
- **Static assets:** `public/` — favicons, logo (`public/assets/logo-blanco.png`), background images (`public/images/bg/`, `public/images/hero/`), brochure reference images and HTML (`public/assets/brochures/`).
- **Docs vaults:** `AMESUP.md` (business brief), `CLAUDE.md` (agent/dev guide), `README.md` (Angular CLI boilerplate), `CHANGELOG.md`. **No `docs/`, `.docs/`, or `.claude/` directories present** — scan completed, nothing to ingest.
- **Agent scaffolding:** `CLAUDE.md` at repo root; `.vscode/mcp.json` configures Angular CLI MCP server for IDE assistance. No skill trees or harness constitutions.
- **CI/CD:** `.github/workflows/ci.yml`, `amplify.yml`.
- **Generated / vendor:** `dist/` (gitignored build output), `node_modules/` (gitignored).

## 6. Configuration & contracts (no secrets)

- **Environment files:** `.env` and `.env.*` are gitignored; no `environment.ts` Angular environments found — all config is compile-time constants in source.
- **Contact constants:** `CONTACT_INFO` in `landing.data.ts` holds address, phone, WhatsApp link, email, business hours. Social links include Facebook and WhatsApp URLs.
- **Amplify build:** preBuild runs `rm -rf node_modules` then `npm ci --include=dev`; build runs `npx ng build --configuration production`; artifacts from `dist/amesup/browser`; cache `node_modules/**/*`; custom Cache-Control headers on JS/CSS (1 year immutable).
- **Angular production budgets:** initial bundle warning 500 kB / error 1 MB; per-component styles warning 4 kB / error 8 kB (`angular.json`).
- **GTM container ID:** embedded in `src/index.html` (public analytics identifier, not a secret).
- **No Cloudflare wrangler, Docker, or compose files.**

### 6.1 HTTP / API endpoints (when applicable)

This repository exposes **no server-side HTTP API**. It is a client-only SPA served as static files. All "endpoints" are client-side routes:

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Landing page (all sections) | none |
| `GET` | `/notfound` | 404 page | none |
| `GET` | `/**` (unmatched) | Redirect to `/notfound` | none |

**External integrations (browser-side, not repo-hosted APIs):**

| Mechanism | Target | Purpose |
|-----------|--------|---------|
| `mailto:` link | Contact email from `CONTACT_INFO` | Contact form submission composes pre-filled email |
| `window.open` | WhatsApp deep link from `CONTACT_INFO.whatsappLink` | Instant messaging CTA |
| GTM script load | Google Tag Manager | Analytics/tag management |
| Social `href` | Facebook page URL in `SOCIAL_LINKS` | Social presence link |

`provideHttpClient(withFetch())` is configured in `app.config.ts` but no `HttpClient` usage was found in application code — likely scaffolded for future API integration.

### 6.2 Other interfaces

- **CLI:** `npm start` (dev server port 4200), `npm run build:prod`, `npm test`, `npx prettier --write .`
- **Angular CLI MCP:** `.vscode/mcp.json` exposes `@angular/cli mcp` for AI-assisted development in VS Code/Cursor.
- **Anchor navigation:** In-page `#inicio`, `#nosotros`, `#servicios`, `#beneficios`, `#faq`, `#contacto` sections with smooth scroll enabled via router config.

## 7. Data & persistence

- **No database, KV, or object storage bindings.** All content is static TypeScript exports compiled into the JS bundle.
- **Entities (content model only):** `NavLink`, `ContactInfo`, `SocialLink`, `Service`, `Benefit`, `Stat`, `Testimonial`, `FaqItem` — defined in `landing.models.ts`, populated in `landing.data.ts`.
- **Contact form state:** Ephemeral in-component `signal` and plain object; no persistence beyond `mailto:` handoff. Success state is UI-only until page refresh.
- **Topology:** Pure edge/static — browser downloads hashed assets from Amplify CDN; no server runtime, no edge functions, no D1/Postgres.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. **`README.md`** — standard Angular CLI 21 boilerplate: dev server, build, test commands.
2. **`CLAUDE.md`** — project identity (AMESUP Angular SPA), npm commands, architecture map (entry, routing, app config, static assets, Amplify deploy), Prettier/strict TypeScript conventions. Notes CI runs lint → test → build:prod, but actual `ci.yml` has no lint step (discrepancy).
3. **`AMESUP.md`** — authoritative Spanish business brief: institutional identity, updated 2026 contact data, primary product (personal loan up to five million ARS, 100% digital), target audience (Mendoza public employees), service catalog (crédito, subsidios, convenios, descuentos), visual identity guidelines, and platform requirements (conversion forms, WhatsApp integration, mobile-first, loan simulator and self-service portal as future goals).
4. **`CHANGELOG.md`** — v1.0.0 initial launch (full landing sections, navy+orange brand, Amplify deploy); v1.1.0 GTM integration.
5. **`amplify.yml`** — deployment pipeline contract.
6. **`.github/workflows/ci.yml`** — CI steps.
7. **`src/app/frontpage/data/landing.data.ts`** — live site copy and contact constants (may differ slightly from `AMESUP.md` on address/email — e.g. `Espejo 156` vs `Av. Las Heras 348`, `contacto@` vs `comercial@` documented in business brief).
8. **`.claude/`** — **not present** (directory scan: absent).
9. **`.docs/`** — **not present** (directory scan: absent).
10. **`docs/`** — **not present**.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private GitHub repo under `kodexArg`; summary stored in kdx-rag private repos vault. No clone URLs in body per RAG hygiene rules.
- **Auth model:** None — fully public static marketing site once deployed. No login, sessions, or RBAC.
- **PII handling:** Contact form collects personal data (name, phone, DNI, loan amount) client-side and opens user's email client — data leaves the browser via the user's MUA, not a controlled backend. Operators should ensure mailto workflow meets privacy/compliance expectations.
- **Secrets:** `.env*` gitignored; no credentials, API keys, or PEM files in tracked tree. GTM container ID is a public analytics identifier. This summary contains no secrets, connection strings, or `.env` contents.
- **Third-party scripts:** GTM loads from Google; social and WhatsApp links open external properties.

## 10. Operational picture

- **Local dev:** `npm install` → `npm start` → browser on port 4200. Hot reload on file changes.
- **Production build:** `npm run build:prod` → output `dist/amesup/browser/` (serve with any static file server for local preview).
- **Deploy:** AWS Amplify Hosting reads `amplify.yml` on connected branch (typically `main`); `npm ci` + production Angular build; serves SPA with fallback to `index.html` (standard Amplify SPA behavior).
- **CI:** GitHub Actions on push/PR to `main` — Node 22, `npm ci`, `npm test` (Vitest smoke: app creates, router-outlet renders), `npm run build:prod`.
- **Formatting:** Prettier with 100-char width, single quotes, Angular HTML parser (`.prettierrc`).
- **Hardware constraints:** None — standard static web app; no GPU/RPi requirements.

## 11. Open questions / unknowns

- **Content drift:** `landing.data.ts` contact address/email differs from `AMESUP.md` official data — unclear which is authoritative for production.
- **CI lint step:** `CLAUDE.md` claims lint runs in CI, but `ci.yml` has no lint command — documentation stale or lint planned but not added.
- **Package manager:** `angular.json` says `bun`; repo uses `npm` + `package-lock.json` everywhere else.
- **HTTP client:** `provideHttpClient` registered but unused — future backend integration anticipated?
- **Contact form backend:** No API endpoint for form POST; mailto-only may be interim. Unknown if Amplify form handling or serverless email is planned.
- **Loan simulator & member portal:** Described in `AMESUP.md` as platform goals; not implemented in current tree.
- **E2E tests:** Not configured.
- **Production domain/DNS:** Not defined in repo manifests (deployment target implied by project name and business docs, not encoded in IaC here).
- **`.claude/` / `.docs/`:** Confirmed absent; no hidden agent instruction trees beyond root `CLAUDE.md`.
