---
id: openclaw-4-c08498c4
title: "OpenClaw — personal multi-channel AI assistant — P3 — Messaging surfaces are untrusted; insecure defaults leak context"
visibility: public
importance: high
source_repo: "openclaw"
related: ["openclaw"]
tags: ["openclaw", "github", "public", "high", "summary"]
---

### P3 — Messaging surfaces are untrusted; insecure defaults leak context - **Who hurts:** Anyone who connects a bot to real phone numbers or public Discord/Telegram bots; multi-user DM inboxes where session sharing would leak private context between senders. - **Pain today:** Open DMs invite prompt injection and spam. Default shared sessions mean Alice's medical question context can surface when Bob asks "what were we talking about?" - **How this repo answers:** Default **DM pairing** ( ) sends unknown senders a code; operator approves via . surfaces risky configs. supports isolation for multi-user setups. Exec tool runs can require approval ( RPC). Plugins are in-process trusted code with explicit pinning recommended. - **Out of scope:** Defeating prompt injection in model weights; securing intentionally public-internet-exposed gateways without operator-chosen auth (documented as out-of-scope in ).
