# ADR 09: ChatUI Router Architecture & Security Sensitivity

* **Status:** Accepted (Critical Security Control)
* **Date:** 2026-07-24
* **Author:** kodexArg

---

## Context & Problem Statement

The bottom chat input box ([LlmRouterChat.svelte](file:///home/kodex/kodexArg/Home/src/components/LlmRouterChat.svelte)) is the primary interactive surface of `kodexArg/Home`. Because it is exposed directly to public website visitors and potential automated bots, it is a high-sensitivity target for prompt injection, open redirects, query reflection attacks, and denial-of-wallet probes.

This component requires its own dedicated ADR to mandate strict security watching and closed architectural contracts for any future modifications.

## Security Directives & Closed Action Architecture

### 1. Two-Tier Closed-Action Contract (No Free Assistant Prose)
* The router acts strictly as an **intent dispatcher**, NOT an unguided conversational chatbot.
* The routing engine MUST return closed, typed `RouteResult` objects (`outcome: 'Action'` with `kind: 'navigate'`, vs `outcome: 'NO_MATCH'`).
* Freeform generated prose from untrusted model outputs is explicitly forbidden in this component to prevent prompt injection and hallucinated redirection URLs.

### 2. Allowlist-Only Target Validation
* Redirection targets MUST be mapped directly to validated entries from `KODEX_DESTINATIONS` ([destinations.ts](file:///home/kodex/kodexArg/Home/src/lib/router/destinations.ts)).
* The UI MUST NEVER reflect user-supplied strings directly into `window.location` or `href` attributes.

### 3. Link Element Separation Security
* UI links are rendered as:
  ```svelte
  <span class="link-container">
    <span class="link-icon" aria-hidden="true">...</span>
    <a class="who" href={destination.url} target="_blank" rel="noopener noreferrer">
      {destination.url}
    </a>
  </span>
  ```
* The icon is placed outside the `<a>` tag with `pointer-events: none` to prevent click-jacking or accidental touch triggers.
* Link text is wrapped inside `<a>` with `user-select: text` for explicit user selection and control.

### 4. Mandatory Review for Changes
Any PR or commit modifying `LlmRouterChat.svelte` or `src/lib/router/` MUST be explicitly audited for:
- [ ] No regression introducing free-prose LLM output.
- [ ] No unvalidated `href` or dynamic script evaluation.
- [ ] Preservation of `SyvInput` (`¿Sí?`) design tokens and keyboard accessibility.
