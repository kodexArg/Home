# ADR 10: LLM Connection Strategy & Multi-Tier Routing Infrastructure

* **Status:** Accepted
* **Date:** 2026-07-24
* **Author:** kodexArg

---

## Context & Problem Statement

To achieve intelligent intent routing across client browsers, mobile devices, and serverless edge runtimes without creating single points of failure, expensive cloud dependencies, or high latency, `kodexArg/Home` defines a multi-tier LLM connection strategy.

## Multi-Tier Connection Architecture

```
User Query
    │
    ▼
AdaptiveRouter (src/lib/router/adaptiveRouter.ts)
    │
    ├─► Tier 1: WindowAiStrategy (Chrome window.ai / Gemini Nano Native)
    │     └─► Browser On-Device Inference (0ms latency, 0MB download)
    │
    ├─► Tier 2: WebLlmStrategy (WebGPU / WebLLM In-Browser SLM)
    │     └─► In-Tab WebGPU Execution (Cross-browser, offline after cache)
    │
    ├─► Tier 3: CloudflareVectorizeStrategy (Cloudflare Workers AI + Vectorize)
    │     └─► Edge Embedding (@cf/baai/bge-small-en-v1.5) via native env.AI & env.VECTOR_INDEX
    │
    └─► Tier 4: RuleBasedStrategy (Deterministic Fallback Engine)
          └─► Instant Local Pattern Matcher (0ms latency, 100% reliable)
```

## Tier Implementation Details

### 1. Tier 1 — Native On-Device (`WindowAiStrategy`)
* **Technology:** Chrome Built-in AI (`window.ai.languageModel` / Gemini Nano).
* **Connection Protocol:** Direct IPC via Chromium native browser API.
* **Format:** Prompts output JSON formatted intent actions (`{"outcome": "Action", "destinationId": "cv"}`).

### 2. Tier 2 — Client-Side WebGPU (`WebLlmStrategy`)
* **Technology:** In-browser execution via `@mlc-ai/web-llm` / WebGPU shaders.
* **Connection Protocol:** Direct GPU shader execution in the browser tab.

### 3. Tier 3 — Edge Vector Embedding (`CloudflareVectorizeStrategy`)
* **Technology:** Cloudflare Workers AI + Cloudflare Vectorize database.
* **Connection Protocol:** Internal Cloudflare zero-trust IPC binding via `env.AI` and `env.VECTOR_INDEX` via POST `/api/vector-route`.
* **Embedding Model:** `@cf/baai/bge-small-en-v1.5` (384 dimensions).

### 4. Tier 4 — Local Fallback (`RuleBasedStrategy`)
* **Technology:** Pure JavaScript normalized keyword and pattern matcher.
* **Connection Protocol:** In-memory synchronous execution.

## Reliability & Fallback Guarantee

The `AdaptiveRouter` iterates through registered strategies in order of capability. If a strategy is unsupported in the current browser or fails during execution, the router automatically falls through to the next tier, guaranteeing that queries always resolve gracefully without uncaught exceptions or UI freezes.
