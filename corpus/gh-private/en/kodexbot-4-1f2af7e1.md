---
id: kodexbot-4-1f2af7e1
title: "kodexBot — offline Hyprland voice dictation and command station — P3 — Safe command execution when speech mixes prose and intent"
visibility: private
importance: high
source_repo: "kodexBot"
related: []
tags: ["kodexbot", "github", "private", "high", "summary"]
---
### P3 — Safe command execution when speech mixes prose and intent

- **Who hurts:** Anyone dictating prose that might accidentally contain command-like phrases, or speaking mixed Spanish/English commands alongside text they want typed.
- **Pain today:** Naive voice-command systems execute whatever the LLM returns, including destructive or compositor-escaping actions. Regex-only systems miss paraphrases; LLM-only systems hallucinate executions.
- **How this repo answers:** Trigger-free model: every utterance closes on configurable silence (1.5 s default, no forced cut), enters the router. Regex matches the ≤10-word tail first; if no match, the interpreter LLM returns constrained JSON intent; the router validates against whitelist (workspace 1–10, five single keys, , bounded macros) before execution. Denied or unmatched utterances become dictation text. JSONL history logs every decision. M7 added a session stack ( on sqlite-vec) so «borra lo último» erases exact typed characters from memory, not blind BackSpace counts.
- **Out of scope:** Arbitrary shell commands, Super/Alt modifier keys in macros, or LLM-proposed actions outside the whitelist.
