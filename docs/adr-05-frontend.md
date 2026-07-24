# ADR 05: Complete Frontend Stack (Development & Production)

* **Status:** Accepted
* **Date:** 2026-07-24
* **Author:** kodexArg

---

## Context & Problem Statement

The frontend for `kodexArg/Home` must deliver an ultra-fast, minimal, Pip-Boy typewriter console surface with zero UI bloat, instant component interactivity, and high performance on mobile and desktop devices.

## Full Frontend Stack Specifications

| Layer | Technology Selected | Version / Details | Rationale |
| :--- | :--- | :--- | :--- |
| **Framework Shell** | **Astro** | 7.x (`^7.1.3`) | Static site generation (SSG) + SSR layout rendering with zero JS default footprint. |
| **UI Component Engine** | **Svelte** | 5.x (Runes mode) | Ultra-lightweight reactive islands ([LlmRouterChat.svelte](file:///home/kodex/kodexArg/Home/src/components/LlmRouterChat.svelte), [SyvInput.svelte](file:///home/kodex/kodexArg/Home/src/components/SyvInput.svelte)). |
| **Runtime & Tooling** | **Bun** | 1.3+ | Package manager, test runner, script executor (`bun run dev`, `bun run build`). |
| **Bundler & Compiler** | **Vite** | 6.x | Fast HMR (Hot Module Replacement) and optimized production asset bundling. |
| **Adapter** | `@astrojs/cloudflare` | Latest | Deploys Astro server entrypoints to Cloudflare Pages / Workers. |

## Development & Production Workflows

### 1. Development Workflow
* **Command:** `bun run dev`
* Runs Astro 7 dev server with Svelte 5 HMR.
* Serves pages at `http://localhost:4321`.

### 2. Production Build Workflow
* **Command:** `bun run build`
* Generates static assets in `dist/` and Cloudflare Pages entrypoints.
* Deployed automatically via GitHub Actions CI/CD to Cloudflare at `https://home.kodexarg.com`.
