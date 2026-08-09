---
id: harness-default-3-242a0612
title: "harness-default — Fullstack project template with constitution, ADRs, assertions, and agent delivery — P2 — Product promises without a proving path"
visibility: public
importance: high
source_repo: "harness-default"
related: ["gh-harness-default"]
tags: ["harness-default", "github", "public", "high", "summary"]
---

### P2 — Product promises without a proving path - **Who hurts:** Owners who need enforceable quality or behavior laws (latency ceilings, data-display consistency, navigation depth limits); teams that write Gherkin scenarios but never connect them to permanent tests; agents that ship features against silent wishes. - **Pain today:** Requirements enumerate what should hold but lack a single law with a mandatory test link. Backlog items masquerade as guarantees. TDD is cultural, not structural. No skill demands failing tests before implementation when a promise matters. - **How this repo answers:** **Assertions** are the novel mechanism: a Gherkin use case collapsed into one checkable paragraph under , with a mandatory section whose chapter must link runnable tests that *demonstrate* the law. The skill interprets each law, resolves links, demands tests per (tests first, code second, tests remain forever), and stamps only when green. Zero assertions is healthy; presence binds. Assertion-00 discipline and ADR-01 rule 6 forbid inventing laws without the owner. - **Out of scope:** CI enforcement of assertions (left to the adopting project); replacing unit/integration test frameworks; managing assertion count or compute budget for the owner.
