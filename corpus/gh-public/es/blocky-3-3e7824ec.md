---
id: blocky-3-3e7824ec
title: "blocky — fast local-network DNS proxy and ad-blocker — P2 — DNS performance, privacy, and protocol flexibility"
visibility: public
importance: normal
source_repo: "blocky"
related: ["blocky"]
tags: ["blocky", "github", "public", "normal", "summary"]
---
### P2 — DNS performance, privacy, and protocol flexibility

- **Who hurts:** Users frustrated by slow or censored ISP DNS, operators wanting encrypted DNS internally, and anyone who distrusts a single upstream provider seeing all queries.
- **Pain today:** Default DNS is often uncached, unencrypted, and single-homed. Picking one public resolver concentrates query visibility. Legacy devices may need plain UDP/TCP while phones and browsers increasingly expect DoH or DoT.
- **How this repo answers:** A chained resolver pipeline applies caching with prefetch, fans queries across multiple upstreams using strategies like (race two random resolvers), supports upstream groups per client, and speaks DNS over UDP/TCP, DoT, DoH, and DoQ (RFC 9250). Optional DNSSEC validation, ECS handling, DNS64 synthesis, and EDE extended error codes add modern DNS semantics. Random upstream selection spreads traffic across providers.
- **Out of scope:** Recursive DNS root operation, authoritative DNS hosting for public zones, or a full anycast anycast edge network — blocky forwards to configured upstreams.
