# ADR 06: Design System (SyV — Subordinación y Valor / Presentation Orange)

* **Status:** Accepted
* **Date:** 2026-07-24
* **Author:** kodexArg

---

## Context & Problem Statement

The design system for `kodexArg/Home` is **Subordinación y Valor (SyV)** with **Presentation Orange** accents. This document records strictly the exact tokens, color variables, typography, and component styling contracts defined in `src/styles/global.css` and `src/styles/syv.tokens.css`.

## Exact Defined Tokens

### 1. Presentation Orange Root Tokens (`src/styles/global.css`)
* **Dark Surfaces:** `--ink-1000: #0c0b09`, `--ink-900: #141210`, `--ink-800: #1c1916`, `--ink-700: #262220`, `--ink-600: #332e29`.
* **Warm Text Colors:** `--cream-100: #f3eee4` (Primary text), `--warm-200: #b6ad9d`, `--warm-300: #8c8475`, `--warm-400: #6b6358` (Muted/Hints).
* **Candle Accent (Presentation Orange):**
  * `--orange-500: #ff6a1a` (Lead interactive accent & focus caret).
  * `--orange-400: #ff8a42` (Hover state & link border).
  * `--orange-300: #ffa86b` (Highlight text).
  * `--orange-glow: rgba(255, 106, 26, 0.22)`.
* **Pip-Boy Accent:** `--pipboy-green: #7b8a4e`, `--pipboy-glow: rgba(123, 138, 78, 0.35)`.
* **Validation:** `--syv-bad: #d9694e` (Warm earth red for invalid states).

### 2. SyV Token Standard (`src/styles/syv.tokens.css`)
* Generated from `syv.tokens.json` SSOT with `--syv-` prefixed variables.
* Incorporates Matte Military Olive-Drab (`--syv-green-500: #7b8a4e`), Celeste y Blanco, and Amber second voices (`--syv-amber-500: #e0a23c`).

### 3. Typography & Motion Tokens
* **Monospace Font:** `--font-mono: 'DM Mono', ui-monospace, "Cascadia Code", "JetBrains Mono", "Fira Code", monospace`.
* **Wordmark Brand Font:** `--syv-font-logo: 'Saira Stencil One', 'DM Mono', monospace`.
* **Easing:** `--ease-candle: cubic-bezier(0.22, 0.61, 0.36, 1)`.
* **Durations:** `--t-slow: 900ms`, `--t-med: 480ms`.

### 4. Component Design Contracts
* **[SyvInput.svelte](file:///home/kodex/kodexArg/Home/src/components/SyvInput.svelte)**: Borderless Pip-Boy text input featuring a platen baseline rule (`1.5px`), monospace cell grid on focus (`repeating-linear-gradient`), and simple placeholder **`¿Sí?`**.
* **[LlmRouterChat.svelte](file:///home/kodex/kodexArg/Home/src/components/LlmRouterChat.svelte)**: Bottom-anchored monospace terminal console stack. Prompt prefixed with candle orange `› `.
* **Links**: Rendered with non-clickable icon ahead (`span.link-icon`), and selectable hyperlinked text (`<a class="who">cv.kodexarg.com</a>`).
