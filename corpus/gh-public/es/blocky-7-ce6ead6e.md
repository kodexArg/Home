---
id: blocky-7-ce6ead6e
title: "blocky — fast local-network DNS proxy and ad-blocker — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "blocky"
related: ["blocky"]
tags: ["blocky", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Home LAN ad-block:** Deploy on a Raspberry Pi or NAS container, set router DHCP DNS to the blocky host, configure deny lists and default upstreams — all household devices gain blocking automatically. 2. **Per-device policy:** Define client groups (by IP, CIDR, or resolved hostname) with different block-list sets — strict blocking for kids' tablets, relaxed for work machines. 3. **Split-horizon / conditional DNS:** Route internal domain suffixes to a LAN resolver while forwarding everything else to encrypted public DNS (resolver/conditional_upstream_resolver.go, resolver/custom_dns_resolver.go). 4. **Temporary blocking off:** Operator disables blocking for 30 minutes via CLI or API during troubleshooting, then auto-re-enables. 5. **Observability stack:** Scrape Prometheus metrics, import bundled Grafana dashboards, optionally persist per-client query logs to PostgreSQL for analytics. 6. **Multi-instance cache coherence:** Run several blocky replicas behind a load balancer with Redis-backed cache synchronization (redis/, cache/).
