---
id: "blocky"
title: "blocky — fast local-network DNS proxy and ad-blocker"
visibility: public
importance: normal
source_repo: "blocky"
org: "kodexArg"
default_branch: "main"
primary_language: "Go"
repo_kind: "application"
status: "active"
related: []
tags: ["go", "dns", "ad-blocker", "doh", "dot", "doq", "dnssec", "prometheus", "docker", "homelab", "networking", "self-hosted", "yaml-config", "cobra-cli", "openapi"]
problems_solved:
  - "Home and small-office networks need network-wide ad, tracker, and malware blocking without installing extensions on every device."
  - "Consumer routers and ISP DNS offer little control over upstream resolvers, caching, per-device policy, or privacy-oriented DNS transport."
  - "Operators want a lightweight, stateless DNS appliance with observability, temporary blocking bypass, and simple YAML configuration."
technologies:
  - "Go 1.25"
  - "miekg/dns"
  - "chi HTTP router"
  - "Cobra CLI"
  - "OpenAPI / oapi-codegen"
  - "Prometheus client"
  - "GORM (MySQL, MariaDB, PostgreSQL, SQLite query logs)"
  - "Redis (optional distributed cache sync)"
  - "Docker multi-stage scratch image"
  - "MkDocs Material documentation"
  - "Ginkgo / Gomega tests"
  - "Testcontainers"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# blocky

> **Problem thesis (required):** kodexArg/blocky is a maintained fork of the upstream blocky project — a **fast, lightweight DNS proxy and ad-blocker for local networks**. It exists so operators can point household or lab devices at one self-hosted resolver that blocks unwanted domains, accelerates repeat lookups through caching, routes queries across multiple upstream providers for privacy, and exposes per-client-group policy — all from a single YAML configuration, without browser extensions or a heavy Pi-hole-style stack. The binary is stateless by design, ships as a scratch Docker image or standalone executable, and runs comfortably on Raspberry Pi-class hardware.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/blocky` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Fast and lightweight DNS proxy as ad-blocker for local network with many features. |
| Audience | Homelab operators, network administrators, privacy-conscious households, Docker and Kubernetes deployers, and developers who need a programmable DNS edge with Prometheus metrics and a REST control plane. |

The kodexArg copy tracks the upstream `0xERR0R/blocky` repository. The clone's git remotes show `origin` at `kodexArg/blocky` and `upstream` at the canonical upstream project. A scheduled fork-sync workflow can keep the kodexArg `main` branch aligned with upstream when a `FORK_SYNC_TOKEN` secret is configured.

## 2. Problems it solves

### P1 — Network-wide ad and malware blocking without per-device software

- **Who hurts:** Households, small offices, and IoT-heavy networks where installing ad-blockers on phones, TVs, consoles, and smart-home gear is impractical or impossible.
- **Pain today:** Browser extensions only protect one app. ISP or router DNS passes through ads, trackers, and known-malware domains. Consumer routers rarely offer flexible blocklist management, regex rules, or deep CNAME inspection.
- **How this repo answers:** Blocky sits on the LAN as the DNS server (typically via DHCP). It loads external deny and allow lists (hosts-format, plain domain lists, regex), supports per-client-group block policies (e.g. kids vs. smart-home), periodically refreshes lists, and can block at query domain, response CNAME chain, or resolved IP against IP lists. Blocking can be toggled at runtime via REST API or CLI for temporary bypass.
- **Out of scope:** Full firewall replacement, VPN service, DHCP server, or DHCP lease management — blocky is DNS-only; network devices must be pointed at it separately.

### P2 — DNS performance, privacy, and protocol flexibility

- **Who hurts:** Users frustrated by slow or censored ISP DNS, operators wanting encrypted DNS internally, and anyone who distrusts a single upstream provider seeing all queries.
- **Pain today:** Default DNS is often uncached, unencrypted, and single-homed. Picking one public resolver concentrates query visibility. Legacy devices may need plain UDP/TCP while phones and browsers increasingly expect DoH or DoT.
- **How this repo answers:** A chained resolver pipeline applies caching with prefetch, fans queries across multiple upstreams using strategies like `parallel_best` (race two random resolvers), supports upstream groups per client, and speaks DNS over UDP/TCP, DoT, DoH, and DoQ (RFC 9250). Optional DNSSEC validation, ECS handling, DNS64 synthesis, and EDE extended error codes add modern DNS semantics. Random upstream selection spreads traffic across providers.
- **Out of scope:** Recursive DNS root operation, authoritative DNS hosting for public zones, or a full anycast anycast edge network — blocky forwards to configured upstreams.

### P3 — Operable self-hosted DNS with observability and control

- **Who hurts:** Homelab operators who want metrics, query logs, runtime toggles, and validation without running a database-heavy appliance.
- **Pain today:** Pi-hole and similar tools can be heavier or less flexible for advanced DNS routing. Lightweight alternatives often lack Prometheus integration, OpenAPI control surfaces, or structured query logging to SQL.
- **How this repo answers:** Prometheus metrics export, bundled Grafana dashboard JSON definitions, CSV or database query logging (MySQL/MariaDB/PostgreSQL/SQLite), REST API generated from OpenAPI, companion CLI, pprof debug endpoint, and `SIGUSR1` runtime configuration dump. Core operation is stateless — no mandatory database; optional Redis enables distributed cache invalidation across replicas.
- **Out of scope:** Blocky does not collect telemetry or phone home; it is not a managed SaaS DNS product.

## 3. Product / idea

Blocky is a **single-process DNS appliance** written in Go. After deployment with a YAML config file, it listens for DNS queries on configured ports, walks an ordered **chain of resolvers** (each implementing a narrow concern), and returns answers to clients. Parallel HTTP/HTTPS listeners expose management, metrics, DoH, and static documentation assets.

The mental model:

1. **Ingress:** Clients send DNS queries via UDP/TCP (port 53), DoT (853), or DoH (HTTP path, default `/dns-query`). Optional client identification via EDNS0 or DoH path segment enables per-group policy.
2. **Pipeline:** Each query traverses resolvers for filtering, FQDN normalization, client-name lookup, query logging, metrics, custom DNS overrides, hosts-file entries, blocking, DNSSEC validation, caching, DNS64, ECS, conditional upstream routing, and finally upstream resolution.
3. **Egress:** Answers return to the client; blocked queries receive configured block types (zero IP, NXDOMAIN, custom IP, etc.).
4. **Control plane:** Operators use REST (`/api/...`), CLI subcommands, or Prometheus/Grafana to inspect status, flush cache, refresh lists, or temporarily disable blocking.

Configuration is one or more YAML files merged by the config loader (`config/config.go` via koanf). Upstreams are grouped; blocking lists are grouped; client groups map to block-list combinations. The server hot-reloads config when signaled (platform-specific config trigger in `server/server_config_trigger.go`).

### 3.1 North-star use cases

1. **Home LAN ad-block:** Deploy on a Raspberry Pi or NAS container, set router DHCP DNS to the blocky host, configure deny lists and default upstreams — all household devices gain blocking automatically.
2. **Per-device policy:** Define client groups (by IP, CIDR, or resolved hostname) with different block-list sets — strict blocking for kids' tablets, relaxed for work machines.
3. **Split-horizon / conditional DNS:** Route internal domain suffixes to a LAN resolver while forwarding everything else to encrypted public DNS (`resolver/conditional_upstream_resolver.go`, `resolver/custom_dns_resolver.go`).
4. **Temporary blocking off:** Operator disables blocking for 30 minutes via CLI or API during troubleshooting, then auto-re-enables.
5. **Observability stack:** Scrape Prometheus metrics, import bundled Grafana dashboards, optionally persist per-client query logs to PostgreSQL for analytics.
6. **Multi-instance cache coherence:** Run several blocky replicas behind a load balancer with Redis-backed cache synchronization (`redis/`, `cache/`).

### 3.2 Non-goals

- Not a DHCP server, router firmware, or full network operating system.
- No built-in telemetry or usage analytics sent to third parties (explicitly stated in README and docs).
- No hidden filtering — all block lists are operator-configured and visible in YAML.
- Does not replace enterprise DDI suites (Infoblox, BlueCat) for large multi-site DNS governance.
- kodexArg fork does not appear to add product features beyond upstream tracking; it is an organizational mirror with optional fork-sync automation.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Go 1.25.0 | `go.mod` |
| DNS core | `miekg/dns`, `quic-go` for DoQ | `go.mod`, `resolver/quic_upstream_client.go` |
| HTTP / API | chi v5, CORS, OpenAPI codegen | `go.mod`, `server/server_endpoints.go`, `api/` |
| CLI | Cobra + pflag | `go.mod`, `cmd/root.go` |
| Config | YAML via koanf, creasty/defaults | `go.mod`, `config/config.go` |
| Logging | logrus with prefixed formatter | `log/logger.go` |
| Metrics | Prometheus client_golang | `metrics/metrics.go` |
| Query log persistence | GORM drivers: MySQL, PostgreSQL, SQLite; CSV file writer | `go.mod`, `querylog/` |
| Cache | In-memory expiration cache; optional Redis pub/sub sync | `cache/`, `redis/redis.go` |
| List ingestion | HTTP downloader, hosts/plain/regex parsers | `lists/` |
| Data structures | Custom trie for domain matching | `trie/` |
| Infra / deploy | Multi-stage Docker (golang:alpine → scratch), GoReleaser, GitHub Actions | `Dockerfile`, `.goreleaser.yml`, `.github/workflows/` |
| Docs site | MkDocs Material, mike versioning | `mkdocs.yml`, `docs/` |
| Tests | Ginkgo/Gomega unit tests, Testcontainers e2e | `go.mod`, `e2e/`, `Makefile` |
| Codegen | go-enum, mockery, oapi-codegen, goimports, gofumpt | `go.mod` `tool` block, `Makefile` |

### 4.1 Notable dependencies (curated)

- **`github.com/miekg/dns`** — Core DNS message encoding, server, and client primitives for all resolver transports.
- **`github.com/go-chi/chi/v5`** — HTTP router for REST API, DoH, metrics, pprof, and static assets.
- **`github.com/spf13/cobra`** — CLI framework; default command starts the DNS server.
- **`github.com/prometheus/client_golang`** — Exports `blocky_*` metrics for operational dashboards.
- **`github.com/quic-go/quic-go`** — DNS-over-QUIC upstream and transport support.
- **`gorm.io/gorm` (+ drivers)** — Optional structured query logging to SQL databases.
- **`github.com/go-redis/redis/v8`** — Optional Redis connection for distributed cache and event bridge.
- **`github.com/knadh/koanf/v2`** — Configuration loading from YAML files and environment.
- **`github.com/oapi-codegen/oapi-codegen/v2`** — Generates typed REST server and client from `docs/api/openapi.yaml`.
- **`github.com/testcontainers/testcontainers-go`** — Integration and e2e tests against real MariaDB, PostgreSQL, Redis containers.

## 5. Repository map (abstraction)

- **Entrypoints:** `main.go` delegates to `cmd.Execute()`; `cmd/serve.go` starts `server.NewServer`. Docker `ENTRYPOINT` runs `/app/blocky` with default config path.
- **Server / adapters:** `server/` — DNS and HTTP listeners, DoH handlers, TLS certificate loading (self-signed or file-based), graceful shutdown, healthcheck DNS name `healthcheck.blocky`.
- **Domain / core (resolver chain):** `resolver/` — ~30 resolver types chained in `server/createQueryResolver`: filtering, FQDN-only, client names, EDE, query logging, metrics, custom DNS, hosts file, blocking, DNSSEC (with subpackage `resolver/dnssec/`), caching, DNS64, ECS, conditional upstream, special-use domain names, upstream tree. `resolver/bootstrap.go` provides bootstrap DNS during upstream init.
- **Blocking / lists:** `lists/` — download, parse, cache deny/allow lists; `resolver/blocking_resolver.go` applies block logic with group scoping.
- **Config:** `config/` — typed YAML schema, migrations, validation, enum generation for protocols and strategies.
- **API layer:** `api/` — OpenAPI-generated types, server interface, client for CLI; `api/api_interface_impl.go` bridges to resolver capabilities.
- **Persistence adapters:** `querylog/` (CSV, DB, logger, none writers), `cache/` (memory + Redis), `redis/` (client factory, event bus bridge).
- **Supporting libs:** `model/` (request/response types), `util/` (TLS, EDNS0, HTTP helpers), `trie/` (domain trie), `metrics/`, `log/`, `evt/` (event bus).
- **CLI commands:** `cmd/` — `serve`, `blocking`, `query`, `lists`, `validate`, `cache`, `healthcheck`, `version`.
- **Web assets:** `web/` — embedded static files, index template, RapiDoc bundle for interactive API docs.
- **Docs vault:** `docs/` — MkDocs source: `index.md`, `configuration.md` (exhaustive YAML reference), `installation.md`, `interfaces.md`, `network_configuration.md`, `prometheus_grafana.md`, `additional_information.md`, reference `config.yml`, OpenAPI spec at `docs/api/openapi.yaml`, Grafana JSON dashboards.
- **Tests:** `e2e/` integration tests; `helpertest/` shared fixtures; `*_test.go` throughout packages.
- **CI / release:** `.github/workflows/` — Makefile matrix (build, test, race, docker-build, e2e, goreleaser check, lint), release, docs publish, Codeberg mirror (upstream only), fork sync (non-upstream forks), CodeQL, dependabot.
- **Agent scaffolding:** `.claude/` — **not present** (scanned). `.docs/` — **not present** (scanned). No `.agents/` or `SKILL.md` trees.
- **Generated / vendor / ignored:** `bin/`, `vendor/`, `node_modules/`, `site/`, `coverage/`, `*.pem`, local `config.yml` at repo root (gitignored) — not ingested.

## 6. Configuration & contracts (no secrets)

Configuration is YAML (single file or directory of files). The loader applies defaults and supports config migration. Sensitive values in logs are obfuscated (`secretObfuscator` in `config/config.go`).

### Environment variables

| Variable | Purpose |
|----------|---------|
| `BLOCKY_CONFIG_FILE` | Path to config file or folder (Docker default: `/app/config.yml`) |
| `CONFIG_FILE` | Legacy alias for config path |
| `TZ` | Timezone for log timestamps in static builds (`main_static.go`) |
| `NO_COLOR` | Disables colored log output when set (`log/logger.go`) |
| `BLOCKY_IMAGE` | E2E test override for container image (`e2e/containers.go`) |
| `GOCOVERDIR` | E2E coverage output directory |

CLI flags `--config` / `-c`, `--apiHost`, `--apiPort` override defaults; API host/port are derived from the first `ports.http` listener when configured.

### Major config sections (abstraction)

- **Basic:** TLS cert/key paths, minimum TLS version, outbound IP version (dual/v4/v6).
- **ports:** `dns`, `tls`, `http`, `https`, `dohPath` listeners.
- **log:** level, format (text/json), timestamp, privacy obfuscation.
- **upstreams:** grouped resolver URLs (tcp+udp, tcp-tls, https, quic, DNS stamps), init strategy, selection strategy, timeouts.
- **blocking:** deny/allow lists, client group mappings, block types, refresh period, loading strategy.
- **caching:** TTL overrides, prefetch, min/max cache time.
- **queryLog:** type (none/console/csv/mysql/postgresql), retention, per-client files.
- **prometheus:** enable flag, metrics path.
- **redis:** address, sentinel, credentials (names only — never paste values), database index.
- **clientLookup:** reverse DNS or static client name mapping.
- **conditional / customDNS / hostsFile / filtering / fqdnOnly / dnssec / dns64 / ecs / ede / sudn:** advanced DNS behaviors.

### 6.1 HTTP / API endpoints (when applicable)

HTTP listeners must be enabled in config (`ports.http` and/or `ports.https`). REST API is mounted under `/api` per OpenAPI `servers[0].url`.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/api/blocking/status` | Returns JSON blocking enabled state, disabled groups, auto-enable countdown | none documented |
| `GET` | `/api/blocking/enable` | Re-enables blocking | none documented |
| `GET` | `/api/blocking/disable` | Disables blocking; optional `duration` and `groups` query params | none documented |
| `POST` | `/api/lists/refresh` | Reloads all deny/allow lists | none documented |
| `POST` | `/api/query` | Executes DNS query; JSON body with `query` and `type` | none documented |
| `POST` | `/api/cache/flush` | Clears DNS response cache | none documented |
| `GET` | `/dns-query` (configurable via `ports.dohPath`) | DNS-over-HTTPS GET (base64url `dns` param) | none |
| `POST` | `/dns-query` | DNS-over-HTTPS POST (`application/dns-message`) | none |
| `GET` | `/docs/openapi.yaml` | Serves embedded OpenAPI specification | none |
| `GET` | `/static/rapidoc.html` | Interactive API documentation (RapiDoc) | none |
| `GET` | `/` | HTML index with links to API docs, pprof, metrics | none |
| `GET` | `/debug/*` | Go pprof profiler (when HTTP enabled) | none |
| `GET` | `/metrics` | Prometheus scrape endpoint (when `prometheus.enable`) | none |
| `GET` | `/robots.txt` | Static robots file | none |

DNS protocol surface (non-HTTP):

| Protocol | Default port | Purpose |
|----------|--------------|---------|
| DNS UDP/TCP | 53 | Primary LAN resolver |
| DoT | 853 | Encrypted DNS |
| DoH | HTTP(S) path | Encrypted DNS over HTTP |
| Special name `healthcheck.blocky` | 53 | Docker/K8s health probe (`cmd/healthcheck.go`) |

No authentication layer is documented for the REST API — deployers should restrict HTTP listener access via firewall or bind addresses.

### 6.2 Other interfaces

**CLI (`blocky` binary via Cobra):**

| Command | Purpose |
|---------|---------|
| `blocky` / `blocky serve` | Start DNS server (default) |
| `blocky blocking enable` | Enable blocking via API |
| `blocky blocking disable [--duration] [--groups]` | Disable blocking, optionally timed or per-group |
| `blocky blocking status` | Print blocking status |
| `blocky query <domain> [--type]` | Debug DNS query (dig replacement) |
| `blocky lists refresh` | Reload block lists |
| `blocky cache flush` | Clear cache via API |
| `blocky validate [--config]` | Validate configuration file |
| `blocky healthcheck` | Probe `healthcheck.blocky` |
| `blocky version` | Print build version |

**Signals:** `SIGUSR1` dumps runtime configuration and memory stats to logs (`docs/additional_information.md`).

**Prometheus:** Scrape `/metrics` for counters/gauges prefixed `blocky_` (queries, cache, blocking, DNSSEC, list refresh, etc.).

## 7. Data & persistence

- **Core runtime:** Stateless — no mandatory database. Block lists and DNS cache live in memory; list files may be downloaded periodically to memory.
- **DNS cache:** In-process expiration cache (`cache/`); optional Redis backing with pub/sub channel `blocky_cache_sync` for multi-instance coherence.
- **Query logs:** Configurable writers — none, console, daily CSV files per client, or GORM-backed MySQL/MariaDB/PostgreSQL/SQLite tables (`querylog/`). Entity shapes derived from config; no row data ingested for this summary.
- **Redis:** Optional for cache decorator and event bus bridge; supports standalone and Sentinel failover (`redis/redis.go`).
- **TLS material:** Operator-supplied cert/key files or auto-generated self-signed cert for DoT/DoH.
- **Topology:** Typically one blocky instance per home/lab network segment at the DNS edge; optional horizontal scaling with shared Redis. All upstream resolution goes to configured external or LAN DNS servers.

## 8. Docs & agent memory (required scan)

Sources read and folded in:

1. **`README.md`** — Feature overview, quick start pointer, contribution note, privacy stance (no telemetry).
2. **`docs/index.md`** — Expanded feature list including DoQ; mirrors README for MkDocs site.
3. **`docs/configuration.md`** — Exhaustive YAML reference (ports, upstreams, blocking, caching, query log, Redis, DNSSEC, client groups, init strategies).
4. **`docs/installation.md`** — Binary, Docker, docker-compose, capability notes for port 53, environment variable for config path.
5. **`docs/interfaces.md`** — REST API and CLI contract summary; references OpenAPI spec.
6. **`docs/api/openapi.yaml`** — Authoritative REST endpoint definitions and request/response schemas.
7. **`docs/network_configuration.md`** — DHCP-based LAN deployment pattern; FritzBox example.
8. **`docs/prometheus_grafana.md`** — Metric names, bundled Grafana dashboard JSON references.
9. **`docs/additional_information.md`** — SIGUSR1 config dump, pprof, public list sources, fork Docker/sync secrets documentation.
10. **`mkdocs.yml`** — Documentation site structure and theme.
11. **`.claude/`** — **Absent.** Directory does not exist in shallow clone; nothing to summarize.
12. **`.docs/`** — **Absent.** Hidden docs vault not present; public docs live under `docs/` only.

No ADR, PRD, or constitution files were found. No agent skill trees or harness files beyond standard CI workflows.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repository under `kodexArg`; upstream is also public. This summary contains no clone URLs, live credentials, or connection strings.
- **Auth model:** DNS and HTTP management endpoints have **no built-in authentication** documented — security relies on network placement (LAN-only bind addresses, firewall rules). TLS for DoT/DoH can use operator certs or self-signed.
- **Privacy design:** Operator-chosen block lists only; random/parallel upstream strategies reduce single-provider visibility; optional log privacy mode obfuscates domain names in logs.
- **Secrets hygiene:** Config supports Redis passwords and DB credentials in YAML — never paste real values. `.gitignore` excludes `*.pem`, local `config.yml`, and build artifacts. This summary ingested no `.env` or credential files.
- **DNSSEC:** Optional validation of upstream responses before caching (`resolver/dnssec_resolver.go` positioned before cache in chain).
- **Supply chain:** Dependabot configured; CodeQL analysis workflow present.

## 10. Operational picture

**Local development:**

- `make build` — compile binary to `bin/blocky` (runs code generation unless `GO_SKIP_GENERATE=1`).
- `make test` — Ginkgo unit tests with coverage.
- `make e2e-test` — Docker-based integration tests.
- `make lint` — golangci-lint v2.
- `make serve_docs` — MkDocs Material via Docker on port 8000.
- Run: `./blocky --config config.yml` (or `make run`).

**Deployment:**

- **Docker:** Multi-arch image published as `spx01/blocky` (Docker Hub) and `ghcr.io/0xerr0r/blocky` (GHCR); scratch-based final stage, `HEALTHCHECK` via `blocky healthcheck`, default config at `/app/config.yml`.
- **Binary:** GoReleaser produces release artifacts (`.goreleaser.yml`); GitHub Actions `release.yml` on upstream.
- **Kubernetes:** Community Helm chart referenced in docs (not in this repo tree).
- **CI:** `makefile.yml` matrix runs build, test, race detector, docker-build, e2e-test, goreleaser config check, and lint on Go changes.
- **kodexArg fork:** `fork-sync.yml` can sync `main` from upstream every 30 minutes when `FORK_SYNC_TOKEN` secret exists.

**Hardware:** Designed for x86-64 and ARM (Raspberry Pi). Low memory footprint emphasized in README; `SIGUSR1` dump reports alloc/heap stats.

**Privileged ports:** Binding port 53 requires `CAP_NET_BIND_SERVICE` (setcap in Makefile `BIN_AUTOCAB` path) or root — Docker maps ports instead.

## 11. Open questions / unknowns

- **kodexArg-specific deltas:** The shallow clone appears identical to upstream `main`; no kodexArg-only commits or branding were inspected beyond remote configuration. Any organizational customizations may be limited to fork metadata.
- **Helm chart:** Referenced in documentation as community-supported but chart source is not in this repository tree.
- **REST API authentication:** No API keys, mTLS, or OIDC hooks found in OpenAPI or server code — treat management plane as trusted-network-only unless wrapped by a reverse proxy.
- **Exact kodexArg/blocky GitHub description vs. upstream:** Dispatcher hint matches upstream; fork relationship to `0xERR0R/blocky` is inferred from remotes and workflows, not from kodexArg-specific README edits.
- **`.claude/` / `.docs/`:** Confirmed absent; if added later on another branch, this summary would need refresh.
