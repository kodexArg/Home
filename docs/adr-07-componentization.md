# ADR 07: Componentization Architecture (Svelte 5 Islands vs Astro Shells)

* **Status:** Accepted
* **Date:** 2026-07-24
* **Author:** kodexArg

---

## Context & Problem Statement

To maintain clean separation of concerns, optimal bundle size, and developer predictability, `kodexArg/Home` needs a strict rule governing when to use Astro components (`*.astro`) versus Svelte components (`*.svelte`).

## Decision Outcome

1. **`*.astro` Files (Strictly Reserved for Routes & Layout Shells)**:
   * `src/pages/*.astro` — Defines page routes (e.g. [index.astro](file:///home/kodex/kodexArg/Home/src/pages/index.astro)).
   * `src/layouts/*.astro` — Defines HTML `<head>`, metadata, global styles, and slot containers (e.g. [Base.astro](file:///home/kodex/kodexArg/Home/src/layouts/Base.astro)).
   * `*.astro` files MUST NOT contain interactive client state or component business logic.

2. **`*.svelte` Files (Mandatory for ALL Interactive Components)**:
   * Every UI element, stateful widget, input field, chat console, or animation island MUST be written as a Svelte 5 component (`src/components/*.svelte`).
   * Examples: [KodexBar.svelte](file:///srv/dev/kodexArg/Home/src/components/KodexBar.svelte), [SyvInput.svelte](file:///home/kodex/kodexArg/Home/src/components/SyvInput.svelte), [Wordmark.svelte](file:///home/kodex/kodexArg/Home/src/components/Wordmark.svelte), [Aurora.svelte](file:///home/kodex/kodexArg/Home/src/components/Aurora.svelte).
   * Mounted in Astro pages using `client:only="svelte"` or `client:idle`.

## Rationale & Benefits

* **State Isolation**: Svelte 5 Runes (`$state`, `$props`, `$effect`) manage client interactivity cleanly.
* **Minimal Hydration**: Keeps server HTML generation lightweight and isolates client-side runtime to designated Svelte islands.
* **Testability**: Svelte components can be unit-tested independently without full Astro server dependencies.
