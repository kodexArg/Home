import { defineChunks, type ChunkDef } from '../defineChunks';

const DEFS: ChunkDef[] = [
	{
		id: "alvs-corporate-books-0-0708be44",
		title: "ALVS Corporate Books — statutory registers, compliance, and litigation on Astro + Django — ALVS Corporate Books",
		text: `## ALVS Corporate Books

> **Problem thesis (required):** This repository is the production application for Grupo ALVS corporate books — statutory registers, compliance tracking, and litigation management — delivered as a two-service stack (Astro SSR frontend + Django/DRF API) on persistent AWS Fargate infrastructure. It exists because legal, corporate, and compliance teams need one authenticated system to maintain entities, books and folios, cap tables, officers, regulatory deadlines, case files, and related artifacts under entity-scoped permissions, with SharePoint/M365 data reachable only through this tier. A custom agent harness (constitution, ADRs, API SSOT, TDD/BDD gates, guardian bots) keeps the product growing safely by addition rather than ad-hoc sprawl.`,
		related: [],
		tags: ["alvs-corporate-books","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-corporate-books",
	},
	{
		id: "alvs-corporate-books-1-4ac42bd8",
		title: "ALVS Corporate Books — statutory registers, compliance, and litigation on Astro + Django — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | (integration); is the production deploy branch |
| One-line pitch | Corporate books, compliance, and litigation for Grupo ALVS — Astro SSR UI over a Django 6 API on two Fargate services with PostgreSQL, Cognito auth, and Bedrock-assisted routing. |
| Audience | Internal ALVS legal/compliance/corporate operators, firm administrators, and using the chat router; kodexArg maintainers and agent harness users. |`,
		related: [],
		tags: ["alvs-corporate-books","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-corporate-books",
	},
	{
		id: "alvs-corporate-books-2-731c7718",
		title: "ALVS Corporate Books — statutory registers, compliance, and litigation on Astro + Django — P1 — Fragmented corporate and compliance record-keeping",
		text: `### P1 — Fragmented corporate and compliance record-keeping

- **Who hurts:** Corporate secretaries, compliance officers, and entity administrators at Grupo ALVS.
- **Pain today:** Statutory books, beneficial-owner declarations, tax obligations, regulatory filings, proceedings, and renewals live across disconnected tools; deadlines are easy to miss; there is no single entity-scoped view of "what is due and what is sealed."
- **How this repo answers:** Django domain apps ( , , ) expose a large, permission-filtered REST API declared in . The Astro frontend renders directory pages, detail views, and editor-gated forms for entities, books/folios (with immutable close + SHA-256 hash), shareholders/shareholdings, officers (with an admin approval queue), compliance reminders/findings/beneficial owners, tax catalogs and due dates, regulatory filings, proceedings/renewals, case files, procedural deadlines, powers of attorney, regulated fees, pleading templates, and a cross-entity compliance dashboard. Entity-level grants scope read vs write access; admins see all.
- **Out of scope:** General ERP, payroll, accounting ledger, or external court e-filing integrations beyond what the API models capture.`,
		related: [],
		tags: ["alvs-corporate-books","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-corporate-books",
	},
	{
		id: "alvs-corporate-books-3-e3947667",
		title: "ALVS Corporate Books — statutory registers, compliance, and litigation on Astro + Django — P2 — Unsafe exposure of M365/SharePoint data to the public web",
		text: `### P2 — Unsafe exposure of M365/SharePoint data to the public web

- **Who hurts:** IT security, platform owners, and executives responsible for information governance.
- **Pain today:** Publishing company registers or compliance data directly from SharePoint risks anonymous access, inconsistent RBAC, and no unified audit trail at the application layer.
- **How this repo answers:** The PRD ( ) mandates that SharePoint/M365 information reaches the web only through this authenticated AWS tier. Cognito (federated Google IdP) authenticates; Django Groups and per-entity permissions authorize. Microsoft Graph is used app-only ( ) for controlled reads (demo hello/world cells and the capability layer), with secrets in AWS Secrets Manager per . Media uses S3 presigned URLs; audit logs and notifications live in .
- **Out of scope:** Replacing SharePoint as the document system of record; this app brokers and presents governed subsets.`,
		related: [],
		tags: ["alvs-corporate-books","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-corporate-books",
	},
	{
		id: "alvs-corporate-books-4-6f175cfc",
		title: "ALVS Corporate Books — statutory registers, compliance, and litigation on Astro + Django — P3 — AI assistance without giving models actuator rights",
		text: `### P3 — AI assistance without giving models actuator rights

- **Who hurts:** Operators who want natural-language navigation and lawyers who need drafting help; security reviewers who fear prompt injection driving mutations.
- **Pain today:** Chatbots that both interpret intent and execute actions blur trust boundaries; unconstrained LLM output can suggest or trigger unauthorized operations.
- **How this repo answers:** A strict two-tier AI design ( , ADR-17/18/25): the **router** ( ) uses Bedrock Nova Micro with JSON-schema constrained enum outputs — it chooses among permission-filtered intents only, never generates user-visible prose. The **assistant** generating tier ( , chat sessions) produces read-only text; page context is assembled server-side from a closed nav registry, not raw page HTML. Rate limits, cooldowns, audit rows ( , ), and kill switches ( , ) provide operational guardrails.
- **Out of scope:** Autonomous agents that POST/PATCH/DELETE domain records; all mutations remain explicit UI/API actions by authenticated humans.`,
		related: [],
		tags: ["alvs-corporate-books","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-corporate-books",
	},
	{
		id: "alvs-corporate-books-5-a8c48d7d",
		title: "ALVS Corporate Books — statutory registers, compliance, and litigation on Astro + Django — 3. Product / idea",
		text: `## 3. Product / idea

The mental model is **two Dockerized services in production** — backend (ASGI uvicorn on port 8000) and frontend (Astro SSR on port 4321) — fronted by a shared ALB with host-based routing: API, accounts, admin, and static/media paths hit Django; everything else is SSR from Astro. SSR fetches the backend via Cloud Map private DNS ( ), never through the public load balancer. PostgreSQL (RDS in cloud, container locally) holds all domain state. Redis is explicitly prohibited ( ); caching uses Django database cache, HTTP cache headers, and in-process patterns. The product grew from the template but is no longer that template: project slug , owner-chosen production host (documented in and ), persistent footprint never torn down (ADR-29). Features are added by **new domain routes and TDD/BDD entries**, not by rewriting the harness. User journey (simplified): authenticate via Cognito → land in lobby/home → browse entities → drill into books, cap table, officers, compliance cards, litigation cases → act through forms gated by and entity permissions → optionally open chat drawer for page-context Q&A or use the chatui router for safe navigation intents.`,
		related: [],
		tags: ["alvs-corporate-books","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-corporate-books",
	},
	{
		id: "alvs-fabric-config-0-59516878",
		title: "ALVS Fabric Config — SharePoint-to-Lakehouse CLI configuration — ALVS Fabric Config",
		text: `## ALVS Fabric Config

> **Problem thesis (required):** ALVS (an internal organization) must configure a Microsoft Fabric Data Lakehouse with SharePoint Online as the primary file source. Portal-based configuration does not scale, and ad-hoc scripts scatter auth and discovery logic. This repository centralizes the **CLI-first integration path** — Entra ID authentication, SharePoint file discovery via Microsoft Graph, Azure control-plane operations via Azure CLI and Azure MCP, and the architectural decision to land raw files in Fabric OneLake Bronze as the first medallion layer.`,
		related: [],
		tags: ["alvs-fabric-config","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "alvs-fabric-config",
	},
	{
		id: "alvs-fabric-config-1-33d859f6",
		title: "ALVS Fabric Config — SharePoint-to-Lakehouse CLI configuration — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | CLI-first configuration for the ALVS Data Lakehouse on Microsoft Fabric, with SharePoint Online as the file source. |
| Audience | ALVS data engineers, operators, and AI agents working on Fabric lakehouse setup; kodexArg maintainers with access to the private repo. |`,
		related: [],
		tags: ["alvs-fabric-config","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "alvs-fabric-config",
	},
	{
		id: "alvs-fabric-config-2-a0896bd2",
		title: "ALVS Fabric Config — SharePoint-to-Lakehouse CLI configuration — P1 — SharePoint-to-Fabric lakehouse bootstrap without portal click-ops",
		text: `### P1 — SharePoint-to-Fabric lakehouse bootstrap without portal click-ops

- **Who hurts:** ALVS data platform engineers and operators tasked with standing up a Fabric lakehouse fed by SharePoint document libraries.
- **Pain today:** Microsoft Fabric and SharePoint configuration is typically done through web portals — slow, non-reproducible, and hard to audit. There is no single repo that documents the chosen integration path, provides auth scripts, and verifies tooling before pipeline work begins.
- **How this repo answers:** Documents the **medallion architecture decision** (SharePoint → Graph → Bronze in OneLake), ships shell scripts for and , a Python probe that lists SharePoint sites and drives via Graph, and a tooling checker that validates all required CLIs and agent skills are installed.
- **Out of scope:** Does not yet implement the actual Graph-download-to-OneLake pipeline, Fabric workspace provisioning, or unattended app-registration ingest. Those are documented as next steps in .`,
		related: [],
		tags: ["alvs-fabric-config","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "alvs-fabric-config",
	},
	{
		id: "alvs-fabric-config-3-343abb16",
		title: "ALVS Fabric Config — SharePoint-to-Lakehouse CLI configuration — P2 — Unified auth and tooling verification across Azure and M365 planes",
		text: `### P2 — Unified auth and tooling verification across Azure and M365 planes

- **Who hurts:** Agents and humans who need to work across Entra ID, Azure subscriptions, SharePoint/Graph, and Fabric — each with different CLI tools and auth caches.
- **Pain today:** Without a checklist, it is unclear whether , , , , , and required agent skills are installed and authenticated. Failures surface late during pipeline development.
- **How this repo answers:** probes every required binary, checks and , and verifies seven agent skills under . Login scripts ( , ) standardize device-code and browser auth flows, printing tenant/subscription IDs for population.
- **Out of scope:** Key Vault integration for secrets (planned per AGENTS.md rules). No automated CI/CD for auth rotation.`,
		related: [],
		tags: ["alvs-fabric-config","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "alvs-fabric-config",
	},
	{
		id: "alvs-fabric-config-4-6a1c18ba",
		title: "ALVS Fabric Config — SharePoint-to-Lakehouse CLI configuration — P3 — Agent-ready project context for Fabric/SharePoint work",
		text: `### P3 — Agent-ready project context for Fabric/SharePoint work

- **Who hurts:** AI coding agents dispatched to configure ALVS infrastructure without domain context.
- **Pain today:** Agents lack a concise mission statement, integration path, skill list, and MCP configuration to operate effectively on Azure/Fabric/SharePoint tasks.
- **How this repo answers:** provides agent context (goal, chosen path, skills, rules). wires Azure MCP into the Grok session. README lists installed skills ( , , , Azure deploy/storage/prepare/diagnostics).
- **Out of scope:** No or vault present in the tree (scanned; not found). Agent skills themselves live outside the repo under .`,
		related: [],
		tags: ["alvs-fabric-config","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "alvs-fabric-config",
	},
	{
		id: "alvs-fabric-config-5-c63e1def",
		title: "ALVS Fabric Config — SharePoint-to-Lakehouse CLI configuration — 3. Product / idea",
		text: `## 3. Product / idea

The central idea is a **CLI-first, two-plane integration** for ALVS data lakehouse setup: After cloning and running the quick-start sequence, an operator can verify tooling, authenticate to both Azure and M365, and probe SharePoint site/drive access — establishing the foundation for a future pipeline that downloads files from Graph into OneLake Bronze. The mental model is **medallion architecture on Fabric**: SharePoint document libraries are the raw file source; Microsoft Graph is the read API; Fabric Lakehouse / OneLake is the landing zone. Azure CLI + Azure MCP handle the control plane (workspaces, capacity, RBAC). Entra ID provides unified identity for both planes. Membrane CLI is acknowledged as an optional third-party SharePoint skill broker, but the chosen path prefers **direct Entra + Graph** for least privilege and auditability.`,
		related: [],
		tags: ["alvs-fabric-config","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "alvs-fabric-config",
	},
	{
		id: "alvs-feedlot-campo-0-c2e249f9",
		title: "ALVS Feedlot Campo — feedlot traceability and client accounting — ALVS Feedlot Campo",
		text: `## ALVS Feedlot Campo

> **Problem thesis (required):** A commercial feedlot that boards client cattle alongside its own cannot run on spreadsheets and memory. Every kilo of ration, vaccine dose, labor charge, and machine hour must land on the correct animal and the correct client's immutable current account at the price of the day — then be readable back as gain, conversion, mortality, and sale settlement without manual reconstruction. This repository is the production application and agent harness for that problem: a Django API plus Astro SSR frontend on AWS, with documentation, ADRs, and automation rigid enough that agents and humans extend the domain without breaking attribution, RBAC, or the API contract.`,
		related: [],
		tags: ["alvs-feedlot-campo","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-feedlot-campo",
	},
	{
		id: "alvs-feedlot-campo-1-efacbccd",
		title: "ALVS Feedlot Campo — feedlot traceability and client accounting — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | (integration); is production deploy target |
| One-line pitch | End-to-end feedlot operations platform: trace every input to animal and owner, bill through an immutable ledger, derive metrics, and expose role-scoped portals including AI advisors — built on the template stack. |
| Audience | ALVS field staff (feed operators, field managers, workshop), feedlot owners/administrators, boarding clients ( ), and AI coding agents working through the vendored harness. |
The project was spawned from the template. Ownership moved to on 2026-08-02 (fork of the prior repo, which remains ). Deploy identity, OIDC trust, and GitHub Actions variables are per-repository configuration ( , ). Runtime project slug is ; the public production hostname is configured separately as (not derived from slug — see ).`,
		related: [],
		tags: ["alvs-feedlot-campo","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-feedlot-campo",
	},
	{
		id: "alvs-feedlot-campo-2-801f018d",
		title: "ALVS Feedlot Campo — feedlot traceability and client accounting — P1 — Attribution in mixed-ownership yards",
		text: `### P1 — Attribution in mixed-ownership yards

- **Who hurts:** Feedlot operators, field managers, and cattle owners (boarding clients) sharing pens.
- **Pain today:** When the feedlot's own herd and client cattle occupy the same physical yard, a ration or sanitary event without both answers — *which animal* and *whose account pays* — is a silent financial loss or dispute waiting for month-end.
- **How this repo answers:** Domain models and services across , , , , and record operational events as immutable facts. Each charge posts to a client's current account through ledger entries ( , ). Catalog rows are editable; operational events are create-only — corrections are new facts, not mutations ( ).
- **Out of scope:** General ERP outside campo operations; payroll; external accounting package sync (ledger is the in-app settlement book).`,
		related: [],
		tags: ["alvs-feedlot-campo","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-feedlot-campo",
	},
	{
		id: "alvs-feedlot-campo-3-38fd5a72",
		title: "ALVS Feedlot Campo — feedlot traceability and client accounting — P2 — Operations and billing as one trail",
		text: `### P2 — Operations and billing as one trail

- **Who hurts:** Field administration and feedlot owners reconciling yard activity against client balances.
- **Pain today:** Feeding, treatments, machinery, and labor are often logged in one place and invoiced in another, forcing manual reconciliation and hiding the price-of-the-day context.
- **How this repo answers:** The ledger is not bolted on — it is the settlement side of events the operation already writes ( ). Payments post credits; operational services post debits; and expose the same trail from the client portal ( ).
- **Out of scope:** Double-entry corporate accounting standards beyond the designed current-account model; tax filing.`,
		related: [],
		tags: ["alvs-feedlot-campo","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-feedlot-campo",
	},
	{
		id: "alvs-feedlot-campo-4-ca0e6093",
		title: "ALVS Feedlot Campo — feedlot traceability and client accounting — P3 — Cost-to-outcome visibility",
		text: `### P3 — Cost-to-outcome visibility

- **Who hurts:** Owners and advisors evaluating pen performance, conversion, and sale readiness.
- **Pain today:** Inputs are recorded, but asking "what did this cost buy in gain and conversion?" requires rebuilding metrics by hand across weighings, feedings, and exits.
- **How this repo answers:** Read-only app derives summary, daily cost, growth, conversion, mortality, and account evolution per client with explicit null contracts when data is insufficient ( ). Market price connectors ( app) supply reference hacienda prices for context, not ledger currency.
- **Out of scope:** Predictive ML beyond the designed Bedrock-based advisors and page-context assistant; commodity trading.`,
		related: [],
		tags: ["alvs-feedlot-campo","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-feedlot-campo",
	},
	{
		id: "alvs-feedlot-campo-5-a4910dd7",
		title: "ALVS Feedlot Campo — feedlot traceability and client accounting — P4 — Role-safe multi-tenant visibility",
		text: `### P4 — Role-safe multi-tenant visibility

- **Who hurts:** Boarding clients ( ) who must never see another client's animals or balance; staff who need full-yard read access.
- **Pain today:** Screen-level hiding is fragile; a single API leak exposes competitor data.
- **How this repo answers:** Cognito authenticates; Django Groups authorize ( ). Six operational roles in map to per-area DRF permission classes. are confined to their bound via and — mismatches return 403, fail-closed ( , , ).
- **Out of scope:** Cognito-group-based RBAC; per-establishment object ACLs beyond current client binding (noted as open design in ).`,
		related: [],
		tags: ["alvs-feedlot-campo","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-feedlot-campo",
	},
	{
		id: "alvs-financial-gateway-0-35847515",
		title: "ALVS Financial Gateway — treasury web application for Grupo ALVS — ALVS Financial Gateway",
		text: `## ALVS Financial Gateway

> **Problem thesis (required):** Grupo ALVS operates daily treasury across sixteen companies — cash positions, payment circuits, third-party checks, intercompany balances — historically through the legacy GestiónFinanciera system and SharePoint Excel workbooks. This repository is the permanent replacement: an authenticated web application that ingests financial data from Microsoft 365 into PostgreSQL, computes positions once on the server, enforces segregation-of-duties on writes, and renders everything in Spanish for operators while keeping code and documentation in English. It is a production deployment on shared ALVS AWS infrastructure, not a throwaway template fork.`,
		related: [],
		tags: ["alvs-financial-gateway","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-financial-gateway",
	},
	{
		id: "alvs-financial-gateway-1-19995fd1",
		title: "ALVS Financial Gateway — treasury web application for Grupo ALVS — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | (integration); is the production promotion line |
| One-line pitch | Treasury web gateway for Grupo ALVS — SharePoint financial data through an authenticated Django API to an Astro SSR frontend, replacing GestiónFinanciera. |
| Audience | ALVS treasury operators, confirmers, and viewers; internal admins; AI agents working through the project's harness; infrastructure operators deploying to AWS. |`,
		related: [],
		tags: ["alvs-financial-gateway","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-financial-gateway",
	},
	{
		id: "alvs-financial-gateway-2-952b471e",
		title: "ALVS Financial Gateway — treasury web application for Grupo ALVS — P1 — Legacy treasury tooling cannot serve a multi-company holding",
		text: `### P1 — Legacy treasury tooling cannot serve a multi-company holding

- **Who hurts:** Treasury staff, finance controllers, and executives across Grupo ALVS's sixteen-company holding who relied on GestiónFinanciera and scattered Excel workflows.
- **Pain today:** Cash positions, payment circuits, third-party checks, and intercompany balances were fragmented across a legacy desktop system and SharePoint workbooks. There was no single authenticated web surface with role-based access, audit trails, or server-side computation that every view could trust.
- **How this repo answers:** Eleven treasury views (holding funnel, daily position, bank position, projection, payments, check portfolio, movements, intercompany, reports, confirmation, control panel) are implemented as Astro SSR pages backed by Django REST endpoints. All figures are computed once in Python services ( and related treasury computation layer) and consumed identically by every screen. Operational writes — manual movements, check transitions, payment orders and confirmations — land immutable audit rows with segregation-of-duties guards.
- **Out of scope:** General ledger, ERP replacement, or non-treasury corporate functions. The external reverse-engineering reference is consulted out-of-tree and never vendored.`,
		related: [],
		tags: ["alvs-financial-gateway","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-financial-gateway",
	},
	{
		id: "alvs-financial-gateway-3-fefe27bc",
		title: "ALVS Financial Gateway — treasury web application for Grupo ALVS — P2 — SharePoint data must not reach browsers without an auth tier",
		text: `### P2 — SharePoint data must not reach browsers without an auth tier

- **Who hurts:** IT security, compliance, and treasury operators who need Excel-sourced figures without exposing M365 directly.
- **Pain today:** Financial Excel files live in Microsoft 365. Serving them raw to a browser would bypass Django authorization and leak source workbooks.
- **How this repo answers:** A confidential Entra app registration acquires app-only Graph tokens ( ) using three declared env vars ( , , ). Nine SharePoint workbooks ingest into PostgreSQL via (admin-gated). Every treasury read endpoint requires session auth plus Django group membership ( , , , or ). Responses are cached.
- **Out of scope:** User-delegated Graph flows, write-back to SharePoint, or real-time Excel co-authoring. Scheduled ingestion via EventBridge → ECS RunTask is designed but not yet provisioned.`,
		related: [],
		tags: ["alvs-financial-gateway","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-financial-gateway",
	},
	{
		id: "alvs-financial-gateway-4-008bc1d0",
		title: "ALVS Financial Gateway — treasury web application for Grupo ALVS — P3 — Agents and humans need a governed development harness, not ad-hoc edits",
		text: `### P3 — Agents and humans need a governed development harness, not ad-hoc edits

- **Who hurts:** kodexArg maintainers and AI agents implementing features under strict API, ADR, and documentation discipline.
- **Pain today:** Full-stack treasury apps with AI surfaces, M365 integration, and AWS deploys are easy to break with undeclared routes, secret leaks, or docs drift.
- **How this repo answers:** A vendored harness ( , , hooks, guardians) enforces the ABC gate (PRD → ADRs → API), requires API rows before code, blocks undeclared env vars, dispatches guardian agents on SSOT changes, and mandates vault-first doc reads via MCP. Development follows BDD → API → TDD for backend and BDD-first for user-facing frontend work.
- **Out of scope:** Being a reusable open-source framework — it is a permanent ALVS production app born from the template but no longer governed as a template.`,
		related: [],
		tags: ["alvs-financial-gateway","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-financial-gateway",
	},
	{
		id: "alvs-financial-gateway-5-cff96bff",
		title: "ALVS Financial Gateway — treasury web application for Grupo ALVS — 3. Product / idea",
		text: `## 3. Product / idea

ALVS Financial Gateway is a **two-service web application**: an Astro 7 SSR + Svelte 5 frontend and a Django 6 + DRF backend, each running as its own AWS Fargate task behind a shared ALB. PostgreSQL holds authoritative operational state. Cognito (federated through Google) authenticates; Django Groups authorize. Bedrock powers two disjoint AI tiers — a closed-enum navigation router ( ) and a read-only page-context assistant ( ). The mental model for treasury data is **ingest → compute → render**: 1. SharePoint workbooks are ingested into normalized tables with real stamps. 2. Pure computation services assemble positions, projections, and reports server-side (one call feeds Posición, Posición Bancaria, and Holding views). 3. The Astro frontend SSR-fetches composed payloads (e.g. ) to avoid client waterfalls, renders Spanish labels from a frontend catalog, and scopes by . Users land on a role-gated lobby ( ) or their configured , switch company scope via the navbar, and navigate eleven treasury views plus profile, control panel, chat UI, and a component showcase. Theme, sidebar side, and chat drawer preferences are user-tunable and persisted via .`,
		related: [],
		tags: ["alvs-financial-gateway","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-financial-gateway",
	},
	{
		id: "alvs-finanzas-0-363a11ed",
		title: "alvs-finanzas — ALVS internal finanzas web app on the astro-drf-aws harness — alvs-finanzas",
		text: `## alvs-finanzas

> **Problem thesis (required):** This private repository is a fork of the template, repurposed as **kodexArg/alvs-finanzas** — an internal Alvsgroup finanzas application whose expected outcome is a **working AWS deploy** of a two-container system (Astro SSR frontend + Django REST backend). The **harness is treated as the real product**: a live Obsidian-flavored documentation vault, vendored agent skills, enforcement hooks, and three guardian subagents that gate changes to PRD, ADRs, and API contracts. Application code (auth, RBAC, health probes, M365 Graph Excel reads, showcase UI) follows that harness. The home page already exercises SharePoint connectivity by SSR-fetching two Excel cells through app-only Graph endpoints.`,
		related: [],
		tags: ["alvs-finanzas","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-finanzas",
	},
	{
		id: "alvs-finanzas-1-4e844b8b",
		title: "alvs-finanzas — ALVS internal finanzas web app on the astro-drf-aws harness — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | (integration); production deploys from |
| One-line pitch | Private ALVS finanzas app on a harness-first Astro+Django template with Cognito login, Django RBAC, and Microsoft Graph SharePoint probes — deployed as twin Fargate services on AWS us-east-1. |
| Audience | Internal ALVS operators and developers; AI coding agents working through ; kodexArg maintainers syncing upstream template improvements. |`,
		related: [],
		tags: ["alvs-finanzas","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-finanzas",
	},
	{
		id: "alvs-finanzas-2-a2a4e9d5",
		title: "alvs-finanzas — ALVS internal finanzas web app on the astro-drf-aws harness — P1 — Repeatable internal web-app delivery for ALVS finanzas",
		text: `### P1 — Repeatable internal web-app delivery for ALVS finanzas

- **Who hurts:** ALVS engineering and product owners who need another authenticated internal tool without reinventing ECS, ALB routing, Cognito, RDS, and CI/CD each time.
- **Pain today:** One-off stacks drift on auth, caching, secrets handling, and deploy mechanics; finanzas features get blocked on infrastructure decisions.
- **How this repo answers:** Forks the battle-tested layout: (Astro 7 SSR + Svelte islands) and (Django 6 + DRF) behind a shared ALB with path-based routing ( , → backend; catch-all → frontend). documents the two-Fargate, no-NAT, no-CDN, Secrets Manager-only pattern. Root reproduces Postgres + backend + frontend locally with profiles , , , .
- **Out of scope:** Multi-tenant SaaS, public marketing sites, edge CDN caching, Redis/ElastiCache, or a staging environment tier (only and exist per ADR doctrine).`,
		related: [],
		tags: ["alvs-finanzas","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-finanzas",
	},
	{
		id: "alvs-finanzas-3-709b59f6",
		title: "alvs-finanzas — ALVS internal finanzas web app on the astro-drf-aws harness — P2 — Agent-safe development with binding contracts",
		text: `### P2 — Agent-safe development with binding contracts

- **Who hurts:** Developers and autonomous agents editing a complex full-stack repo where undeclared API routes and mystery env vars silently ship to production.
- **Pain today:** LLM edits add endpoints, variables, or features that contradict product scope; review burden explodes because truth is scattered across code.
- **How this repo answers:** The **ABC gate** in : every change must follow , comply with ADRs in (mirrored to ), and respect if touching HTTP surface. Hooks in enforce this at edit time: blocks undeclared routes; blocks undeclared env reads; injects PRD+API at session start; routes SSOT edits to guardian agents. Development loop: . Backend code is born through entries, not ad-hoc patches.
- **Out of scope:** Replacing human product judgment; the guardians triage and block defects but do not define business requirements.`,
		related: [],
		tags: ["alvs-finanzas","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-finanzas",
	},
	{
		id: "alvs-finanzas-4-be9e803a",
		title: "alvs-finanzas — ALVS internal finanzas web app on the astro-drf-aws harness — P3 — Bounded Microsoft 365 / SharePoint access from Django",
		text: `### P3 — Bounded Microsoft 365 / SharePoint access from Django

- **Who hurts:** Finanzas workflows that depend on Excel workbooks in SharePoint; teams that must not expose Graph tokens or client secrets to the browser.
- **Pain today:** Spreadsheets are authoritative but inaccessible to a web UI without fragile scripts, over-broad permissions, or frontend-held secrets.
- **How this repo answers:** implements **app-only** Graph reads ( via MSAL) for two demo endpoints ( , ) that return plain-text cell values from a configured workbook ( → "Hello", → "World"). The Astro home page ( ) SSR-fetches these via internal and displays a SharePoint connection card (Spanish UI copy for operators). and document the deliberate exception. A fuller delegated-OAuth plan lives in and for future four-endpoint JSON resource APIs.
- **Out of scope:** Full SharePoint CRUD, delegated user OAuth connect flow (planned but not fully implemented per the M365 plan), Cognito-as-Graph-IdP, or any Graph secrets on the frontend.`,
		related: [],
		tags: ["alvs-finanzas","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-finanzas",
	},
	{
		id: "alvs-finanzas-5-81a21bb5",
		title: "alvs-finanzas — ALVS internal finanzas web app on the astro-drf-aws harness — 3. Product / idea",
		text: `## 3. Product / idea

The mental model is **harness-first, two-service web app**: **Authentication:** Cognito hosted UI performs OIDC; Django exchanges the code, verifies the ID token (PyJWT + JWKS), s a custom keyed on , and opens a **Django DB session** (not bearer tokens in the browser). **Authorization:** Django Groups + DRF permission classes only — Cognito groups/claims are explicitly banned ( , ). Local dev can use when both and are true; deploy checks hard-fail if either leaks into production images. **Frontend interactivity ladder** ( ): server HTML first → HTMX fragments from Django → Svelte islands only when client state demands it. The repo includes shadcn-svelte components, a ChatInput showcase, and middleware-level backstop. **Caching doctrine** ( , ): no Redis ever; + explicit HTTP headers + narrow LocMem/module caches only. **Fork relationship:** retains remote to ; skill cherry-picks compatible upstream commits. Project slug in docs/glossary is , but the **live ephemeral deploy inventory** ( , ) still references the prior slug until resources are re-provisioned under the new name.`,
		related: [],
		tags: ["alvs-finanzas","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-finanzas",
	},
	{
		id: "alvs-km-gw-0-1ddb2bed",
		title: "ALVS km-gw — SharePoint-to-web gateway with AI-safe ChatUI router — ALVS km-gw",
		text: `## ALVS km-gw

> **Problem thesis (required):** Grupo ALVS needs a knowledge-management web gateway ( ) that lets authenticated staff reach company information originating in Microsoft 365 and SharePoint without exposing those estates directly. This private repository is a production-oriented instance scaffolded from the template: an Astro 7 SSR frontend and a Django 6 + DRF backend on two AWS Fargate services, backed by PostgreSQL, gated by Cognito authentication and Django RBAC, with a ChatUI surface that is actually a security-conscious router (not a chatbot) and a vendored AI harness that enforces PRD, ADR, and API contracts on every change.`,
		related: [],
		tags: ["alvs-km-gw","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-km-gw",
	},
	{
		id: "alvs-km-gw-1-582f3099",
		title: "ALVS km-gw — SharePoint-to-web gateway with AI-safe ChatUI router — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | (integration); is the production promotion line |
| One-line pitch | ALVS knowledge-management gateway — SharePoint and M365 data through an authenticated Django API to an Astro SSR frontend, with a Bedrock-backed navigation router and an agent harness that cannot be left. |
| Audience | Grupo ALVS internal operators and admins; AI agents working through the project's harness; infrastructure operators deploying to shared ALVS AWS infrastructure in . |
The deploy workflow sets , identifying this instance on shared ALVS infrastructure. Much of the documentation and seed defaults still carry the template reference slug (compose fallbacks, guardian agent names, some secret ARNs frozen at provisioning time per issue #129) — the repo is a forked template instance whose runtime identity is while inheriting the template's harness naming.`,
		related: [],
		tags: ["alvs-km-gw","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-km-gw",
	},
	{
		id: "alvs-km-gw-2-001fdec5",
		title: "ALVS km-gw — SharePoint-to-web gateway with AI-safe ChatUI router — P1 — SharePoint and M365 data must not reach browsers without an auth tier",
		text: `### P1 — SharePoint and M365 data must not reach browsers without an auth tier

- **Who hurts:** ALVS staff who need company information from Microsoft 365; IT security and compliance teams responsible for data egress; operators building dashboards and tools on top of SharePoint-sourced content.
- **Pain today:** Financial and operational data lives in SharePoint workbooks and the broader M365 estate. Serving that material directly to a browser would bypass authorization, leak source files, and offer no centralized RBAC or audit surface.
- **How this repo answers:** The PRD ( ) states the north star: connect SharePoint securely through AWS so company information reaches the web only through this authenticated tier under Django RBAC. A confidential Entra app registration acquires app-only Graph tokens via using three declared env vars ( , , ). Demo endpoints ( , ) prove the Graph read path by fetching named workbook cells as plain text. Production expansion follows the same pattern: new domain apps and routes grow by addition while the harness stays fixed.
- **Out of scope:** Replacing SharePoint as a document system; anonymous public access; storing M365 credentials in the frontend (frontend tasks receive only non-secret variables).`,
		related: [],
		tags: ["alvs-km-gw","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-km-gw",
	},
	{
		id: "alvs-km-gw-3-fd180a23",
		title: "ALVS km-gw — SharePoint-to-web gateway with AI-safe ChatUI router — P2 — A growing web site needs a safe conversational router, not an open chatbot",
		text: `### P2 — A growing web site needs a safe conversational router, not an open chatbot

- **Who hurts:** End users navigating a site that keeps gaining pages and actions; security reviewers worried about prompt injection and uncontrolled LLM output; operators in the or Django groups who use the ChatUI.
- **Pain today:** A conventional chatbot that generates free text reintroduces ambiguity, injection risk, and un-auditable behavior. Users still want a chat-like box to express intent and be routed to the right place.
- **How this repo answers:** The ChatUI ( , documented in ) is a **router**, not a chatbot. takes an utterance, builds a permission-filtered closed menu server-side, calls Amazon Nova Micro on Bedrock with JSON-schema-constrained decoding at temperature 0, and returns exactly one of four outcomes ( , , , ) — never free prose. The choosing tier never generates; a future generating tier (stage 2, not built) would be filtered through structured slot-filled templates. Every decision persists an audit row. Rate limits ( , silent abuse block via ) return indistinguishable responses. RBAC requires membership in or .
- **Out of scope:** Open-ended conversational AI; local model servers; Redis-backed rate limiting (Redis is prohibited per ).`,
		related: [],
		tags: ["alvs-km-gw","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-km-gw",
	},
	{
		id: "alvs-km-gw-4-054591a8",
		title: "ALVS km-gw — SharePoint-to-web gateway with AI-safe ChatUI router — P3 — New ALVS apps need a harness whose railguard cannot be bypassed",
		text: `### P3 — New ALVS apps need a harness whose railguard cannot be bypassed

- **Who hurts:** Developers and AI agents adding features; maintainers who must keep docs, API contracts, and architecture rules aligned; operators running autonomous issue workflows.
- **Pain today:** Undocumented routes, env vars, and ad-hoc agent behavior cause drift, security gaps, and expensive rework when multiple contributors (human and AI) touch the same codebase.
- **How this repo answers:** The harness is the product's support structure ( , ). Vendored skills under (mirrored to ) cover Astro, Django, AWS, vault editing, orchestration, and triage-and-fix workflows. Hooks enforce the ABC gate (PRD? ADRs? API?), block undeclared routes and env reads, preload SSOTs at session start, and dispatch guardian subagents ( , , ) on watched surfaces. ADRs in load as . Development loop: idea → user-facing? → BDD → needs backend? → enter through only.
- **Out of scope:** Machine-global skill dependencies (everything required is vendored); teammate-style agent teams (standing decision: all agents are subagents).`,
		related: [],
		tags: ["alvs-km-gw","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-km-gw",
	},
	{
		id: "alvs-km-gw-5-11a77984",
		title: "ALVS km-gw — SharePoint-to-web gateway with AI-safe ChatUI router — 3. Product / idea",
		text: `## 3. Product / idea

The central mental model is **two Fargate containers behind one ALB host**: the Astro SSR service owns all browser-facing pages; the Django ASGI service owns , , , and . PostgreSQL holds users, sessions, router audit rows, and domain data. Cognito authenticates via OIDC (Google federated through the org pool); Django owns sessions and all RBAC via Groups and DRF permission classes. The frontend delivers themed, localized-rendered pages (code and docs always English per ) with variable-driven CSS custom properties ( ). Users authenticate through → Cognito → , then interact with profile theming ( ), a component showcase ( ), and the ChatUI router ( ). HTMX sits in the interactivity ladder before Svelte islands for server-rendered fragments. Infrastructure mirrors the SROA production precedent on shared ALVS AWS: ECS clusters / , ECR repos and , Secrets Manager paths , Cloud Map for SSR-to-backend internal calls, and a Bedrock VPC interface endpoint so Fargate tasks reach inference without NAT gateways.`,
		related: [],
		tags: ["alvs-km-gw","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "alvs-km-gw",
	},
	{
		id: "alvs-registros-libros-societario-0-8a8dfe34",
		title: "ALVS Registro de Libros Societarios — corporate registry web application for Grupo ALVS — ALVS Registro de Libros Societarios",
		text: `## ALVS Registro de Libros Societarios

> **Problem thesis (required):** Grupo ALVS maintains corporate registry operations for client entities — statutory books and folios, shareholder cap tables, governing-body officers, assembly checklists, compliance reminders and filings, and litigation dockets — historically through the legacy REGISTROS application. This repository is the migration to the kodexArg template: a private, authenticated web application where PostgreSQL is the system of record, Django enforces per-entity read/write grants on top of Cognito login, the Astro SSR frontend renders Spanish operator copy, and a governed harness keeps API, ADR, and documentation discipline as the surface grows by addition.`,
		related: [],
		tags: ["alvs-registros-libros-societarios-kodexarg","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "ALVS-REGISTROS-LIBROS-SOCIETARIOS-KODEXARG",
	},
	{
		id: "alvs-registros-libros-societario-1-4eb3ea90",
		title: "ALVS Registro de Libros Societarios — corporate registry web application for Grupo ALVS — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | (integration); is the production promotion line |
| One-line pitch | Corporate registry and adjacent law-firm operations for Grupo ALVS — entities, statutory books, compliance, and litigation in one authenticated Astro + Django stack migrated from legacy REGISTROS. |
| Audience | ALVS corporate-law operators and editors; firm admins managing entity permissions and officer approvals; litigation staff; internal kodexArg maintainers and AI agents working through the project harness. |`,
		related: [],
		tags: ["alvs-registros-libros-societarios-kodexarg","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "ALVS-REGISTROS-LIBROS-SOCIETARIOS-KODEXARG",
	},
	{
		id: "alvs-registros-libros-societario-2-123ff310",
		title: "ALVS Registro de Libros Societarios — corporate registry web application for Grupo ALVS — P1 — Legacy REGISTROS cannot serve modern corporate-book workflows",
		text: `### P1 — Legacy REGISTROS cannot serve modern corporate-book workflows

- **Who hurts:** Corporate-law operators at Grupo ALVS who maintain libros societarios, shareholder registries, and entity governance records for client companies and associations.
- **Pain today:** The legacy REGISTROS desktop application held statutory books, numbered folios, cap-table shareholdings, officer rosters, and assembly preparation checklists in a monolithic Spanish codebase without web access, modern authentication, immutable audit semantics, or per-entity authorization. Opening a book, writing a folio, and sealing it with a cryptographic close hash — core Argentine corporate-registry practice — had no path to a secure multi-user web tier.
- **How this repo answers:** The Django app ports the domain into English identifiers with Spanish i18n labels: (registered company/association), (rubricated statutory book), (numbered leaf opened then immutably closed with SHA-256 ), / (firm-wide registry and per-entity cap table), with an approval queue ( ), and / (LGS meeting preparation). REST endpoints under expose list/create/detail/patch/close flows; the Astro frontend implements directory pages, detail views, and editor-gated forms driven by 130+ TDD specs in .
- **Out of scope:** Replacing the public registries (DPJ/IGJ/IPJ/INAES) themselves, e-invoicing, or general ERP functions. External legacy`,
		related: [],
		tags: ["alvs-registros-libros-societarios-kodexarg","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "ALVS-REGISTROS-LIBROS-SOCIETARIOS-KODEXARG",
	},
	{
		id: "alvs-registros-libros-societario-3-d1bfafd5",
		title: "ALVS Registro de Libros Societarios — corporate registry web application for Grupo ALVS — P1 — Legacy REGISTROS cannot serve modern corporate-book workflows (2)",
		text: `behavior is referenced for parity (e.g. shareholding delete as ) but the old app is not vendored.`,
		related: [],
		tags: ["alvs-registros-libros-societarios-kodexarg","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "ALVS-REGISTROS-LIBROS-SOCIETARIOS-KODEXARG",
	},
	{
		id: "alvs-registros-libros-societario-4-e06fc5cb",
		title: "ALVS Registro de Libros Societarios — corporate registry web application for Grupo ALVS — P2 — Compliance and litigation work must live beside the registry with",
		text: `### P2 — Compliance and litigation work must live beside the registry without fragmenting access control

- **Who hurts:** Compliance analysts tracking tax obligations, regulatory filings, beneficial owners, and administrative proceedings; litigation staff managing case files, procedural deadlines, powers of attorney, and regulated fees.
- **Pain today:** Compliance reminders, findings, tax due dates, regulatory filings, proceedings, and renewals — plus litigation dockets, case events, adjustment indexes, jus values, pleading templates — were separate concerns in the legacy stack with inconsistent authorization models.
- **How this repo answers:** Three additional domain apps partition the surface while sharing session auth and Django Groups: (reminders, findings, beneficial owners, tax obligations/due dates, regulatory filings, proceedings/renewals), (case files, events, procedural deadlines, powers of attorney, adjustment indexes, jus values, regulated fees, pleading templates), and (audit log, module permissions, in-app notifications). Entity-scoped records honor read/write grants; firm-wide litigation catalogs use or as documented in . A cross-entity compliance dashboard aggregates dated items at .
- **Out of scope:** Full document management replacement, court e-filing integrations, or automated tax-calendar generation beyond the modeled obligation/due-date engine.`,
		related: [],
		tags: ["alvs-registros-libros-societarios-kodexarg","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "ALVS-REGISTROS-LIBROS-SOCIETARIOS-KODEXARG",
	},
	{
		id: "alvs-registros-libros-societario-5-cec4df86",
		title: "ALVS Registro de Libros Societarios — corporate registry web application for Grupo ALVS — P3 — Operators need a governed full-stack harness, not ad-hoc feature ",
		text: `### P3 — Operators need a governed full-stack harness, not ad-hoc feature sprawl

- **Who hurts:** kodexArg maintainers and AI agents extending a large, multi-domain legal application on shared ALVS AWS infrastructure.
- **Pain today:** Repositories with 170+ declared HTTP endpoints, 136 backend TDD documents, extensive frontend test suites, M365 capability, Bedrock router, and strict RBAC are easy to break with undeclared routes, env-var drift, or documentation rot.
- **How this repo answers:** The project inherits the complete harness: Obsidian-flavored vault, 24 ADRs mirrored into , guardian subagents ( , , ), enforcement hooks ( , , , ), vendored skills under , and the MCP for vault-first doc reads. The ABC gate requires every change to align with , ADRs, and . Backend work follows API row → TDD → models; frontend work follows BDD entries in .
- **Out of scope:** Being a public reusable template — this is a private ALVS production application that still carries template reference defaults (notably in deploy workflow seeds) pending full rename to a project-specific slug.`,
		related: [],
		tags: ["alvs-registros-libros-societarios-kodexarg","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "ALVS-REGISTROS-LIBROS-SOCIETARIOS-KODEXARG",
	},
	{
		id: "alvs-script-conciliar-xls-0-b91580bd",
		title: "alvs-script-conciliar-xls — Desktop Excel conciliation tool for Mercado Pago vs ALVS cobranzas — alvs-script-conciliar-xls",
		text: `## alvs-script-conciliar-xls

> **Problem thesis (required):** This private repository is a **local desktop utility** for ALVS internal accounting: it ingests four Excel exports — Mercado Pago activity, Planilla 1 (Transferencias sheet), and two Cobranzas Electrónicas files (KM1151 and Las Bóvedas) — and produces a reconciled Mercado Pago ledger annotated with match status, amount/time deltas, and source labels, plus two residue workbooks for unmatched cobranza rows. The tool replaces repetitive manual VLOOKUP-style work with a guided tkinter GUI and a deterministic three-pass matching pipeline implemented in .`,
		related: [],
		tags: ["alvs-script-conciliar-xls","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "alvs-script-conciliar-xls",
	},
	{
		id: "alvs-script-conciliar-xls-1-c8dafbfb",
		title: "alvs-script-conciliar-xls — Desktop Excel conciliation tool for Mercado Pago vs ALVS cobranzas — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Python desktop app that conciliates Mercado Pago operations against KM1151, Las Bóvedas cobranzas, and Planilla 1, writing annotated Excel outputs and orphan-residue files. |
| Audience | Internal ALVS finance / cobranzas operators who export spreadsheets from Mercado Pago and electronic-collection systems; kodexArg maintainers who run or extend the script locally. |`,
		related: [],
		tags: ["alvs-script-conciliar-xls","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "alvs-script-conciliar-xls",
	},
	{
		id: "alvs-script-conciliar-xls-2-df460527",
		title: "alvs-script-conciliar-xls — Desktop Excel conciliation tool for Mercado Pago vs ALVS cobranzas — P1 — Multi-source payment reconciliation for Mercado Pago",
		text: `### P1 — Multi-source payment reconciliation for Mercado Pago

- **Who hurts:** ALVS operators responsible for verifying that Mercado Pago settlements align with internal Cobranzas Electrónicas records from two distinct collection channels (KM1151 and Las Bóvedas).
- **Pain today:** Each source uses a different Excel layout (cobranza files skip six header rows; Planilla 1 uses a named sheet with currency-formatted amounts). Manually comparing in Mercado Pago against in cobranza exports is slow and error-prone across hundreds of rows.
- **How this repo answers:** filters Mercado Pago to relevant operation types ( , , ), then runs sequential matching: first KM1151 cobranzas, then Las Bóvedas cobranzas (by transaction ID), then Planilla 1 (for still-unmatched rows). Each match annotates the result row with conciliation label, counterpart amount/date, and computed deltas. Unmatched Mercado Pago rows are marked .
- **Out of scope:** Live API integration with Mercado Pago or cobranza backends; automated scheduling; multi-user server deployment; currency conversion beyond what the source spreadsheets already encode.`,
		related: [],
		tags: ["alvs-script-conciliar-xls","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "alvs-script-conciliar-xls",
	},
	{
		id: "alvs-script-conciliar-xls-3-b8fe82a1",
		title: "alvs-script-conciliar-xls — Desktop Excel conciliation tool for Mercado Pago vs ALVS cobranzas — P2 — Surfacing amount and timestamp discrepancies",
		text: `### P2 — Surfacing amount and timestamp discrepancies

- **Who hurts:** Reviewers who must distinguish clean matches from near-matches that need human follow-up.
- **Pain today:** A transaction ID match with a peso difference or a payment timestamp skewed by several minutes can look "matched" in a naive join but still indicate data or timing issues.
- **How this repo answers:** computes (Mercado Pago import minus cobranza ) and (payment date minus cobranza ). Thresholds flag when absolute amount delta exceeds 1 unit, and when minute delta exceeds 10 (default tolerance). Planilla 1 matching uses a separate amount tolerance of 15 units before flagging .
- **Out of scope:** Automatic correction of discrepancies; dispute resolution workflows; audit trail beyond the generated Excel columns.`,
		related: [],
		tags: ["alvs-script-conciliar-xls","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "alvs-script-conciliar-xls",
	},
	{
		id: "alvs-script-conciliar-xls-4-12e69de2",
		title: "alvs-script-conciliar-xls — Desktop Excel conciliation tool for Mercado Pago vs ALVS cobranzas — P3 — Orphan cobranza residue extraction",
		text: `### P3 — Orphan cobranza residue extraction

- **Who hurts:** Operators who must also identify cobranza rows that were never tied to any Mercado Pago operation in the export window.
- **Pain today:** Focusing only on Mercado Pago leaves "extra" cobranza entries invisible unless a second manual pass is done.
- **How this repo answers:** After matching, pulls rows from each cobranza DataFrame where remained false, producing and alongside the main .
- **Out of scope:** Reverse-matching Planilla 1 orphans; merging residue files across periods; alerting or ticketing.`,
		related: [],
		tags: ["alvs-script-conciliar-xls","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "alvs-script-conciliar-xls",
	},
	{
		id: "alvs-script-conciliar-xls-5-38f18499",
		title: "alvs-script-conciliar-xls — Desktop Excel conciliation tool for Mercado Pago vs ALVS cobranzas — 3. Product / idea",
		text: `## 3. Product / idea

The mental model is a **single-session desktop ETL + reconciliation pipeline**: 1. Operator launches , which opens a tkinter window titled "Conciliación de Cobranzas". 2. Four file-picker fields collect paths to: Mercado Pago export, Planilla 1 workbook, Cobranzas KM1151, Cobranzas Las Bóvedas (all ). 3. "Ejecutar Proceso" imports and normalizes each source into pandas DataFrames ( import helpers), then delegates to in . 4. On success, three Excel files are written to the process working directory: main conciliation result and two cobranza residue files. A success dialog and scrollable log panel provide operator feedback. The reconciliation engine is intentionally **sequential and priority-ordered**: cobranza channels are tried before Planilla 1, and KM1151 before Las Bóvedas. A Mercado Pago row already matched in an earlier pass is not reconsidered in later passes (Planilla matching only runs when is still empty).`,
		related: [],
		tags: ["alvs-script-conciliar-xls","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "alvs-script-conciliar-xls",
	},
	{
		id: "amesup-com-ar-0-b7d44132",
		title: "AMESUP — institutional mutual landing site (Angular SPA) — AMESUP institutional website",
		text: `## AMESUP institutional website

> **Problem thesis (required):** AMESUP (Asociación Mutual de Empleados de Sindicatos Unidos y Privados) needed a new public-facing web presence to replace legacy sites and brochures-only outreach. This repository delivers a production Angular single-page application: a conversion-oriented landing page for Mendoza public-sector employees seeking personal loans (up to five million ARS), subsidies, convenios, and membership benefits — deployed as static files on AWS Amplify with analytics via Google Tag Manager.`,
		related: [],
		tags: ["amesup-com-ar","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "amesup-com-ar",
	},
	{
		id: "amesup-com-ar-1-c91ff43d",
		title: "AMESUP — institutional mutual landing site (Angular SPA) — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Mobile-first institutional landing SPA for a Mendoza mutual, optimized for loan lead capture and WhatsApp handoff. |
| Audience | Mendoza public-sector employees and retirees (target borrowers), AMESUP marketing/commercial staff, and internal developers maintaining the site. |`,
		related: [],
		tags: ["amesup-com-ar","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "amesup-com-ar",
	},
	{
		id: "amesup-com-ar-2-51c786ca",
		title: "AMESUP — institutional mutual landing site (Angular SPA) — P1 — Outdated digital presence blocks conversion",
		text: `### P1 — Outdated digital presence blocks conversion

- **Who hurts:** AMESUP commercial team and prospective associates who discover the mutual through social campaigns, brochures, or word of mouth but land on an obsolete or inconsistent web experience.
- **Pain today:** Legacy domains and old contact channels (documented in ) diverge from current brand, product limits, and official contact data. Campaign materials promise a fully digital loan process, but the old site cannot reflect that promise or drive structured leads.
- **How this repo answers:** Delivers a modern Angular 21 SPA with a full landing funnel — hero with animated brand logo, services, benefits, stats, testimonials, FAQ, CTA blocks, and a structured contact form. Content is data-driven from , making copy updates centralized. Hero and CTA components route users to the contact form or external WhatsApp deep link. Visual identity uses a navy-blue + orange PrimeNG preset defined in .
- **Out of scope:** Backend loan origination, credit scoring, member portal, payment processing, CRM integration, or admin CMS. The contact form currently opens the user's mail client (\` rather than posting to an API.`,
		related: [],
		tags: ["amesup-com-ar","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "amesup-com-ar",
	},
	{
		id: "amesup-com-ar-3-01810674",
		title: "AMESUP — institutional mutual landing site (Angular SPA) — P2 — Mobile-first lead capture for a geographically targeted audience",
		text: `### P2 — Mobile-first lead capture for a geographically targeted audience

- **Who hurts:** Public employees in Mendoza province municipalities (Las Heras, Maipú, Guaymallén, Paraná, Cámara de Senadores, Departamento de Irrigación, etc.) who interact primarily via phone and messaging apps.
- **Pain today:** Brochure PDFs and social posts generate interest but lack a persistent, searchable, form-based capture path with employer-type segmentation and loan amount fields.
- **How this repo answers:** The contact form ( ) collects nombre, apellido, celular, DNI, monto solicitado, motivo (loan/subsidy/convenio/etc.), lugar de trabajo (employer dropdown), and optional message — then composes a pre-filled email to the institutional contact address defined in . WhatsApp buttons in hero and footer provide an alternate instant channel. Design is responsive (Tailwind utility classes, hero) with scroll-anchored navigation.
- **Out of scope:** Loan simulator (mentioned as a future goal in but not implemented), digital signature workflow, or associate self-service portal.`,
		related: [],
		tags: ["amesup-com-ar","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "amesup-com-ar",
	},
	{
		id: "amesup-com-ar-4-31a9ef4a",
		title: "AMESUP — institutional mutual landing site (Angular SPA) — P3 — Repeatable deployable frontend asset pipeline",
		text: `### P3 — Repeatable deployable frontend asset pipeline

- **Who hurts:** Developers and operators who must ship UI changes safely without manual server administration.
- **Pain today:** Marketing updates require coordinated rebuilds; without CI/CD, regressions in build or tests could reach production unnoticed.
- **How this repo answers:** defines an AWS Amplify build ( , , artifact ). GitHub Actions ( ) runs on push/PR to : Node 22, , , . Static SPA output with long-cache headers for JS/CSS. Version tracked in (currently per changelog).
- **Out of scope:** Infrastructure-as-code for AWS beyond Amplify's native config; multi-environment wrangler/workers patterns (this is pure static hosting).`,
		related: [],
		tags: ["amesup-com-ar","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "amesup-com-ar",
	},
	{
		id: "amesup-com-ar-5-8dbe324e",
		title: "AMESUP — institutional mutual landing site (Angular SPA) — 3. Product / idea",
		text: `## 3. Product / idea

The repository is a **single-route marketing SPA** — not a multi-app monorepo. After or production build, the user sees one long-scrolling landing page composed of vertically stacked sections wired in : 1. **Scroll logo** — fixed AMESUP logo that animates from hero size to navbar size on scroll ( ). 2. **Navbar** — anchor links to in-page sections (Inicio, Nosotros, Servicios, Beneficios, Preguntas, Contacto). 3. **Hero** — headline promoting 100% digital credit with 24-hour turnaround; dual CTAs (scroll to contact form, open WhatsApp). 4. **About** — institutional narrative, INAES registration note, mini-stats. 5. **Stats** — animated counters (20+ years, 5000+ members, 4 services, 100% transparency). 6. **Services** — cards for Préstamos (highlighted), Subsidios, Convenios, Beneficios. 7. **Benefits** — value props (no hidden fees, 24h approval, personalized attention). 8. **Testimonials** — four fictionalized member quotes with star ratings. 9. **FAQ** — six accordion items covering membership, loan timing, subsidies, health convenios, commerce discounts, credentials. 10. **CTA** — secondary conversion block. 11. **Contact form** — lead capture with employer and motive selectors. 12. **Footer** — brand, service links, institutional links, contact block, social icons, legal bottom bar. Routing ( ) is minimal: → landing, → 404 page, → redirect to`,
		related: [],
		tags: ["amesup-com-ar","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "amesup-com-ar",
	},
	{
		id: "api-python-debo-0-f5f7bd3f",
		title: "API Python DEBO — read-only MSSQL facade for YPF station operations — API Python DEBO",
		text: `## API Python DEBO

> **Problem thesis (required):** This repository specifies and will implement a **read-only API facade** (CQRS-style read model) over the transactional MSSQL database **DEBO**, which backs two YPF-branded fuel stations under a single legal entity. Today the repo is **specification-complete but code-absent** ( , , and do not exist yet). The pain it attacks: internal analysts, collections staff, and commercial users cannot safely or consistently pull fuel-volume reports, client balances, portfolio summaries, and invoice-aging data without opening DEBO directly — where turn boundaries cross midnight, balances are computed not stored, and naming is ambiguous across ~28k clients. The planned service exposes Spanish JSON endpoints with Bearer API-key auth, never mutates DEBO, and deploys eventually as a Windows Service co-located with SQL.`,
		related: [],
		tags: ["api-python-debo","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "api-python-debo",
	},
	{
		id: "api-python-debo-1-86af4983",
		title: "API Python DEBO — read-only MSSQL facade for YPF station operations — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | A specification-driven, read-only Python API that transforms DEBO MSSQL rows into internal JSON endpoints for YPF station fuel sales and accounts-receivable workflows. |
| Audience | Internal operators at KM 1107 stations (commercial, collections, admin); AI coding agents following and the BDD→TDD→BUILD chain; future PydanticAI tool consumers (post-MVP). |`,
		related: [],
		tags: ["api-python-debo","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "api-python-debo",
	},
	{
		id: "api-python-debo-2-68174a16",
		title: "API Python DEBO — read-only MSSQL facade for YPF station operations — P1 — Safe read access to a live transactional DEBO database",
		text: `### P1 — Safe read access to a live transactional DEBO database

- **Who hurts:** Internal staff who need reports without DB credentials or SQL literacy; operators who must not risk writes on the station management system's live database.
- **Pain today:** DEBO is the system of record written by the station POS/back-office stack. Direct SQL access is dangerous, credentials are sensitive, and even read queries can lock or contend with live operations if done carelessly.
- **How this repo answers:** Four-layer read-only defense (ADR 007): (1) MSSQL user with only; (2) TLS connection without write autocommit; (3) application repository exposing only parameterized SELECT paths; (4) server-side aggregation with / to avoid locking the operational DB. Code policy: **only SELECT**, never . Tests isolate DEBO via injectable fakes; integration tests are opt-in against the LAN SQL host.
- **Out of scope:** Any write path, schema migration, replication, or replacement of DEBO as system of record.`,
		related: [],
		tags: ["api-python-debo","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "api-python-debo",
	},
	{
		id: "api-python-debo-3-6227597b",
		title: "API Python DEBO — read-only MSSQL facade for YPF station operations — P2 — Correct business semantics for fuel sales and account balances",
		text: `### P2 — Correct business semantics for fuel sales and account balances

- **Who hurts:** Commercial analysts comparing shift performance; collections staff reconciling client debt; anyone who mis-reads DEBO's midnight turn boundaries or naïve balance sums.
- **Pain today:** Fuel liters live in planilla tables ( / ) with operational-day rules when night shifts cross midnight. Client balances are **calculated** ( ), not stored in (that field is credit limit). Naïve historical sums diverge wildly from DEBO screens (verified: client 27 full-history sum +2,500.93 vs real −122,242.07). Names are non-unique (~28k clients, ~27k distinct names).
- **How this repo answers:** Extensive live documentation in with verified SQL, operational-day CASE rules, MTN→turn mapping, debt-cycle anchor ("last point without debt"), and open-item logic for aging. User stories US-001–US-004 encode acceptance criteria, Gherkin scenarios, and TDD test maps. Hexagonal architecture keeps domain rules pure and testable without the database.
- **Out of scope:** Real-time intraday dispatch union ( ∪ ) for US-001 (planilla-closed liters only); full historical balance without anchor strategy.`,
		related: [],
		tags: ["api-python-debo","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "api-python-debo",
	},
	{
		id: "api-python-debo-4-b5bdcd27",
		title: "API Python DEBO — read-only MSSQL facade for YPF station operations — P3 — Repeatable, agent-friendly delivery of internal HTTP APIs",
		text: `### P3 — Repeatable, agent-friendly delivery of internal HTTP APIs

- **Who hurts:** Developers and LLM agents implementing endpoints without drifting from agreed behavior; ~5 LAN users needing per-person audit trails.
- **Pain today:** Ad-hoc scripts would duplicate queries, diverge from DEBO UI semantics, and lack auth. No single SSOT for route names — known drift between BDD Gherkin ( ) and TDD/API ( ) flagged as blocking reconciliation.
- **How this repo answers:** Specification-Driven Development (ADR 004): **BDD → documentation → TDD → BUILD**, with as endpoint SSOT (ADR 008). Static Bearer API keys per person with roles ( , , ) and SQLite audit middleware (ADR 009). Agent hooks enforce API.md sync, TDD-first prompts, and BDD close-loop review. Skills ( , , ) guide iteration closure.
- **Out of scope:** External IdP/SSO, JWT login flows, Docker orchestration, public internet exposure.`,
		related: [],
		tags: ["api-python-debo","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "api-python-debo",
	},
	{
		id: "api-python-debo-5-62ce785d",
		title: "API Python DEBO — read-only MSSQL facade for YPF station operations — 3. Product / idea",
		text: `## 3. Product / idea

The central idea is an **API facade** — not a protocol proxy. The service **reads** DEBO, **applies business rules**, and **publishes JSON** for internal consumers. It is the query side of a lightweight CQRS split: DEBO remains authoritative for writes; this service is read-only.`,
		related: [],
		tags: ["api-python-debo","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "api-python-debo",
	},
	{
		id: "apprunnertest2-0-1fbdca99",
		title: "AppRunner Test 2 — Django on AWS App Runner integration harness — AppRunner Test 2",
		text: `## AppRunner Test 2

> **Problem thesis (required):** kodexArg needs a **private, throwaway-but-real** Django application that deploys on **AWS App Runner's native Python 3.11 runtime** — no containers — while exercising the full AWS peripheral stack (RDS Postgres, S3, CloudFront, Secrets Manager). The repo is both a **deployment recipe** ( + ) and an **integration test harness** that aborts startup if configuration, connectivity, or S3 write/read checks fail. It is not a production product; it is the proving ground for ALVS-style Django hosting patterns before auth, API, and modern frontend work land.`,
		related: [],
		tags: ["apprunnertest2","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "apprunnertest2",
	},
	{
		id: "apprunnertest2-1-0d82e753",
		title: "AppRunner Test 2 — Django on AWS App Runner integration harness — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Minimal Django 3.11 app deployed on AWS App Runner with RDS, S3/CloudFront, and Secrets Manager — gated by startup integration tests. |
| Audience | kodexArg operators and backend engineers validating AWS App Runner for Django; future maintainers extending ALVS infrastructure patterns; agents needing context on the App Runner + Django stack choice. |`,
		related: [],
		tags: ["apprunnertest2","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "apprunnertest2",
	},
	{
		id: "apprunnertest2-2-f7f11c90",
		title: "AppRunner Test 2 — Django on AWS App Runner integration harness — P1 — Django on App Runner without container orchestration",
		text: `### P1 — Django on App Runner without container orchestration

- **Who hurts:** Engineers evaluating AWS App Runner as a simpler alternative to ECS/Fargate/Docker for small Django services.
- **Pain today:** Most Django-on-AWS guides assume Docker images or Elastic Beanstalk. App Runner's **source-based Python runtime** is under-documented for Django-specific concerns: WSGI binding, for App Runner domains, proxy SSL headers, and build-time dependency installation.
- **How this repo answers:** Ships with Python 3.11 runtime, for fast venv creation during build, port bound via env, and as the run command. configures , for App Runner/AWS host patterns, and Gunicorn as the production WSGI server.
- **Out of scope:** Does not compare App Runner vs ECS cost/scale. No multi-service mesh, no blue/green deploy automation, no GitHub Actions CI in this repo.`,
		related: [],
		tags: ["apprunnertest2","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "apprunnertest2",
	},
	{
		id: "apprunnertest2-3-7cff83be",
		title: "AppRunner Test 2 — Django on AWS App Runner integration harness — P2 — End-to-end AWS service integration proof for Django",
		text: `### P2 — End-to-end AWS service integration proof for Django

- **Who hurts:** Teams wiring Django to RDS, S3, and Secrets Manager who need a **working reference** before copying patterns into larger apps.
- **Pain today:** Configuration errors in , database DSNs, or secret injection often surface only at runtime in production. Scattered tutorials rarely combine all three with App Runner's secret-reference syntax.
- **How this repo answers:** declares plain env vars for non-secret config (DB host/port/name, S3 bucket, region, CloudFront custom domain) and blocks referencing Secrets Manager ARNs for , DB credentials, Django superuser fields, and a secret (connectivity smoke). reads all values from environment, configures S3 backends for default and staticfiles, and routes Loguru logs to both stdout and an S3 log prefix. performs live S3 list, DB , and S3 save/read/delete for static storage.
- **Out of scope:** No IAM policy definitions in-repo (assumed provisioned externally). No Terraform/CDK. No local S3 emulation (listed as TODO in README).`,
		related: [],
		tags: ["apprunnertest2","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "apprunnertest2",
	},
	{
		id: "apprunnertest2-4-b3ae1f76",
		title: "AppRunner Test 2 — Django on AWS App Runner integration harness — P3 — Fail-fast deployment gate via ordered startup tests",
		text: `### P3 — Fail-fast deployment gate via ordered startup tests

- **Who hurts:** Operators who want App Runner instances to **never serve traffic** if AWS integrations are broken.
- **Pain today:** Default App Runner behavior starts the process immediately; application-level health checks may pass while DB or S3 is misconfigured.
- **How this repo answers:** runs a strict pipeline before : drop stale test DB, + , , conditional , then four ordered test phases ( , , , , ) — any failure exits non-zero and aborts deployment.
- **Out of scope:** Does not run tests in a separate CI stage; tests execute on every cold start/redeploy. No canary or staged rollout.`,
		related: [],
		tags: ["apprunnertest2","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "apprunnertest2",
	},
	{
		id: "apprunnertest2-5-41c942d2",
		title: "AppRunner Test 2 — Django on AWS App Runner integration harness — 3. Product / idea",
		text: `## 3. Product / idea

The repository is a **single Django project** ( ) with one domain app ( ) and a shared template layer under . Mental model: The home page ( ) is a minimal testing shell linking to the DB health check. There is no user-facing product beyond proving infrastructure works.`,
		related: [],
		tags: ["apprunnertest2","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "apprunnertest2",
	},
	{
		id: "aws-lambda-flask-entry-point-0-bff203d7",
		title: "AWS Lambda Flask Entry Point — serverless Telegram echo bot starter — AWS Lambda Flask Entry Point",
		text: `## AWS Lambda Flask Entry Point

> **Problem thesis (required):** Running a Telegram bot traditionally means hosting a Flask or similar web server that stays online to receive webhook POSTs. AWS Lambda offers a pay-per-invocation alternative, but packaging Python dependencies and wiring API Gateway webhooks is non-obvious. This repository is a **minimal starter** that demonstrates the Lambda handler shape, a Telegram echo-bot webhook processor, and the vendor-and-zip deployment recipe — even though Flask itself is listed in and vendored under but not yet integrated into the handler code.`,
		related: [],
		tags: ["aws-lambda-flask-entry-point","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "aws-lambda-flask-entry-point",
	},
	{
		id: "aws-lambda-flask-entry-point-1-8a78eb55",
		title: "AWS Lambda Flask Entry Point — serverless Telegram echo bot starter — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Flask/Telegram Bot using AWS Lambda — a shallow entry-point template with vendored deps and a working Telegram echo-bot handler. |
| Audience | kodexArg developers experimenting with serverless Telegram bots; operators deploying a webhook Lambda behind API Gateway. |`,
		related: [],
		tags: ["aws-lambda-flask-entry-point","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "aws-lambda-flask-entry-point",
	},
	{
		id: "aws-lambda-flask-entry-point-2-2b669286",
		title: "AWS Lambda Flask Entry Point — serverless Telegram echo bot starter — P1 — Serverless Telegram bot hosting without a persistent server",
		text: `### P1 — Serverless Telegram bot hosting without a persistent server

- **Who hurts:** Developers who want a Telegram bot but do not want to run and pay for an always-on VM, container, or PaaS dyno.
- **Pain today:** Telegram webhooks require an HTTPS endpoint that accepts POST requests with update JSON. Self-hosting means provisioning TLS, process management, and uptime monitoring. Lambda + API Gateway offloads infrastructure to AWS's event-driven model.
- **How this repo answers:** implements that parses the API Gateway body as a Telegram update, extracts and , responds to with a greeting, and echoes any other text back via the Telegram API. Returns HTTP 200 to acknowledge the webhook.
- **Out of scope:** Does not configure API Gateway, set the Telegram webhook URL, manage IAM roles, or handle Telegram secret-token validation. No conversation state, inline keyboards, or media handling.`,
		related: [],
		tags: ["aws-lambda-flask-entry-point","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "aws-lambda-flask-entry-point",
	},
	{
		id: "aws-lambda-flask-entry-point-3-acf6729e",
		title: "AWS Lambda Flask Entry Point — serverless Telegram echo bot starter — P2 — Python dependency packaging for AWS Lambda",
		text: `### P2 — Python dependency packaging for AWS Lambda

- **Who hurts:** Python developers deploying to Lambda who hit import errors because Lambda's runtime lacks pip-installed packages.
- **Pain today:** Lambda requires dependencies to be bundled inside the deployment artifact (or provided via a Lambda layer). The on a dev machine does not automatically produce a Lambda-compatible tree.
- **How this repo answers:** README documents the vendor workflow: , then . The repo already contains a populated directory (Flask, Werkzeug, Jinja2, Click, MarkupSafe, itsdangerous) and a artifact demonstrating the output shape.
- **Out of scope:** No Lambda layers, no container-image packaging, no automated CI build pipeline. (used by ) is not listed in — a gap that would cause runtime import failure unless added manually.`,
		related: [],
		tags: ["aws-lambda-flask-entry-point","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "aws-lambda-flask-entry-point",
	},
	{
		id: "aws-lambda-flask-entry-point-4-8fe1f58c",
		title: "AWS Lambda Flask Entry Point — serverless Telegram echo bot starter — P3 — Minimal Lambda handler scaffold for iteration",
		text: `### P3 — Minimal Lambda handler scaffold for iteration

- **Who hurts:** Developers starting a new Lambda project who need a known-good handler signature before adding business logic.
- **Pain today:** AWS console "Hello World" templates are language-specific but disconnected from real webhook or HTTP frameworks.
- **How this repo answers:** provides the simplest possible handler returning . shows the next step: event parsing, external API call, structured return. Together they form a progression from stub to functional bot.
- **Out of scope:** Flask application factory, WSGI-to-Lambda adapter (e.g. , ), routing, middleware, or template rendering — despite Flask being a declared dependency.`,
		related: [],
		tags: ["aws-lambda-flask-entry-point","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "aws-lambda-flask-entry-point",
	},
	{
		id: "aws-lambda-flask-entry-point-5-e7eedce7",
		title: "AWS Lambda Flask Entry Point — serverless Telegram echo bot starter — 3. Product / idea",
		text: `## 3. Product / idea

The repository is a **two-file Lambda starter** plus a pre-built vendor tree: The mental model: API Gateway terminates TLS and forwards the raw Telegram update JSON as the Lambda event body. The handler is stateless — each invocation is independent. The echo bot simply mirrors user text back to the same chat. Flask appears in and is vendored under , suggesting the original intent was to wrap a Flask app behind a WSGI adapter for Lambda. That integration was never completed; the active bot logic bypasses Flask entirely and uses directly.`,
		related: [],
		tags: ["aws-lambda-flask-entry-point","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "aws-lambda-flask-entry-point",
	},
	{
		id: "comfyui-0-d295e094",
		title: "ComfyUI — modular node-graph Stable Diffusion GUI, API, and inference backend — ComfyUI",
		text: `## ComfyUI

> **Problem thesis (required):** ComfyUI exists so anyone working with Stable Diffusion can design, run, and automate complex diffusion pipelines through a visual node graph that mirrors how SD actually works — loading checkpoints, conditioning, sampling, VAE decode, post-processing — while a built-in async server exposes the same execution engine to scripts and external clients. It prioritizes modularity, partial re-execution of only changed subgraphs, broad model-format support, and offline operation over a simplified one-click consumer UI.`,
		related: [],
		tags: ["comfyui","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ComfyUI",
	},
	{
		id: "comfyui-1-f44a7706",
		title: "ComfyUI — modular node-graph Stable Diffusion GUI, API, and inference backend — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | The most powerful and modular stable diffusion GUI, API and backend with a graph/nodes interface. |
| Audience | ML practitioners, SD hobbyists, pipeline engineers, and integrators who want fine-grained control over diffusion workflows; operators running local GPU or CPU inference servers; authors of custom node extensions. |
The copy tracks the upstream ComfyUI codebase (GPL-3.0, README and still reference the original author). GitHub metadata shows it is not registered as a fork ( ) but content and structure match the canonical ComfyUI application. Last remote activity on the org mirror was August 2024.`,
		related: [],
		tags: ["comfyui","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ComfyUI",
	},
	{
		id: "comfyui-2-59ca022d",
		title: "ComfyUI — modular node-graph Stable Diffusion GUI, API, and inference backend — P1 — Composing advanced SD workflows without writing code",
		text: `### P1 — Composing advanced SD workflows without writing code

- **Who hurts:** Artists and researchers who need hires-fix passes, regional prompting, inpainting, ControlNet stacks, LoRA stacking, or model merges — workflows that exceed a single txt2img form.
- **Pain today:** Tab-based UIs encode fixed pipelines; escaping those patterns means maintaining private Python glue or fragile UI macros. Each new technique (SDXL, SVD, LCM, GLIGEN) adds another screen instead of composable primitives.
- **How this repo answers:** Every operation is a **node** with typed inputs/outputs ( , , , , etc.). Users wire nodes in a LiteGraph canvas ( ). Built-in nodes live in ; extended techniques ship in ; third parties add . Workflows serialize to JSON; PNG outputs embed workflow metadata for round-tripping. The README documents shortcuts for queueing, bypassing, and muting nodes.
- **Out of scope:** Training new base models, cloud-hosted inference SaaS, or a simplified “one button” consumer app experience.`,
		related: [],
		tags: ["comfyui","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ComfyUI",
	},
	{
		id: "comfyui-3-d4eada67",
		title: "ComfyUI — modular node-graph Stable Diffusion GUI, API, and inference backend — P2 — Transparent, efficient execution of diffusion graphs",
		text: `### P2 — Transparent, efficient execution of diffusion graphs

- **Who hurts:** Power users iterating on the last steps of a large graph (e.g. change only the KSampler seed or final upscale) on hardware where full pipeline re-runs are costly.
- **Pain today:** Naive executors rerun the entire DAG every time, wasting GPU time reloading encoders and re-encoding prompts.
- **How this repo answers:** implements with validation, topological execution, and **change detection** — only nodes whose inputs changed (or that depend on changed upstream nodes) re-execute. README §Notes states explicitly that unchanged duplicate submissions skip work. handles VRAM tiers ( , , , ), model unload, and interrupt handling. runs a background thread consuming an async .
- **Out of scope:** Distributed multi-GPU orchestration across machines; automatic hyperparameter search.`,
		related: [],
		tags: ["comfyui","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ComfyUI",
	},
	{
		id: "comfyui-4-eb54e26a",
		title: "ComfyUI — modular node-graph Stable Diffusion GUI, API, and inference backend — P3 — Headless API and automation over the same graphs",
		text: `### P3 — Headless API and automation over the same graphs

- **Who hurts:** Developers building batch generators, CI image regression tests, Colab/Jupyter notebooks, or external frontends that must queue the same workflows the GUI uses.
- **Pain today:** GUI-only tools force screen-scraping or duplicate inference code paths; API layers often lag behind UI features.
- **How this repo answers:** ( ) serves REST endpoints and a WebSocket channel on port 8188 by default. Clients POST JSON prompts to , poll , stream progress on , and fetch images via . and demonstrate queue + completion patterns. introspects all registered node classes for dynamic client builders.
- **Out of scope:** Built-in authentication, rate limiting, or multi-tenant cloud deployment — the server binds to loopback by default and assumes a trusted local operator.`,
		related: [],
		tags: ["comfyui","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ComfyUI",
	},
	{
		id: "comfyui-5-b667c2fe",
		title: "ComfyUI — modular node-graph Stable Diffusion GUI, API, and inference backend — P4 — Running SD on constrained or diverse hardware",
		text: `### P4 — Running SD on constrained or diverse hardware

- **Who hurts:** Users with &lt;3 GB VRAM GPUs, CPU-only hosts, AMD ROCm Linux boxes, Apple Silicon, Intel Arc, or Windows DirectML paths.
- **Pain today:** Single-code-path UIs assume 8+ GB NVIDIA CUDA and fail obscurely elsewhere.
- **How this repo answers:** exposes a large matrix of device and precision flags ( , , fp8 UNET modes, attention backends, , etc.). README documents per-vendor install commands and env overrides ( ). auto-enables on small cards; forces CPU inference.
- **Out of scope:** Guaranteed performance parity across vendors; automatic driver installation.`,
		related: [],
		tags: ["comfyui","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ComfyUI",
	},
	{
		id: "commce-0-8ddf49bf",
		title: "ComMCE — internal Django portal for MCE communications, slot stats, and environmental monitoring — ComMCE",
		text: `## ComMCE

> **Problem thesis (required):** (Comunicación MCE) is a private, Spanish-facing **internal operations portal** for an MCE slot-floor environment. It unifies three concerns in one Django monolith served over classic server-rendered HTML: **staff communications** (short internal posts), **slot-machine statistics** (read-only views over legacy MySQL tables and ), and **environmental monitoring** (temperature/humidity time series from Raspberry Pi sensors in on a second MySQL database). Authentication is Django session login; navigation links the three modules from shared Bootstrap nav bars. The codebase dates to 2019, targets Python 3.6 and Django 2.2, and includes a committed tree — it is operational legacy software, not a modern deployable template.`,
		related: [],
		tags: ["commce","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ComMCE",
	},
	{
		id: "commce-1-6818119e",
		title: "ComMCE — internal Django portal for MCE communications, slot stats, and environmental monitoring — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Django 2 internal portal: internal messaging, slot-machine fleet table, and RPi temperature charts over dual MySQL backends. |
| Audience | MCE floor supervisors, slot technicians, and back-office staff who need comms, machine stats, and environmental reads; maintainers reviving or replacing the legacy stack. |`,
		related: [],
		tags: ["commce","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ComMCE",
	},
	{
		id: "commce-2-ea7386e4",
		title: "ComMCE — internal Django portal for MCE communications, slot stats, and environmental monitoring — P1 — Fragmented internal communications on the slot floor",
		text: `### P1 — Fragmented internal communications on the slot floor

- **Who hurts:** MCE supervisors and technicians coordinating daily changes (machine moves, maintenance windows, policy notes) across shifts.
- **Pain today:** Updates spread through informal channels with no persistent, searchable record tied to authenticated staff accounts.
- **How this repo answers:** The app provides a minimal **blog-style post list** ( model: title up to 35 chars, text body, author FK to , ). Authenticated users can create posts via ; all users can browse and . Posts are registered in Django admin. Navigation is shared with the other modules via top-level nav buttons.
- **Out of scope:** Threaded discussions, attachments, push notifications, email digests, or role-based visibility per post.`,
		related: [],
		tags: ["commce","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ComMCE",
	},
	{
		id: "commce-3-937b4e1b",
		title: "ComMCE — internal Django portal for MCE communications, slot stats, and environmental monitoring — P2 — Slot machine configuration and win telemetry locked in l",
		text: `### P2 — Slot machine configuration and win telemetry locked in legacy MySQL

- **Who hurts:** Fleet managers and analysts who need to see which machines sit in which sala, their hold/devol percentages, denominations, and aggregated wins without writing SQL.
- **Pain today:** Machine master data lives in and time-series coin-in/coin-out/win metrics in inside a MySQL database named (configured as Django database). These tables pre-exist; Django models are mirrors.
- **How this repo answers:** exposes **Listado de Máquinas** — a paginated table ( ) over showing id, position, sala, juego, fabricante, modelo, denomination, hold, devol, tipo with percentage formatting for hold/devol. **Beneficios** queries for the last ~40 days, aggregates grouped by , serializes to JSON in the view — though the template currently renders a **hardcoded Google Charts demo** instead of the live JSON payload (integration incomplete).
- **Out of scope:** Real-time slot telemetry ingestion, EGM protocol integration, regulatory reporting export, or write paths to machine configuration.`,
		related: [],
		tags: ["commce","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ComMCE",
	},
	{
		id: "commce-4-be573d56",
		title: "ComMCE — internal Django portal for MCE communications, slot stats, and environmental monitoring — P3 — Environmental monitoring without a dedicated SCADA UI",
		text: `### P3 — Environmental monitoring without a dedicated SCADA UI

- **Who hurts:** Operators monitoring server-room or floor-adjacent Raspberry Pi nodes that log temperature and humidity.
- **Pain today:** Sensor rows accumulate in on a separate MySQL database ( , routed via ). Raw SQL or spreadsheets are the fallback.
- **How this repo answers:** reads (columns: , , , ) and builds pandas DataFrames via . **24hs** view aggregates average temperature per RPi per hour for the prior day; **semana** plots raw points over a ~2-day window. Templates render **Chart.js** line charts with per-RPi datasets and show the latest reading timestamp. Humidity is stored but not charted in current views.
- **Out of scope:** Alerting thresholds, SMS/email alarms, sensor provisioning, or ingestion code (assumed external to this repo).`,
		related: [],
		tags: ["commce","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ComMCE",
	},
	{
		id: "commce-5-6ddcb9d5",
		title: "ComMCE — internal Django portal for MCE communications, slot stats, and environmental monitoring — 3. Product / idea",
		text: `## 3. Product / idea

is a **small multi-app Django project** with one settings module ( ), root URLconf ( ), and three domain apps mounted at path prefixes. There is no REST API layer; every feature is HTML templates plus minimal view logic. Mental model for users: 1. **Home** ( ) — landing page showing login state; link to temperatura module (primary entry after auth). 2. **Comunicaciones** ( ) — internal message board. 3. **Estadisticas** ( ) — machine inventory table and benefits chart scaffold. 4. **Temperatura** ( ) — environmental charts (default route = 24h view). 5. **Admin** ( ) — Django admin for and standard auth models. 6. **Accounts** ( ) — stock Django auth URLs (login, logout). Each module duplicates a similar Bootstrap 3 nav bar linking all three modules plus auth controls. Spanish UI strings ( language code). Time zone is UTC with . Data topology: **two MySQL databases** on localhost (configurable host in settings). Default DB holds slot data and Django-managed tables (auth, sessions, ). Secondary holds temperature readings; only reads route there via .`,
		related: [],
		tags: ["commce","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ComMCE",
	},
	{
		id: "cotton-0-d57b147f",
		title: "Cotton — Cotton-West PRD, regulatory docs, and MkDocs knowledge base — Cotton (Cotton-West)",
		text: `## Cotton (Cotton-West)

> **Problem thesis (required):** The repository is the **private documentation and product-specification vault** for **Cotton-West** — a planned SaaS web application for Argentine medicinal cannabis cultivation clubs. The repo does **not** yet contain the Django application itself; it holds the authoritative PRD, technical annexes, regulatory research, legislation transcriptions, risk analysis, and a published MkDocs Material static site. The product it specifies solves the club operator's core pain: operating legally under REPROCANN, Ley 27.350, Resolución 1780/2025, Ley 25.326, and Mendoza Ley 9617 by unifying POS dispensations, public e-commerce for non-regulated goods, member self-service, and immutable cultivation-to-dispensation traceability in one auditable system.`,
		related: [],
		tags: ["cotton","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "cotton",
	},
	{
		id: "cotton-1-c7c8267a",
		title: "Cotton — Cotton-West PRD, regulatory docs, and MkDocs knowledge base — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Private MkDocs-backed specification hub for Cotton-West — an integrated club-management SaaS covering POS, member portal, public store, REPROCANN compliance, and full product traceability for Argentina (Mendoza focus). |
| Audience | Internal kodexArg engineers and agents implementing Cotton-West; club administrators and operators (future end users); compliance officers; auditors and health inspectors (future report consumers). |
**Naming note:** README and still reference a public sibling name and a GitHub Pages destination under the kodexArg org. The swarm assignment targets the **private** repo slug . Treat as the canonical private spec vault; the public docs mirror may live under a differently named repository.`,
		related: [],
		tags: ["cotton","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "cotton",
	},
	{
		id: "cotton-2-d199a904",
		title: "Cotton — Cotton-West PRD, regulatory docs, and MkDocs knowledge base — P1 — Regulatory non-compliance and traceability gaps at cannabis clubs",
		text: `### P1 — Regulatory non-compliance and traceability gaps at cannabis clubs

- **Who hurts:** Club directors, POS operators, and compliance officers at REPROCANN-registered cultivation clubs in Argentina (especially Mendoza under Ley 9617 double-registration rules).
- **Pain today:** Manual processes lose batch-to-member traceability; expired REPROCANN certificates go undetected at the counter; semiannual Ministry reports are assembled ad hoc; exceeding authorized plant counts or dispensing without valid documentation exposes clubs to fines (50–500 JUS under Mendoza) or license revocation.
- **How this repo answers:** The PRD and annexes define a system that validates REPROCANN at point of dispensación, enforces monthly quotas, records immutable lot movements from harvest through delivery, generates regulatory reports, and maintains cartas de porte documentation. This repository captures those requirements in , , , and supporting legislation files under .
- **Out of scope:** The repo does not run dispensations or connect to government APIs today — it specifies behavior for a future application. External shipping logistics and club infrastructure are explicitly excluded from Cotton-West scope per PRD §9.`,
		related: [],
		tags: ["cotton","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "cotton",
	},
	{
		id: "cotton-3-84e6a749",
		title: "Cotton — Cotton-West PRD, regulatory docs, and MkDocs knowledge base — P2 — Operational confusion between regulated and non-regulated commerce",
		text: `### P2 — Operational confusion between regulated and non-regulated commerce

- **Who hurts:** Front-desk operators who must sell CBD/parafernalia to the general public while separately dispensing medicinal cannabis only to authorized members with valid certifications.
- **Pain today:** A single manual workflow mixes retail sales and therapeutic handoffs, causing inventory errors, financial reconciliation gaps, and accidental dispensations to unqualified persons.
- **How this repo answers:** The PRD defines three differentiated surfaces — Terminal POS (sales vs dispensaciones), Tienda Pública (unauthenticated catalog for non-regulated products), and Portal de Socios (authenticated self-service for members) — with 50+ enumerated use cases in §6 and detailed domain separation in ( , , , ).
- **Out of scope:** Payment processor internals (Mercado Pago is an integration boundary, not owned code); third-party delivery carriers.`,
		related: [],
		tags: ["cotton","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "cotton",
	},
	{
		id: "cotton-4-29de39fb",
		title: "Cotton — Cotton-West PRD, regulatory docs, and MkDocs knowledge base — P3 — Sensitive health data exposure and member rights under Ley 25.326",
		text: `### P3 — Sensitive health data exposure and member rights under Ley 25.326

- **Who hurts:** Club members (patients) whose DNI, address, medical indication, and REPROCANN documents must be protected; club staff who access medical records.
- **Pain today:** Paper files and unstructured spreadsheets lack encryption, access logging, and self-service rectification/suppression workflows required by Argentina's personal data protection law.
- **How this repo answers:** The data model annex specifies field-level encryption for DNI and addresses ( entity), audit logging, member portal rights (UC-PS-04 rectification), and document storage requirements. Research report maps mandatory vs important fields per REPROCANN and Resolución 1780/2025.
- **Out of scope:** Legal advice; the repo documents compliance intent, not certified legal opinions.`,
		related: [],
		tags: ["cotton","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "cotton",
	},
	{
		id: "cotton-5-ea94af56",
		title: "Cotton — Cotton-West PRD, regulatory docs, and MkDocs knowledge base — P4 — Fragmented specification before implementation (meta-problem this repo directly solv",
		text: `### P4 — Fragmented specification before implementation (meta-problem this repo directly solves)

- **Who hurts:** Developers, AI agents, and project stakeholders who need one SSOT for requirements, stack decisions, and regulatory context.
- **Pain today:** Without a consolidated vault, implementation would start from scattered notes, risking drift from Mendoza-specific rules and inconsistent data model assumptions.
- **How this repo answers:** MkDocs Material site with navigable PRD, five annexes, three research informes, and ten legislation markdown files — buildable via and deployable per Cloudflare Pages config.
- **Out of scope:** CI/CD for the future Django app (described in annex IV but not present in tree); application source code.`,
		related: [],
		tags: ["cotton","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "cotton",
	},
	{
		id: "cotton-aws-ai-0-feb7d181",
		title: "cotton-aws-ai — AWS-native agentic AI (Phase 0 planning) — cotton-aws-ai",
		text: `## cotton-aws-ai

> **Problem thesis (required):** exists to design and eventually implement an **AWS-native agentic AI layer** — tool-using LLM agents with memory, observability, and production guardrails — without committing prematurely to a single LLM vendor. Today the repository is **Phase 0 (under construction)**: no application code, manifests, or infrastructure; only agent instructions, a phased roadmap, and scoped AWS skills. The concrete pain is organizational and architectural: kodexArg needs a deliberate place to evaluate Bedrock vs direct Anthropic/OpenAI APIs, define IAM and orchestration patterns, and build toward streaming agent APIs on Lambda — separate from Cloudflare-centric or general-purpose agent stacks elsewhere in the org.`,
		related: [],
		tags: ["cotton-aws-ai","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "cotton-aws-ai",
	},
	{
		id: "cotton-aws-ai-1-ceee9f4e",
		title: "cotton-aws-ai — AWS-native agentic AI (Phase 0 planning) — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Greenfield AWS agentic AI project — LLM provider and orchestration pattern under evaluation, with a phased plan from foundation through production hardening. |
| Audience | Internal kodexArg engineers and coding agents working on AWS-native LLM/agent integration; not a published library or end-user product yet. |`,
		related: [],
		tags: ["cotton-aws-ai","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "cotton-aws-ai",
	},
	{
		id: "cotton-aws-ai-2-10bd7ea0",
		title: "cotton-aws-ai — AWS-native agentic AI (Phase 0 planning) — P1 — No AWS-native agentic reference architecture in the org",
		text: `### P1 — No AWS-native agentic reference architecture in the org

- **Who hurts:** Engineers and agents tasked with building LLM-powered automation on AWS who lack a kodexArg-owned blueprint for tool-use loops, data connections, and deploy targets.
- **Pain today:** Other repos in the org skew toward Cloudflare Workers, Obsidian vaults, or general kdx-* skills. Starting an AWS agent project ad hoc risks inconsistent IAM, secret handling, and observability choices.
- **How this repo answers:** defines a four-phase roadmap (Foundation → Core Agent Loop → Agentic Features → Production Hardening) with explicit checklists: IAM baseline, minimal agent loop, AWS data source wiring, tool registry, vector memory, streaming via API Gateway + Lambda, cost guardrails, and CI/CD. Conventions lock language (Python 3.13+ primary), IaC (CDK Python), and secrets (AWS Secrets Manager only).
- **Out of scope:** Does not replace or document existing Cloudflare or non-AWS agent stacks; agents are instructed not to load non-AWS skills unless explicitly told.`,
		related: [],
		tags: ["cotton-aws-ai","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "cotton-aws-ai",
	},
	{
		id: "cotton-aws-ai-3-750ab699",
		title: "cotton-aws-ai — AWS-native agentic AI (Phase 0 planning) — P2 — Open LLM provider decision blocking implementation",
		text: `### P2 — Open LLM provider decision blocking implementation

- **Who hurts:** Architects and implementers who need a single recorded decision before writing invocation code, billing estimates, or compliance reviews.
- **Pain today:** Bedrock (native IAM, no egress), Anthropic direct API (latest models, simpler SDK), OpenAI (broad ecosystem), and self-hosted Ollama/vLLM each have trade-offs; no ADR has been written yet.
- **How this repo answers:** § LLM Provider Evaluation maintains a comparison table with status per provider. Phase 0 explicitly includes “Select LLM provider / runtime”; the intended artifact is (directory not yet populated).
- **Out of scope:** Not a multi-cloud abstraction layer; OpenAI is marked “not preferred — proprietary focus”; self-hosted is low priority.`,
		related: [],
		tags: ["cotton-aws-ai","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "cotton-aws-ai",
	},
	{
		id: "cotton-aws-ai-4-f5e5f269",
		title: "cotton-aws-ai — AWS-native agentic AI (Phase 0 planning) — P3 — Agent skill pollution across project boundaries",
		text: `### P3 — Agent skill pollution across project boundaries

- **Who hurts:** Coding agents that default to loading many skills and may apply Cloudflare or vault tooling to an AWS build.
- **Pain today:** Without path-scoped skill configuration, agents might invoke wrong IaC patterns, wrong deployment targets, or wrong observability stacks.
- **How this repo answers:** and restrict active skills to the community set (Bedrock agents, data lake, CDK, IAM, serverless, observability, SDK usage, etc.). explicitly forbids loading Cloudflare, Obsidian, kdx-*, or other non-AWS skills unless instructed for a specific task.
- **Out of scope:** Does not vendor or mirror the skill files inside the repo; skills are referenced from a host path ( ).`,
		related: [],
		tags: ["cotton-aws-ai","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "cotton-aws-ai",
	},
	{
		id: "cotton-aws-ai-5-1880cc52",
		title: "cotton-aws-ai — AWS-native agentic AI (Phase 0 planning) — 3. Product / idea",
		text: `## 3. Product / idea

The **central idea** is an AWS-hosted agent platform: LLM-driven agents that call tools, retain memory (eventually vector-backed), connect to AWS data planes (S3, DynamoDB, RDS), and expose responses through API Gateway with structured logging and X-Ray-style observability. The mental model is **phased delivery** — first close architectural decisions (scope, LLM anchor, IAM, single- vs multi-agent orchestration), then ship a minimal loop with tests, then add dynamic tools and streaming, then harden for security, cost, and load. At present the “product” is **documentation and agent harness only**: cloning yields planning docs, not a runnable service.`,
		related: [],
		tags: ["cotton-aws-ai","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "cotton-aws-ai",
	},
	{
		id: "cotton-coveris-0-8f037460",
		title: "cotton-coveris — reserved empty namespace for Coveris (cotton family) — cotton-coveris",
		text: `## cotton-coveris

> **Problem thesis (required):** is a **private, empty GitHub repository** in the kodexArg family. It contains **no commits, no tracked files, no manifests, and no agent scaffolding** as of the swarm scan. The repository appears to function as a **reserved namespace** or **uninitialized placeholder** for Coveris — the healthcare capacity-planning SaaS for Argentine private clinics — while active implementation and documentation live in sibling repositories ( , , ). The concrete pain it addresses today is **organizational**: securing the slug and keeping a private slot available for a future canonical repo, fork target, or migration destination without exposing partial work.`,
		related: [],
		tags: ["cotton-coveris","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "cotton-coveris",
	},
	{
		id: "cotton-coveris-1-51efea22",
		title: "cotton-coveris — reserved empty namespace for Coveris (cotton family) — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | (declared by GitHub API; no commits exist, so the branch is not materialized in a clone) |
| One-line pitch | Empty private placeholder in the cotton naming family, reserved for the Coveris product line — not yet populated with code, docs, or infrastructure. |
| Audience | Internal kodexArg operators and agents maintaining the org repo inventory; future Coveris engineers if/when this repository is initialized. |`,
		related: [],
		tags: ["cotton-coveris","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "cotton-coveris",
	},
	{
		id: "cotton-coveris-2-2aad5d04",
		title: "cotton-coveris — reserved empty namespace for Coveris (cotton family) — P1 — Reserved namespace before code lands",
		text: `### P1 — Reserved namespace before code lands

- **Who hurts:** Org maintainers and agents that enumerate kodexArg repositories and need predictable naming ( ) without ad-hoc renames later.
- **Pain today:** Coveris work is spread across multiple repositories with different prefixes ( for the production-oriented app, for the MVP stack, for ADR study). An empty slot may have been created to hold the canonical cotton-prefixed name before deciding which repo becomes long-term SSOT.
- **How this repo answers:** By existing as a **zero-byte private repository** created on 2026-07-04, it prevents external parties from claiming the name and gives kodexArg a clean target for future , template seeding, or repo promotion workflows.
- **Out of scope:** Does not host application code, CI, documentation, or agent harnesses today. Does not replace or for any operational workflow.`,
		related: [],
		tags: ["cotton-coveris","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "cotton-coveris",
	},
	{
		id: "cotton-coveris-3-5781b67c",
		title: "cotton-coveris — reserved empty namespace for Coveris (cotton family) — P2 — Separation of naming families (cotton vs bare product name)",
		text: `### P2 — Separation of naming families (cotton vs bare product name)

- **Who hurts:** Developers and RAG agents trying to map "which repo is Coveris?" across , , and .
- **Pain today:** The org uses both bare product names ( ) and prefixed names for related workstreams. Without an explicit inventory entry for , agents may assume the name implies an active codebase and waste cycles cloning an empty tree.
- **How this repo answers:** This summary records the **empty state explicitly** so downstream RAG and swarm agents treat as a placeholder, not a missing clone failure. Operators should prefer (active full product) or (MVP stack) for implementation context.
- **Out of scope:** Does not document the Coveris domain model, API, or deployment — those belong to populated sibling repositories.`,
		related: [],
		tags: ["cotton-coveris","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "cotton-coveris",
	},
	{
		id: "cotton-coveris-4-24da3a77",
		title: "cotton-coveris — reserved empty namespace for Coveris (cotton family) — 3. Product / idea",
		text: `## 3. Product / idea

There is **no product artifact** inside itself. The **idea** the name signals — inferred from sibling repositories and org naming, not from files in this clone — is **Coveris**: a healthcare capacity-planning SaaS that measures the real-time gap between operational demand (positions on an organizational tree) and available supply (employees with contracts, certifications, leave, and hour balances) for private clinics. The mental model for **this specific repository** is not an application architecture but a **GitHub inventory slot**: Until initialization, cloning yields only metadata and GitHub's "empty repository" warning. No README, no , no , no , no .`,
		related: [],
		tags: ["cotton-coveris","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "cotton-coveris",
	},
	{
		id: "cotton-coveris-5-cecab4d1",
		title: "cotton-coveris — reserved empty namespace for Coveris (cotton family) — 3.1 North-star use cases (hypothetical — not evidenced in tree)",
		text: `### 3.1 North-star use cases

(hypothetical — not evidenced in tree)
1. **Promote or mirror:** Operator initializes the repo by pushing content from or when the cotton-prefixed name becomes canonical.
2. **Client handoff boundary:** Reserved private repo for Coveris-specific deliverables under the cotton client namespace, distinct from the broader parent repo.
3. **Agent inventory:** RAG swarm includes this file so queries about resolve to "placeholder" instead of hallucinating a tech stack.`,
		related: [],
		tags: ["cotton-coveris","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "cotton-coveris",
	},
	{
		id: "cotton-coveris-mvp-0-d165f473",
		title: "Coveris — Healthcare Capacity Planning SaaS — Coveris",
		text: `## Coveris

> **Problem thesis (required):** Coveris exists because mid-size private clinics (roughly 20–100 employees, multiple services) still run capacity planning on spreadsheets, phone calls, and stale folders. The clinic has the data—contracts, shift regimes, certifications, leave—but it is fragmented. There is no live measure of the gap between **demand** (positions and weekly hours each org unit needs) and **supply** (employees with an effective hours pool after tags and reductions). Coveris is a SaaS that puts a configurable organigram at the center, models employees and positions with explicit business rules in Django, and gives managers a real-time UI for assignments, coverage, hours, scheduling, and extensions into productivity, pre-liquidation, labor cost, and talent review.`,
		related: [],
		tags: ["cotton-coveris-mvp","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "cotton-coveris-mvp",
	},
	{
		id: "cotton-coveris-mvp-1-e23b0216",
		title: "Coveris — Healthcare Capacity Planning SaaS — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Healthcare capacity-planning SaaS that measures live demand-vs-supply across a clinic organigram and supports assignment, coverage, hours, scheduling, and payroll-adjacent workflows. |
| Audience | Clinic HR managers (“Jefe” / MANAGER), operational staff (“Agente” / EMPLOYEE), auditors (AUDITOR), platform admins (ADMIN, internal), developers and AI agents maintaining the stack. |`,
		related: [],
		tags: ["cotton-coveris-mvp","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "cotton-coveris-mvp",
	},
	{
		id: "cotton-coveris-mvp-2-3f94a204",
		title: "Coveris — Healthcare Capacity Planning SaaS — P1 — Fragmented staffing truth",
		text: `### P1 — Fragmented staffing truth

- **Who hurts:** HR managers, service heads, and clinic operators responsible for shift coverage.
- **Pain today:** Answering “who can cover this guard?” requires multiple spreadsheets, certification folders, and ad-hoc calls. Data is edited without notification; answers are hours old before they are acted on.
- **How this repo answers:** A PostgreSQL-backed domain model with org units, positions (demand), employees (supply), tag-based hour pools, and assignment FSMs. Django computes business rules; Angular renders organigram, roster, structure, coverage, and hours views fed by a documented REST contract ( ). Coverage rolls up from leaf units to clinic root.
- **Out of scope:** Full payroll execution, union contract negotiation engines, or institution-specific legal advice baked into code (rules are configurable via tags and ADRs, not hard-coded convenio logic).`,
		related: [],
		tags: ["cotton-coveris-mvp","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "cotton-coveris-mvp",
	},
	{
		id: "cotton-coveris-mvp-3-818f1e9d",
		title: "Coveris — Healthcare Capacity Planning SaaS — P2 — No preview before committing assignments",
		text: `### P2 — No preview before committing assignments

- **Who hurts:** Managers assigning staff to positions and employees accepting or rejecting proposals.
- **Pain today:** Assignments are made without a unified preview of hours impact, eligibility (required tags), or resulting coverage state; mistakes create overtime or uncovered positions discovered later.
- **How this repo answers:** Assignment lifecycle with preview endpoints, eligibility validation against position tag requirements (ADR-019), hours ledger as stateless computation (ADR-011), and employee FSM with proposal/accept/reject flows. UI routes under , , , , and control-panel demand surfaces.
- **Out of scope:** Employee push notifications for proposals (listed out-of-scope in PRD); automated shift bidding marketplaces.`,
		related: [],
		tags: ["cotton-coveris-mvp","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "cotton-coveris-mvp",
	},
	{
		id: "cotton-coveris-mvp-4-2961c2fd",
		title: "Coveris — Healthcare Capacity Planning SaaS — P3 — Demo, staging, and agent-safe development without production data",
		text: `### P3 — Demo, staging, and agent-safe development without production data

- **Who hurts:** Developers, contributors, and AI agents implementing features against realistic clinic scenarios.
- **Pain today:** Empty databases block UI work; copying production data risks privacy violations; inconsistent seeds break contract tests.
- **How this repo answers:** YAML scenarios (clinic-bienestar, hospital-notti, clinica-francesa) hot-loaded via dev-gated API and Panel de Control UI; showcase route uses isolated mocks per ADR-022. Avatars sync from scenario folders to frontend assets without external image URLs.
- **Out of scope:** Production tenant onboarding automation; multi-tenant SaaS billing (pricing page exists as product surface, not full billing backend in MVP scope).`,
		related: [],
		tags: ["cotton-coveris-mvp","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "cotton-coveris-mvp",
	},
	{
		id: "cotton-coveris-mvp-5-a90c48cc",
		title: "Coveris — Healthcare Capacity Planning SaaS — 3. Product / idea",
		text: `## 3. Product / idea

Coveris treats the **organigram** as the system nucleus: without org units there is no “where” for employees, positions, coverage, or hours. Institutions configure tree depth and labels; positions can exist at any level (not only leaves). **Demand** is expressed as positions with weekly hour requirements and optional tag requirements. **Supply** is employees with a six-state FSM lifecycle, typed tags (contract, qualification, certification, exception) that sum to an effective weekly hours pool, and assignments linking employee hours to positions. **Coverage** aggregates upward; **hours balance** ( ) is the central metric—positive means available capacity, negative means overtime. Beyond the MVP core, the codebase implements **Capa 1** (productivity import, pre-liquidation, fractal labor cost, billing catalog) and **Capa 2** (talent review / 9-box desempeño), monthly scheduling, economía hub routes, and productivity audit FSM—documented in , , and extensive ADRs. Auth uses httpOnly cookie JWT locally (SimpleJWT) with a production path to Cognito JWT validation (ADR-008). Roles collapsed to ADMIN, MANAGER, AUDITOR, EMPLOYEE with orthogonal org-unit scope ( , ADR-030). Frontend is CSR-only Angular on Amplify; API on ECS Fargate behind ALB; RDS PostgreSQL.`,
		related: [],
		tags: ["cotton-coveris-mvp","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "cotton-coveris-mvp",
	},
	{
		id: "cotton-coveris-mvp-main-document-0-dc4326a9",
		title: "Coveris MVP — interactive ADR study and architecture documentation — Coveris MVP — interactive ADR study and architecture documentation",
		text: `## Coveris MVP — interactive ADR study and architecture documentation

> **Problem thesis (required):** This repository is a **read-only architecture documentation vault** spun out of the main Coveris MVP codebase ( ). It exists because the team is integrating features from the Coveris-e branch without linearly migrating its ADRs. The pain is decision paralysis: ten incoming ADRs (E-025 through E-034) touch org structure, weekly design boards, hours semantics, monthly scheduling, rotation, and holidays — and several **directly conflict** with accepted ADRs on the target branch (ADR-018, ADR-024, ADR-001-c, ADR-011, ADR-017). This repo delivers an interactive ADR map, three deep-dive research findings, and a priority-ranked theme analysis so architects can derive **their own** rules rather than copy Coveris-e wholesale.`,
		related: [],
		tags: ["cotton-coveris-mvp-main-documentation","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "cotton-coveris-mvp-main-documentation",
	},
	{
		id: "cotton-coveris-mvp-main-document-1-eab6e91f",
		title: "Coveris MVP — interactive ADR study and architecture documentation — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Interactive, mobile-friendly ADR study site plus markdown research reports for reconciling Coveris-e architecture decisions with the agnostic OrgUnit vision of cotton-coveris-mvp-main. |
| Audience | Coveris architects, backend/frontend engineers evaluating the Coveris-e integration, product owners deciding org-model and scheduling semantics, and AI agents tasked with writing new project-specific ADRs. |`,
		related: [],
		tags: ["cotton-coveris-mvp-main-documentation","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "cotton-coveris-mvp-main-documentation",
	},
	{
		id: "cotton-coveris-mvp-main-document-2-4b7cb60d",
		title: "Coveris MVP — interactive ADR study and architecture documentation — P1 — Incoming ADRs collide with accepted project ADRs",
		text: `### P1 — Incoming ADRs collide with accepted project ADRs

- **Who hurts:** Engineers on (target) merging code from Coveris-e ( , source branch) without a conflict map.
- **Pain today:** Coveris-e shipped ten accepted ADRs (E-025–E-034, skipping E-033) that reshape OrgUnit taxonomy, assignment hour semantics, weekly design boards, and monthly scheduling. The target branch already has 37 ADRs including ADR-011 (weekly-only hours), ADR-018 (Positions only on UNIT leaves), ADR-024 ( bar semantics), and ADR-001-c (five-color hour vocabulary). Adopting Coveris-e code without reconciling these produces incompatible models on the same API surface — e.g., (3-value enum, 3-band bar) vs (boolean, blue-only extras).
- **How this repo answers:** catalogs all 37 "here" ADRs and 9 "incoming" ADRs with side badges, status, verdicts ( , , , , ), conflict flags, searchable sidebar, filter chips (side/status/verdict/conflict), and three view tabs (ADRs, Themes by priority, Conflicts table). expands the eight priority themes with reconciliation tables mapping each conflict to a required decision. Full ADR texts for key incoming and conflicting "here" ADRs are embedded inline in the HTML for offline reading.
- **Out of scope:** Implementing any of the studied changes, maintaining live sync with the main repo's tree, or replacing the main project's ADR workflow. This is study material, not the SSOT`,
		related: [],
		tags: ["cotton-coveris-mvp-main-documentation","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "cotton-coveris-mvp-main-documentation",
	},
	{
		id: "cotton-coveris-mvp-main-document-3-7410517f",
		title: "Coveris MVP — interactive ADR study and architecture documentation — P2 — Coveris-e org model is hospital-specific; target vision is domain-agnostic",
		text: `### P2 — Coveris-e org model is hospital-specific; target vision is domain-agnostic

- **Who hurts:** Architects defining OrgUnit rules for a product meant to serve clinics, retail chains, or government hierarchies equally.
- **Pain today:** Coveris-e ADR E-027 replaced a configurable org-level catalog (E-026, superseded) with a **fixed five-level Spanish hospital taxonomy** ( ), plus a OneToOne hack ( for zero-hour managers, hard-delete on clear). The target project's north star is **OrgUnit agnostic** — generic depth levels with editable labels, English code identifiers (ADR-001-b), and no "clinic" baked into the schema.
- **How this repo answers:** Theme 1 in both and is explicitly titled around the agnostic opportunity: take E-027's good ideas (depth derived from parent, manager as unit attribute not sibling node) while rejecting the fixed hospital enum. is a dedicated finding that evaluates four options and recommends **rejecting** Coveris-e's model — a manager is not demand to cover, and forcing it into created all the hacks. The interactive banner in states the governing decision: OrgUnit agnostic, manager is role/attribute not Position, weekly hours arithmetic is sacred (ADR-011).
- **Out of scope:** Final ADR text for the agnostic OrgUnit model (that belongs in the main repo once decided). Legal reconciliation of Argentine LCT four-level framing (ADR-021) with open`,
		related: [],
		tags: ["cotton-coveris-mvp-main-documentation","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "cotton-coveris-mvp-main-documentation",
	},
	{
		id: "cotton-coveris-mvp-main-document-4-fc9cc596",
		title: "Coveris MVP — interactive ADR study and architecture documentation — P3 — Weekly vs monthly backend boundary is easy to violate during integration",
		text: `### P3 — Weekly vs monthly backend boundary is easy to violate during integration

- **Who hurts:** Backend engineers porting Coveris-e's app and field extensions without breaking ADR-011.
- **Pain today:** Monthly scheduling (E-029) adds snapshots and date divergences — architecturally sound as read-time projection over weekly assignments. But Coveris-e also introduced , reintroducing the exact "4 weeks per month" scaling artifact ADR-011 explicitly eliminated. This creates **two competing weekly-hour definitions**: the ledger uses ; coverage and capacity use the month-averaged field — they diverge for recurrent assignments.
- **How this repo answers:** is a full research report with a persistence-vs-projection table, the protected invariant ("weekly is the only hours arithmetic"), documented Coveris-e violations, and five design recommendations including "do NOT port ." Theme 4 in the interactive map marks E-029 as with the modification called out. ADR-011 is flagged as an invariant ( ) in the ADR catalog.
- **Out of scope:** Implementing app tables, payroll export source selection, or timesheet ( ) dimension — all deferred with open questions listed in the finding.`,
		related: [],
		tags: ["cotton-coveris-mvp-main-documentation","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "cotton-coveris-mvp-main-documentation",
	},
	{
		id: "cotton-coveris-mvp-main-document-5-79f3ac7f",
		title: "Coveris MVP — interactive ADR study and architecture documentation — 3. Product / idea",
		text: `## 3. Product / idea

The repository is **not an application** — it is a **documentation product** consisting of one self-contained static web page and three companion markdown research reports. The mental model is a **decision-support atlas** for a larger integration effort: 1. **Browse** the ADR landscape (what exists on the target branch vs what Coveris-e proposes). 2. **Filter** by conflict, verdict, or topic to find blockers. 3. **Read** priority-ranked themes (8 topics from OrgUnit agnosticism through StaffingPlanLine). 4. **Drill into** full ADR text for the highest-risk items without cloning the main repo. 5. **Consult** standalone findings for the two most contentious design questions (manager modeling, weekly/monthly boundary). The interactive page ( , ~104 KB) is a zero-dependency single-file SPA: dark-theme CSS, responsive sidebar with mobile drawer, client-side Markdown renderer ( function), expandable ADR cards, accordion for full texts, and JavaScript data structures ( , , , ) holding all catalog metadata. It references ADR files in the main repo by relative path ( ) for entries without embedded full text — those links assume co-deployment context but the page is self-sufficient for the 15+ ADRs with inline blocks. The three files are the **authoritative long-form analysis**; the HTML is the navigable index built from that analysis plus metadata from the main`,
		related: [],
		tags: ["cotton-coveris-mvp-main-documentation","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "cotton-coveris-mvp-main-documentation",
	},
	{
		id: "cotton-dj-template-0-b190a2ba",
		title: "Cotton Django Template — opinionated Django 5 starter for component-driven HTMX apps on AWS — Cotton Django Template",
		text: `## Cotton Django Template

> **Problem thesis (required):** Personal and internal Django projects repeatedly reinvent the same foundations — auth, component UI, Tailwind styling, HTMX interactivity, logging, Docker, and AWS ECS deployment. This private repository is an **opinionated Django 5 template specification** that solves that repetition by documenting and (when complete) shipping a single curated stack: django-cotton components with Tailwind 4 only, HTMX for server-driven UI with zero client-side JavaScript, django-allauth auth, uv-only package management, centralized architecture, and an AWS-native deployment path (Docker → ECR → ECS Fargate). It is currently **under construction** — the clone contains extensive planning docs, Spec Kit scaffolding, and Claude agent commands, but **no runnable Django application code yet**.`,
		related: [],
		tags: ["cotton-dj-template","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "cotton-dj-template",
	},
	{
		id: "cotton-dj-template-1-8213799d",
		title: "Cotton Django Template — opinionated Django 5 starter for component-driven HTMX apps on AWS — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Opinionated Django 5 template for component-first, HTMX-driven, Tailwind-styled web apps with AWS ECS deployment and Spec Kit–guided AI development. |
| Audience | kodexArg maintainers building personal or internal Django apps; AI coding agents (Claude Code, Cursor) extending the template via Spec Kit slash commands; future template consumers who clone and customize. |`,
		related: [],
		tags: ["cotton-dj-template","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "cotton-dj-template",
	},
	{
		id: "cotton-dj-template-2-67e6c721",
		title: "Cotton Django Template — opinionated Django 5 starter for component-driven HTMX apps on AWS — P1 — Decision fatigue and inconsistent Django project bootstrappin",
		text: `### P1 — Decision fatigue and inconsistent Django project bootstrapping

- **Who hurts:** Solo developers and small teams starting new Django projects who must repeatedly choose UI libraries, auth packages, logging, env config, and deployment targets.
- **Pain today:** Each new repo picks different stacks (React vs HTMX, pip vs poetry, scattered vs centralized templates), leading to incompatible conventions, slow onboarding, and no reusable component library.
- **How this repo answers:** Documents and will ship a **single curated stack** with pinned dependency versions in , a 19-phase implementation plan in , and a non-negotiable that locks architectural choices (uv-only, Tailwind 4 exclusive, zero JS, two breakpoints, centralized templates).
- **Out of scope:** General-purpose flexibility; multi-tenant SaaS; API-first backends; real-time WebSockets; CMS features.`,
		related: [],
		tags: ["cotton-dj-template","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "cotton-dj-template",
	},
	{
		id: "cotton-dj-template-3-0cfd7cfc",
		title: "Cotton Django Template — opinionated Django 5 starter for component-driven HTMX apps on AWS — P2 — Fragmented Django template organization blocking reusable UI",
		text: `### P2 — Fragmented Django template organization blocking reusable UI

- **Who hurts:** Developers maintaining django-cotton or Django template components spread across directories.
- **Pain today:** Django's default convention scatters HTML across apps, making refactors painful and component discovery difficult. Inconsistent margin/spacing rules break layouts when components are reused.
- **How this repo answers:** Mandates **centralized templates** under with pointing there; all django-cotton components live in with dot-notation tags ( ). The **zero exterior margins rule** (constitution constraint #1) ensures container-agnostic components — parents control positioning via and grid/flex, never on component roots.
- **Out of scope:** Per-app template directories; CSS frameworks other than Tailwind 4; client-side component frameworks (React, Vue, Alpine).`,
		related: [],
		tags: ["cotton-dj-template","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "cotton-dj-template",
	},
	{
		id: "cotton-dj-template-4-8b5606bc",
		title: "Cotton Django Template — opinionated Django 5 starter for component-driven HTMX apps on AWS — P3 — Server-rendered interactivity without JavaScript frameworks",
		text: `### P3 — Server-rendered interactivity without JavaScript frameworks

- **Who hurts:** Teams wanting modern UX (partial page updates, modals, infinite scroll) without maintaining a separate frontend build pipeline or SPA.
- **Pain today:** HTMX + Tailwind + Django integration patterns are documented ad hoc; teams fall back to React or write custom JS, violating simplicity goals.
- **How this repo answers:** **Zero JavaScript policy** — HTML5 semantic elements ( , ), modern CSS ( , container queries), and HTMX served from with django-htmx middleware ( ). Documented HTMX patterns in and : form submissions, modals, lazy loading, OOB swaps. Tailwind compiled via django-tailwind-cli with **no Node.js**.
- **Out of scope:** WebSockets, Django Channels, async views, SPA architectures, npm/package.json frontend builds.`,
		related: [],
		tags: ["cotton-dj-template","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "cotton-dj-template",
	},
	{
		id: "cotton-dj-template-5-fd51ce11",
		title: "Cotton Django Template — opinionated Django 5 starter for component-driven HTMX apps on AWS — P4 — Production-ready AWS deployment path from day one",
		text: `### P4 — Production-ready AWS deployment path from day one

- **Who hurts:** Developers who prototype locally then struggle to containerize and deploy to AWS with health checks, secrets management, and observability.
- **Pain today:** Templates ship without Docker, ECS task definitions, RDS/Redis wiring, or CloudWatch logging — production becomes a separate project.
- **How this repo answers:** Documents a **Development → Docker → ECR → ECS Fargate** pipeline in with multi-stage Dockerfile, non-root container user, endpoint via django-health-check, AWS Secrets Manager injection, RDS PostgreSQL, ElastiCache Redis, S3 media/static, SES email via django-anymail, and CloudWatch via watchtower + Loguru structured JSON logging.
- **Out of scope:** Kubernetes, Terraform/CDK IaC (listed as future enhancement), EC2-based deployment, Heroku/Vercel targets.`,
		related: [],
		tags: ["cotton-dj-template","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "cotton-dj-template",
	},
	{
		id: "cotton-west-0-a37108b5",
		title: "Cotton-West — cannabis club operations SaaS (spec & docs vault) — Cotton-West",
		text: `## Cotton-West

> **Problem thesis (required):** Cotton-West addresses the operational and legal fragility of **Clubes de Cultivo de Cannabis Medicinal** in Argentina — organizations that must simultaneously sell non-regulated goods (CBD, parafernalia), dispense regulated medicinal cannabis only to REPROCANN-certified members, maintain immutable traceability from cultivation to patient, and satisfy Ley 25.326 data-protection obligations. Without integrated digital tooling, clubs face regulatory sanctions (including Mendoza Ley 9617 fines of 50–500 JUS), REPROCANN license revocation, inventory errors, and exposure of sensitive health data. **This repository** is the **specification and documentation vault** for that future SaaS product: a MkDocs Material site hosting the PRD, technical annexes, risk matrix, data model, legislation library, and sector research — status **Aprobado para Desarrollo** (approved for development), version 2.0, with an estimated 8–10 week implementation roadmap. The runnable Django application described in the PRD is **not yet present** in this tree; is a stub and dependencies are documentation-only.`,
		related: [],
		tags: ["cotton-west","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "cotton-west",
	},
	{
		id: "cotton-west-1-e7c06ad9",
		title: "Cotton-West — cannabis club operations SaaS (spec & docs vault) — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Private documentation monorepo for a planned SaaS platform that will let Argentine cannabis clubs run POS dispensations, a public CBD store, a REPROCANN member portal, and compliance traceability under national and Mendoza law. |
| Audience | Internal product/engineering team building Cotton-West; club operators and administrators (future end users); compliance auditors; AI agents consuming PRD and legal context for implementation. |`,
		related: [],
		tags: ["cotton-west","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "cotton-west",
	},
	{
		id: "cotton-west-2-c6c4428e",
		title: "Cotton-West — cannabis club operations SaaS (spec & docs vault) — P1 — Regulatory non-compliance and traceability failure at cannabis clubs",
		text: `### P1 — Regulatory non-compliance and traceability failure at cannabis clubs

- **Who hurts:** Club administrators, operators at the counter, REPROCANN-authorized members (socios), and provincial/national health inspectors.
- **Pain today:** Clubs must prove batch-level traceability from cultivation through processing, storage, transport, and final dispensación to a named socio. Manual spreadsheets and paper logs break under Resolución 1780/2025 and Mendoza Ley 9617 requirements. Dispensing to members with expired REPROCANN certificates, exceeding monthly gram quotas, or missing cartas de porte creates immediate legal exposure. Semestral reports to the Ministerio de Salud are error-prone when assembled manually.
- **How this repo answers:** The PRD ( ) and annexes define four functional surfaces — POS terminal, public store, member portal, and traceability/compliance module — with explicit use cases (UC-POS-*, UC-PS-*, UC-TP-*, UC-TC-*, UC-GA-*) and acceptance criteria per launch milestone. The data model annex ( ) specifies entities ( , , , , , ) with encryption, immutability, and audit patterns. Legislation pages under ground each requirement in primary legal text.
- **Out of scope:** This repo does not execute dispensations, validate live REPROCANN APIs, or host production data. External shipping logistics and government API integrations are explicitly deferred (PRD §9).`,
		related: [],
		tags: ["cotton-west","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "cotton-west",
	},
	{
		id: "cotton-west-3-4b7a03b2",
		title: "Cotton-West — cannabis club operations SaaS (spec & docs vault) — P2 — Splitting regulated vs non-regulated commerce in one club operation",
		text: `### P2 — Splitting regulated vs non-regulated commerce in one club operation

- **Who hurts:** POS operators who must sell parafernalia and CBD to the general public while separately dispensing medicinal cannabis only to verified socios; finance staff reconciling mixed cash/card flows.
- **Pain today:** A single physical counter handles two legally distinct transaction types — commercial **ventas** (non-regulated) and therapeutic **dispensaciones** (regulated). Mixing them in one undifferentiated ledger complicates inventory, receipt types, and audit defense. Member discounts on non-regulated goods add pricing rules layered on top of quota enforcement for regulated goods.
- **How this repo answers:** PRD §5.1–5.3 and annex IV ( ) prescribe domain-separated Django apps ( , , , ) with shared core models but distinct presentation layers. Transaction model distinguishes types; links 1:1 to regulated transactions. Use cases cover mixed payment (UC-POS-06), REPROCANN expiry rejection (UC-POS-03), and societal discounts (UC-POS-08).
- **Out of scope:** Multi-club multi-tenancy is post-launch evolution (ANEXO-V §6); MVP targets a single club instance.`,
		related: [],
		tags: ["cotton-west","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "cotton-west",
	},
	{
		id: "cotton-west-4-0d5b9741",
		title: "Cotton-West — cannabis club operations SaaS (spec & docs vault) — P3 — Fragmented specification before code exists",
		text: `### P3 — Fragmented specification before code exists

- **Who hurts:** Developers, spec-driven AI agents, and project stakeholders who need one SSOT before sprinting.
- **Pain today:** Legal research, risk analysis, stack decisions, and entity diagrams historically live in separate documents. Starting implementation without aligned specs risks rework when Mendoza provincial rules or Resolución 1780/2025 constraints surface late.
- **How this repo answers:** MkDocs Material site ( ) publishes navigable docs with Spanish UI, search, git revision dates, and minification. README and provide entry paths for product, technical, compliance, and research audiences. Annex V ( ) locks stack choices (Django monolith, PostgreSQL, Tailwind, HTMX, Mercado Pago, AWS). Risk matrix R001–R016 in maps threats to mitigations. Informes capture sector research ( ).
- **Out of scope:** CI/CD pipelines, Docker compose files, and Django project scaffolding are specified in annex IV but not committed in this documentation-phase repository.`,
		related: [],
		tags: ["cotton-west","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "cotton-west",
	},
	{
		id: "cotton-west-5-6b080b80",
		title: "Cotton-West — cannabis club operations SaaS (spec & docs vault) — 3. Product / idea",
		text: `## 3. Product / idea

Cotton-West (code name; final branding chosen by the club) is conceived as a **browser-only SaaS web application** — no local install — integrating three user-facing surfaces plus a compliance backbone: **Current repository state:** The tree is a **documentation product**, not the application. Source lives in ; built static HTML is pre-generated in (MkDocs output). configures Cloudflare Pages to build via and publish . The planned application architecture is monolithic Django with modular apps, server-side components (django-cotton), HTMX interactivity, and dual logging (immutable files + database queries) for ANMAT-grade auditability.`,
		related: [],
		tags: ["cotton-west","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "cotton-west",
	},
	{
		id: "coveris-0-273b6ec5",
		title: "Coveris — healthcare capacity planning for Argentine private clinics — Coveris",
		text: `## Coveris

> **Problem thesis (required):** Coveris is a proprietary healthcare **capacity-planning SaaS** for private clinics in Argentina. It closes the real-time gap between **operational demand** (positions declared on a configurable organizational tree) and **available supply** (employees with contracts, certifications, leave, and hour balances). Clinic staff today answer coverage questions by juggling multiple spreadsheets and phone calls; Coveris gives them one system that measures vacancy, partial coverage, full coverage, and surplus hours, supports assignment workflows with eligibility preview, and extends into productivity import, pre-liquidation, labor cost, and performance review modules. The product UI is Spanish-facing; the codebase is English throughout.`,
		related: [],
		tags: ["coveris","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "coveris",
	},
	{
		id: "coveris-1-53634beb",
		title: "Coveris — healthcare capacity planning for Argentine private clinics — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Real-time staffing gap measurement and assignment tooling for mid-size private clinics, built on a demand/offer domain model over a hierarchical org chart. |
| Audience | Clinic HR managers, service chiefs, auditors, and employees (role-scoped); internal developers and AI agents maintaining the stack; operators deploying to Cloudflare. |`,
		related: [],
		tags: ["coveris","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "coveris",
	},
	{
		id: "coveris-2-96abf20e",
		title: "Coveris — healthcare capacity planning for Argentine private clinics — P1 — Fragmented staffing data blocks real-time coverage decisions",
		text: `### P1 — Fragmented staffing data blocks real-time coverage decisions

- **Who hurts:** HR managers and service chiefs at private clinics (roughly 20–100 employees, 3–15 services) responsible for filling uncovered shifts.
- **Pain today:** Answering “who can cover this shift, with the right certifications, without blowing overtime?” requires opening multiple spreadsheets, calling supervisors, and checking paper certification folders. Data goes stale because sheets are edited without coordination. The clinic already has contracts, schedules, reductions, and licenses — but they are not unified.
- **How this repo answers:** Coveris models **OrgUnit** (configurable-depth tree), **Position** (weekly hour demand per unit, optional tag requirements), and **Employee** (FSM lifecycle with tag-based eligibility). **Assignment** links supply to demand with preview of hour impact. **Coverage** and **Hours Ledger** compute obligated vs assigned balances in real time, rolling up the org tree. Managers operate through Angular feature routes ( , , , , etc.) backed by a contract-first REST API ( ).
- **Out of scope:** Full hospital information systems, patient scheduling, payroll execution, and generic HRIS replacement. Notifications to employees and advanced granular permissions are deferred beyond MVP boundaries in the PRD.`,
		related: [],
		tags: ["coveris","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "coveris",
	},
	{
		id: "coveris-3-ba1dc0d1",
		title: "Coveris — healthcare capacity planning for Argentine private clinics — P2 — No single source of truth for demand vs supply",
		text: `### P2 — No single source of truth for demand vs supply

- **Who hurts:** Clinic leadership and operations teams trying to see service-level staffing health at a glance.
- **Pain today:** Demand (how many hours each service needs) and offer (who is actually available after contracts, leave, and reductions) are tracked in different artifacts. Coverage status (vacant, partial, covered, surplus) cannot be computed consistently.
- **How this repo answers:** The backend splits domain apps explicitly: (positions, org units, staffing plans), (hours ledger computations), (assignment FSM + audit), (certifications/contracts as typed tags per ADR-019). Business rules engine ( ) evaluates eligibility at assignment time. Weekly structure and monthly scheduling modules extend demand planning beyond static positions.
- **Out of scope:** Institution-specific collective bargaining rule engines — the system is agnostic; each clinic configures its own structure and tags.`,
		related: [],
		tags: ["coveris","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "coveris",
	},
	{
		id: "coveris-4-42cd1248",
		title: "Coveris — healthcare capacity planning for Argentine private clinics — P3 — Productivity data stuck in spreadsheets",
		text: `### P3 — Productivity data stuck in spreadsheets

- **Who hurts:** Auditors and managers reconciling anesthesia productivity for pre-liquidation and payroll prep.
- **Pain today:** Google Form responses land in Sheets; manual processes are needed to get clean codes and IDs into any downstream system.
- **How this repo answers:** exposes import endpoints (token-authenticated machine import and server-side Google Sheets pull). A documented Apps Script pushes the calculated **Registro** tab hourly via . Local dev runs a sidecar that respects UI-driven sync cadence. Production Cloudflare Worker cron triggers the same sync path. Preliq ( ), cost ( ), and performance ( ) build on this data layer.
- **Out of scope:** Building or hosting the Google Form/Sheet itself; NIVO HSI integration is specified but awaiting external endpoint delivery.`,
		related: [],
		tags: ["coveris","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "coveris",
	},
	{
		id: "coveris-5-4fccba5e",
		title: "Coveris — healthcare capacity planning for Argentine private clinics — 3. Product / idea",
		text: `## 3. Product / idea

Coveris is a full-stack web application: an **Angular 21** single-page client talks to a **Django REST Framework** API over same-origin paths. The mental model is three domains — **demand**, **offer**, and **bridge** (assignments) — centered on the **organigram** (org tree). Without the tree there is no “where” for employees, positions, coverage, or hours. Users authenticate (SimpleJWT cookies locally; Cloudflare Access OIDC in production target), receive role-scoped visibility ( , , , per ADR-044/045) further constrained by (subtree scope per ADR-030). Managers design structure and demand in the Control Panel; operators view roster, coverage dashboards, scheduling grids, and economía cluster screens (productividad, costos, preliq, desempeño). The platform is **mid-migration** from AWS (Amplify + ECS Fargate + RDS + Cognito) to **Cloudflare** (Worker serves static Angular build, proxies and to a Django container, Supabase Postgres as ). and encode this target topology; GitHub Actions builds the SPA and deploys on pushes to .`,
		related: [],
		tags: ["coveris","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "coveris",
	},
	{
		id: "coveris-issue-track-and-fix-0-1b9ac316",
		title: "Coveris Issue Track and Fix — autonomous GitHub issue triage and repair agents — Coveris Issue Track and Fix",
		text: `## Coveris Issue Track and Fix

> **Problem thesis (required):** This private repository hosts a two-stage autonomous agent pipeline for the Coveris product line. A **Tracker** agent investigates live GitHub issues against the cotton-coveris-mvp application workspace, produces structured triage intelligence (difficulty, severity, root-cause addendum), and a deterministic **Router** decides whether to defer, skip, or invoke a **Fixer** agent. The Fixer reads code (read-only locally), applies changes exclusively via GitHub API tools (branch, commit, pull request), and escalates unresolvable issues by commenting and labeling them . The repo also ships an Obsidian documentation vault, Antigravity SDK reference docs, and a library of agent skills for Angular and Django work.`,
		related: [],
		tags: ["coveris-issue-track-and-fix","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "coveris-issue-track-and-fix",
	},
	{
		id: "coveris-issue-track-and-fix-1-0859c6e2",
		title: "Coveris Issue Track and Fix — autonomous GitHub issue triage and repair agents — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Autonomous Antigravity agents that triage Coveris GitHub issues and open fix pull requests with governed tool access. |
| Audience | Internal operators and agent maintainers on Linux; Antigravity SDK agents consuming MCP and filesystem skills; human engineers reviewing deferred or issues. |`,
		related: [],
		tags: ["coveris-issue-track-and-fix","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "coveris-issue-track-and-fix",
	},
	{
		id: "coveris-issue-track-and-fix-2-3465071b",
		title: "Coveris Issue Track and Fix — autonomous GitHub issue triage and repair agents — P1 — Inconsistent, slow GitHub issue triage for Coveris",
		text: `### P1 — Inconsistent, slow GitHub issue triage for Coveris

- **Who hurts:** Coveris maintainers and on-call engineers managing issues in the target application repository ( by default).
- **Pain today:** Each issue requires manual reading of descriptions, cross-referencing product docs in Obsidian, grepping the Angular/Django codebase, and subjective judgment about severity and fix effort before anyone starts coding.
- **How this repo answers:** The Tracker agent ( ) fetches the live issue via , injects an Obsidian vault index from the target repo's tree, connects to Obsidian MCP for contextual knowledge graph navigation, inspects code read-only in the configured workspace, and returns a structured (original issue text, tracker addendum with root cause, , ). The Router ( ) normalizes those fields into a binary effort/severity matrix and either defers high/high combinations or routes to the Fixer.
- **Out of scope:** Fully automated merge or CI gating; issues requiring architectural redesign are deferred or marked for humans.`,
		related: [],
		tags: ["coveris-issue-track-and-fix","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "coveris-issue-track-and-fix",
	},
	{
		id: "coveris-issue-track-and-fix-3-a7130c00",
		title: "Coveris Issue Track and Fix — autonomous GitHub issue triage and repair agents — P2 — High friction from bug report to pull request",
		text: `### P2 — High friction from bug report to pull request

- **Who hurts:** Developers fixing routine frontend/backend bugs in the Coveris MVP stack.
- **Pain today:** Even after triage, engineers must branch, patch, commit, and open PRs manually; agent tooling without GitHub write adapters cannot close the loop.
- **How this repo answers:** The Fixer agent ( ) operates read-only on disk (filesystem write tools disabled) but registers four GitHub REST tools from : , , , and . It follows an SOP embedded in its prompt: create branch, commit via API, open PR, or escalate on failure/timeout (300s cap with automatic labeling).
- **Out of scope:** Local file mutation; direct shell execution ( disabled on Fixer); multi-repo orchestration beyond the configured target.`,
		related: [],
		tags: ["coveris-issue-track-and-fix","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "coveris-issue-track-and-fix",
	},
	{
		id: "coveris-issue-track-and-fix-4-f0d43ce3",
		title: "Coveris Issue Track and Fix — autonomous GitHub issue triage and repair agents — P3 — Missing agent harness, skills, and safety documentation for Coveris workfl",
		text: `### P3 — Missing agent harness, skills, and safety documentation for Coveris workflows

- **Who hurts:** Teams building and operating Antigravity-based agents that must interact with MCP, skills, and policy-gated tools.
- **Pain today:** SDK knowledge, Coveris-specific Angular/Django conventions, and checkpoint discipline are tribal; agents lack a curated skill library and Obsidian-backed operational docs.
- **How this repo answers:** Ships with skills (Angular signals/forms/routing/http/component, milestone gates, , , ) plus Obsidian vault covering architecture, MCP, tools, safety policies, configuration, and data contracts. pins the upstream skill hash. documents skill registration via .
- **Out of scope:** General-purpose skill marketplace; skills are Coveris- and AGY-oriented, not product end-user documentation.`,
		related: [],
		tags: ["coveris-issue-track-and-fix","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "coveris-issue-track-and-fix",
	},
	{
		id: "coveris-issue-track-and-fix-5-b3896cd9",
		title: "Coveris Issue Track and Fix — autonomous GitHub issue triage and repair agents — 3. Product / idea",
		text: `## 3. Product / idea

The repository implements a **sequential multi-agent pipeline** orchestrated by , not a long-running HTTP service. Execution is CLI-driven: (default issue ) or via wrapper. **Mental model:** 1. **Tracker phase** — Gemini-powered agent with YAML prompts ( ), Obsidian MCP (mandatory health-check; aborts if unreachable), one custom tool for GitHub issue fetch, structured JSON output schema ( ), and read-only workspace over the Coveris MVP checkout. 2. **Router phase** — Pure Python decision matrix: effort + severity → defer (no Fixer); all other combinations route to Fixer with or (model stays ). 3. **Fixer phase** — Second agent with augmented prompt identity per effort level, GitHub write tools, disabled local write/run tools, skills loaded from , same Obsidian MCP requirement, 300-second timeout with graceful escalation. Parallel to the live pipeline, defines **strategy-pattern contracts** ( , ) and Pydantic DTOs ( , , , enums , ) intended for OCP-extensible rule engines. README and describe registering new strategies in workflow modules; those workflow/mock_db files are **referenced in docs but absent from the current tree** — the running system has evolved toward full LLM agents rather than deterministic strategy classes. A secondary **local issue queue** ( markdown table + ) supports human/agent task assignment independent of GitHub issue numbers.`,
		related: [],
		tags: ["coveris-issue-track-and-fix","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "coveris-issue-track-and-fix",
	},
	{
		id: "creadorpj-0-4fdd99a6",
		title: "CreadorPJ — random character sheet generator for Subordinación y Valor — CreadorPJ",
		text: `## CreadorPJ

> **Problem thesis (required):** CreadorPJ is a **Flask web application** that randomly generates complete *Subordinación y Valor* (SyV) character sheets — name, age, class, eight core attributes, sampled skills, physical traits, occupational traits (rasgos), inventory with weapon stats, cash, initiative, and defense — and renders them as Bootstrap card layouts with class/sex portrait art. It also hosts a scenario browser fed from and a static campaign map image. The repo exists so GMs and players can produce rule-consistent PNJs (NPCs) in seconds, persist favorites as pickle files, and consult scripted adventure locations during sessions without manual spreadsheet work.`,
		related: [],
		tags: ["creadorpj","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "CreadorPJ",
	},
	{
		id: "creadorpj-1-f21940d4",
		title: "CreadorPJ — random character sheet generator for Subordinación y Valor — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Browser-based random character creator and scenario reference for the SyV tabletop RPG, with save/load via pickle files. |
| Audience | Game masters and players of *Subordinación y Valor* who need NPCs, quick PCs, or on-screen scenario notes during play. |`,
		related: [],
		tags: ["creadorpj","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "CreadorPJ",
	},
	{
		id: "creadorpj-2-efd61c83",
		title: "CreadorPJ — random character sheet generator for Subordinación y Valor — P1 — Slow, error-prone manual character creation at the table",
		text: `### P1 — Slow, error-prone manual character creation at the table

- **Who hurts:** GMs improvising NPCs mid-session and players who want a pre-rolled character without studying the full rule corpus.
- **Pain today:** SyV characters require class-specific attribute distributions (eight stats scaled by a "poder" slider), a subset of skills drawn from class tables with attribute bonuses, gender-inflected physical traits, trait (rasgo) eligibility gated on skill and attribute thresholds, and inventory items probabilistically tied to possessed skills. Doing this with pen and paper or ad-hoc dice takes minutes and invites arithmetic mistakes.
- **How this repo answers:** implements the full pipeline: applies class weight columns from with Gaussian noise and clamps 4–10; samples from per class; and apply gender suffix rules ( / placeholders → / ); rolls items keyed to skill names in ; derives initiative (Percepción or Reflejos + 1o3d10 display) and defense (Destreza or Esquivar + 10). One GET to produces a full sheet and auto-saves as .
- **Out of scope:** Player character advancement, campaign tracking, networked multiplayer, or integration with the separate rules vault. No authentication or multi-user isolation.`,
		related: [],
		tags: ["creadorpj","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "CreadorPJ",
	},
	{
		id: "creadorpj-3-10c63f90",
		title: "CreadorPJ — random character sheet generator for Subordinación y Valor — P2 — Inconsistent application of Spanish name and demographic flavor",
		text: `### P2 — Inconsistent application of Spanish name and demographic flavor

- **Who hurts:** GMs who want culturally grounded Argentine/Spanish names and ages that correlate with the "poder" stat without inventing demographics from scratch.
- **Pain today:** Random name generators ignore census frequency and age curves; SyV's tone benefits from plausible local naming.
- **How this repo answers:** reads , , and , filters names by median age vs. poder, and accepts frequency-weighted sampling (up to = 500 retries). Optional overrides ( , , ) allow partial manual control from the "+opciones" form panel.
- **Out of scope:** Full character biography, H.I.T.O.S. narrative aspects, or faction assignment — only mechanical sheet fields and cosmetic traits.`,
		related: [],
		tags: ["creadorpj","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "CreadorPJ",
	},
	{
		id: "creadorpj-4-8d1eb65d",
		title: "CreadorPJ — random character sheet generator for Subordinación y Valor — P3 — Scenario reference scattered outside the play session",
		text: `### P3 — Scenario reference scattered outside the play session

- **Who hurts:** GMs running published or draft SyV scenarios who need location prose, NPC roster blurbs, and sample dialogue at hand.
- **Pain today:** Lore and scenario text may live in separate design repos or notebooks; switching context mid-session breaks pacing.
- **How this repo answers:** embeds multiple named scenarios (e.g. asylum, hotel, embassy, police/intelligence sites, sewer basements) with structured fields: (paragraph array), (name → description lines), and (name → quote lines). The route and template provide a dropdown browser. is shown via for geographic orientation.
- **Out of scope:** Dynamic state tracking for scenario progression, combat resolution, or the WEGO turn engine documented in .`,
		related: [],
		tags: ["creadorpj","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "CreadorPJ",
	},
	{
		id: "creadorpj-5-15bb394a",
		title: "CreadorPJ — random character sheet generator for Subordinación y Valor — 3. Product / idea",
		text: `## 3. Product / idea

The mental model is **"single Flask app + JSON/CSV data lake + Jinja UI"**. There is no separate API service or database server — persistence is flat pickle files under . The navbar brands the app as *Subordinación y Valor* and exposes three PNJ workflows (Generar, Cargar, Guardar) plus Mapa.`,
		related: [],
		tags: ["creadorpj","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "CreadorPJ",
	},
	{
		id: "design-kodexarg-com-0-a6d467b4",
		title: "design.kodexarg.com — kodexArg design system SSOT — design.kodexarg.com",
		text: `## design.

> **Problem thesis (required):** This repository is kodexArg's design system — the single source of truth for visual tokens, brand components, and a related HTML-report lineage. It solves fragmented branding across multiple sibling web properties by publishing as the canonical palette and typography contract, ships a live dark-first styleguide that demonstrates the aesthetic ("warm black expanse where components float as small lights"), and packages an opinionated mobile-first report system (CSS, HTML templates, mermaid kit, validator) for agents and humans who need polished one-file summaries shareable on phones.`,
		related: [],
		tags: ["design.kodexarg.com","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "design.kodexarg.com",
	},
	{
		id: "design-kodexarg-com-1-18fbed2a",
		title: "design.kodexarg.com — kodexArg design system SSOT — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Dark-first kodexArg design system: token SSOT, live styleguide, Svelte 5 candle components, and a WhatsApp-oriented HTML report lineage on Cloudflare Workers static assets. |
| Audience | kodexArg (owner), coding agents maintaining sibling sites, designers referencing tokens, and the agent skill consuming report templates and mermaid rules. |`,
		related: [],
		tags: ["design.kodexarg.com","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "design.kodexarg.com",
	},
	{
		id: "design-kodexarg-com-2-e4e97c81",
		title: "design.kodexarg.com — kodexArg design system SSOT — P1 — Fragmented branding across sibling properties",
		text: `### P1 — Fragmented branding across sibling properties

- **Who hurts:** An operator running multiple related static sites (home, CV, design, future properties) and agents that copy-paste styles between repos.
- **Pain today:** Each site risks drifting palettes, typography, and component behavior. Orange accent usage becomes inconsistent; the wordmark casing and monospace voice get reimplemented ad hoc.
- **How this repo answers:** is declared the SSOT for every property — warm charcoal inks, rationed orange accent, cream text, mate/pullover document lineage, teal/sage secondary voices, semantic aliases ( , , , etc.), and opt-in light mode via . README states sibling repos import this file directly. The live styleguide on documents every scale with hex chips and narrative notes.
- **Out of scope:** Runtime theme switching infrastructure, npm package publishing, or a full component library for arbitrary apps — only and ship here; other sites vendor copies with bidirectional sync instructions (see sibling \`\` summary).`,
		related: [],
		tags: ["design.kodexarg.com","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "design.kodexarg.com",
	},
	{
		id: "design-kodexarg-com-3-fd9db4cc",
		title: "design.kodexarg.com — kodexArg design system SSOT — P2 — No live reference for agents and humans",
		text: `### P2 — No live reference for agents and humans

- **Who hurts:** Developers and coding agents who need to see components in context before copying or syncing them.
- **Pain today:** Token files alone do not show motion, hover warmth, reduced-motion behavior, or constellation layout patterns. Agents hallucinate drift-prone CSS.
- **How this repo answers:** A fully static Astro site renders brand, components, color scales, and type specimens. demonstrates the prompt mark (monospace voice, block cursor blink, warm hairline underline, exact casing). demonstrates drifting links that "warm up like a candle" on hover with orange glow and timing. Islands hydrate only where interactivity matters ( ).
- **Out of scope:** Storybook, Figma sync, automated visual regression, or interactive token editors.`,
		related: [],
		tags: ["design.kodexarg.com","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "design.kodexarg.com",
	},
	{
		id: "design-kodexarg-com-4-36d6df00",
		title: "design.kodexarg.com — kodexArg design system SSOT — P3 — Polished one-file HTML reports for mobile sharing",
		text: `### P3 — Polished one-file HTML reports for mobile sharing

- **Who hurts:** An operator who wants to turn markdown summaries into dark, branded HTML artifacts sent over WhatsApp and opened on phones — without a separate design pass each time.
- **Pain today:** Generic HTML exports look off-brand; mermaid diagrams break on placeholder collisions; CDN-dependent assets fail in offline in-app webviews; light lavender mermaid theme variables render ugly on dark backgrounds.
- **How this repo answers:** The vault distills Presentation Orange into (self-contained , Nunito + DM Mono type, mobile-first 480px column, progressive desktop enhancement). Five complete HTML templates ( , , , , ) serve as copy-paste specimens. defines the canonical block and classDef component kit ( , , , , ). documents Lucide inline SVG conventions for offline WhatsApp webviews. provides Tier-1 static lint (brace collision, bad state ids) and Tier-2 parse when available. preserves the original Presentation Orange spec without re-fetching auth-walled sources.
- **Out of scope:** A markdown-to-HTML generator CLI in this repo (generation is expected via the skill elsewhere), email MIME packaging, or server-side report hosting.`,
		related: [],
		tags: ["design.kodexarg.com","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "design.kodexarg.com",
	},
	{
		id: "design-kodexarg-com-5-588a4b26",
		title: "design.kodexarg.com — kodexArg design system SSOT — 3. Product / idea",
		text: `## 3. Product / idea

The mental model is **token SSOT + static styleguide + report artifact kit**. After clone and , serves the styleguide locally. prerenders to ; deploy pushes static assets to a Cloudflare Worker named with a custom-domain route (configured in ). No Astro adapter — the site is fully static; Svelte 5 islands hydrate selectively. Two lineages unify in (documented in file header): 1. **CV / document lineage** — mate and pullover scales, Oswald display + Source Sans 3 body, sober document feel, light theme opt-in. 2. **Presentation Orange** — warm charcoal dark canvas, one rationed orange accent, liminal emptiness, components as small lights. The **report lineage** is a deliberate sub-lineage: same ink/cream/orange values but Nunito + DM Mono typography (rounded humanist vs document type), lead orange (relaxing terminal tone) with deeper reserved for glow/halo — documented in .`,
		related: [],
		tags: ["design.kodexarg.com","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "design.kodexarg.com",
	},
	{
		id: "dj-crudo-0-b249cfd4",
		title: "dj-crudo — Django WiFi captive portal and survey CRUD — dj-crudo",
		text: `## dj-crudo

> **Problem thesis (required):** is a private, minimal **Django CRUD application** born from the desire to replace a Google Form with something self-hosted ("because I'm a simple man with simple needs"). In practice it serves two overlapping purposes: a **WiFi captive portal** branded "KM1107 - WiFi Portal" where visitors authenticate via Google OAuth before seeing a connected message, and a **survey intake system** that stores personal data (name, email, phone, birth date, nationality, document, comment) in PostgreSQL. A distinctive — and deliberately dangerous — **host pipe bridge** lets the container send shell commands to the host through a FIFO at , with the stated goal of managing **iptables** on the host from inside Docker. The repo is small, Spanish/Portuguese/English-facing, Docker-first, and carries 2022-era dependencies with hardcoded dev credentials and no CI pipeline.`,
		related: [],
		tags: ["dj-crudo","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "dj-crudo",
	},
	{
		id: "dj-crudo-1-393078af",
		title: "dj-crudo — Django WiFi captive portal and survey CRUD — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Self-hosted Django survey CRUD plus Google OAuth WiFi portal, with an experimental named-pipe bridge for host iptables control. |
| Audience | Internal operators running a WiFi hotspot or visitor intake kiosk; developers maintaining a minimal Django stack in Docker; not intended as a production-hardened SaaS replacement without significant security work. |`,
		related: [],
		tags: ["dj-crudo","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "dj-crudo",
	},
	{
		id: "dj-crudo-2-2bbb6e97",
		title: "dj-crudo — Django WiFi captive portal and survey CRUD — P1 — Google Form dependency for simple visitor intake",
		text: `### P1 — Google Form dependency for simple visitor intake

- **Who hurts:** Operators collecting new-customer or visitor information (personal data, nationality, document number, free-text comment) who do not want to rely on Google Forms or external form builders.
- **Pain today:** Google Forms ties data to a Google account, offers limited branding, and may not fit captive-portal or on-premise network contexts. Export and schema control are indirect.
- **How this repo answers:** A single Django model ( ) captures , , , , , (South American country choices), , , and timestamp. Class-based and under provide list and create flows with Bootstrap-styled templates ( , ). Django admin registers the model for back-office review.
- **Out of scope:** Multi-question dynamic forms, branching logic, file uploads, analytics dashboards, GDPR export tooling, and API-first mobile clients.`,
		related: [],
		tags: ["dj-crudo","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "dj-crudo",
	},
	{
		id: "dj-crudo-3-7206cc3c",
		title: "dj-crudo — Django WiFi captive portal and survey CRUD — P2 — WiFi captive portal with social login",
		text: `### P2 — WiFi captive portal with social login

- **Who hurts:** WiFi hotspot operators who need visitors to authenticate before granting Internet access, with a lightweight branded landing page.
- **Pain today:** Commercial captive-portal appliances are expensive; rolling OAuth from scratch is tedious; trilingual messaging (Spanish, Portuguese, English) is often bolted on late.
- **How this repo answers:** The root route ( ) renders inside a Bootstrap base template titled "KM1107 - WiFi Portal". Authenticated users see welcome/connected messages in three languages; unauthenticated users are prompted to log in. **django-allauth** provides routes with **Google** as the configured social provider. and point to . Email is required for account authentication ( , ). A stub function in hints at future WiFi-grant logic that is not implemented.
- **Out of scope:** RADIUS integration, MAC-address bypass lists, bandwidth shaping, session timeout enforcement, and automated iptables ACCEPT rules wired to successful login (the pipe hook exists but is commented out).`,
		related: [],
		tags: ["dj-crudo","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "dj-crudo",
	},
	{
		id: "dj-crudo-4-a8436c02",
		title: "dj-crudo — Django WiFi captive portal and survey CRUD — P3 — Container-to-host command execution for firewall control",
		text: `### P3 — Container-to-host command execution for firewall control

- **Who hurts:** Developers deploying Django in Docker on a host that also runs the network edge (e.g., a Raspberry Pi or gateway box) who want the app to influence host without SSH sidecars.
- **Pain today:** Containers cannot normally modify host firewall rules. SSH or a privileged sidecar adds operational complexity.
- **How this repo answers:** defines which writes a command string into (bind-mounted from host ). On the host, loops forever executing . Docker Compose mounts on the service. imports and includes a commented example . The README explicitly warns about the security implications ("what can possible go wrong with it").
- **Out of scope:** Command allowlisting, audit logging, privilege separation, seccomp profiles, and any production-grade remote execution framework. This is a proof-of-concept bridge, not a hardened control plane.`,
		related: [],
		tags: ["dj-crudo","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "dj-crudo",
	},
	{
		id: "dj-crudo-5-64606acb",
		title: "dj-crudo — Django WiFi captive portal and survey CRUD — 3. Product / idea",
		text: `## 3. Product / idea

The mental model is a **two-layer Django monolith in Docker**: 1. **Portal layer** — Google OAuth login at and , trilingual connected/disconnected messaging. 2. **Survey layer** — CRUD intake at and , backed by PostgreSQL. 3. **Host bridge layer (optional)** — Named FIFO pipe from container to host for shell command execution, intended for management. The Django project lives under with settings module . The root at repo root is empty (zero bytes); the real entrypoint is . Production-oriented runs **Gunicorn** on port 8000; overrides for dev: runs migrations, seeds a superuser via Django shell, and starts .`,
		related: [],
		tags: ["dj-crudo","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "dj-crudo",
	},
	{
		id: "dj-rpi-monitor-0-1a2f8841",
		title: "dj-rpi-monitor — lightweight Django IoT dashboard for Raspberry Pi temperature and humidity — dj-rpi-monitor",
		text: `## dj-rpi-monitor

> **Problem thesis (required):** dj-rpi-monitor is a **minimal Django monolith** that solves a narrow IoT monitoring need: Raspberry Pi devices POST temperature and humidity readings to a small REST endpoint; data lands in a single table; operators view the **last ten minutes** of readings as a live-updating HTML table (HTMX polling every two seconds) and as server-rendered Plotly line charts on a development dashboard branded for KCBD. It deliberately trades the full sensor suite, TimescaleDB, Docker, and auth hardening of sibling repos for the smallest possible deployable footprint — suitable as a prototype or private lab monitor, not as a production cultivation platform.`,
		related: [],
		tags: ["dj-rpi-monitor","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "dj-rpi-monitor",
	},
	{
		id: "dj-rpi-monitor-1-37b11910",
		title: "dj-rpi-monitor — lightweight Django IoT dashboard for Raspberry Pi temperature and humidity — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Private Django + DRF + HTMX + Plotly prototype that ingests Raspberry Pi temperature/humidity POSTs and shows a live ten-minute dashboard. |
| Audience | Internal KCBD lab operators prototyping sensor visibility; Raspberry Pi edge scripts posting JSON payloads; developers iterating on the monitoring stack before migrating to or . |`,
		related: [],
		tags: ["dj-rpi-monitor","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "dj-rpi-monitor",
	},
	{
		id: "dj-rpi-monitor-2-9b4398fa",
		title: "dj-rpi-monitor — lightweight Django IoT dashboard for Raspberry Pi temperature and humidity — P1 — Minimal central ingest for Raspberry Pi temp/humidity",
		text: `### P1 — Minimal central ingest for Raspberry Pi temp/humidity

- **Who hurts:** Someone standing up a Raspberry Pi with a DHT-style sensor who needs a place to POST readings without provisioning PostgreSQL, TimescaleDB, Docker, or a multi-metric schema.
- **Pain today:** Each device logs locally, or scripts write to ad-hoc files; there is no shared API contract, no timestamped history queryable from a browser, and no single identifier ( ) to distinguish multiple Pis on the same network.
- **How this repo answers:** A single DRF accepts with , , (temperature °C), and (humidity %). Valid rows persist via into the model. on the same endpoint returns recent rows, optionally filtered by time window ( path segment) and by query parameter. Logging uses loguru at DEBUG on successful ingest.
- **Out of scope:** Soil moisture, light, CO₂, VPD derivation, room/sensor registry, authenticated ingestion, rate limiting, or multi-tenant isolation.`,
		related: [],
		tags: ["dj-rpi-monitor","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "dj-rpi-monitor",
	},
	{
		id: "dj-rpi-monitor-3-34d3f0c6",
		title: "dj-rpi-monitor — lightweight Django IoT dashboard for Raspberry Pi temperature and humidity — P2 — Live browser dashboard without a frontend framework",
		text: `### P2 — Live browser dashboard without a frontend framework

- **Who hurts:** An operator who wants to watch recent environmental readings update in near real time without writing JavaScript polling logic or deploying a separate Angular/Astro frontend.
- **Pain today:** Raw API responses require curl or Postman; charting requires exporting CSV or building one-off notebooks; static HTML goes stale immediately.
- **How this repo answers:** The page includes HTMX partials: refreshes table body rows every two seconds via ; renders Plotly Express line charts for temperature and humidity over the same ten-minute window ( constant in ). Skeleton CSS provides layout; vendored HTMX and Plotly avoid CDN dependency at runtime (though base layout still references Google Fonts).
- **Out of scope:** Historical range selectors, downsampling for long timeframes, room grouping, mobile-optimized UX, or production-ready home page (root is an explicit "under development" placeholder linking to ).`,
		related: [],
		tags: ["dj-rpi-monitor","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "dj-rpi-monitor",
	},
	{
		id: "dj-rpi-monitor-4-d73a35e5",
		title: "dj-rpi-monitor — lightweight Django IoT dashboard for Raspberry Pi temperature and humidity — 3. Product / idea",
		text: `## 3. Product / idea

The mental model is a **tight loop**: (1) edge Raspberry Pi scripts JSON to ; (2) Django persists flat rows in SQLite (or an env-configured SQL backend); (3) a single development dashboard page composes server-rendered Plotly HTML plus an HTMX-driven table that polls partial endpoints. There is **no separation** between API and presentation — both live in the Django app. Charts are generated server-side with Plotly Express ( ) and embedded via in templates. The data model is intentionally flat: one table, four payload fields plus auto timestamp, no foreign keys to rooms or sensor catalogs. The project branding ( ) and Spanish locale ( , ) align it with the broader KCBD indoor cultivation monitoring lineage documented in sibling repos (public production monolith) and (private headless refactor). This repo appears to be an **earlier, slimmer experiment** — created mid-November 2024, last touched days later, with no README, CI, or container story.`,
		related: [],
		tags: ["dj-rpi-monitor","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "dj-rpi-monitor",
	},
	{
		id: "dj-rpi-monitor-5-ae35b0f5",
		title: "dj-rpi-monitor — lightweight Django IoT dashboard for Raspberry Pi temperature and humidity — 3.1 North-star use cases",
		text: `### 3.1 North-star use cases

1. **Edge ingest:** A Raspberry Pi POSTs (timestamp optional; defaults to ). Server responds with .
2. **Operator glance:** User opens and sees Plotly temperature/humidity lines plus a table of readings from the last ten minutes, auto-refreshing every two seconds.
3. **Programmatic read:** A script calls to fetch rows from the last 300 seconds, or filters by when the view supports it via kwargs.
4. **Local dev iteration:** Developer runs with supplying , optional , and database overrides — no compose file required.`,
		related: [],
		tags: ["dj-rpi-monitor","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "dj-rpi-monitor",
	},
	{
		id: "dj-west-0-9f4cebf4",
		title: "dj-west — Django inventory and point-of-sale for Argentine retail — dj-west",
		text: `## dj-west

> **Problem thesis (required):** is a private, Spanish-facing **inventory management and point-of-sale (POS)** web application for Argentine retail operations. It replaces fragmented spreadsheet workflows with a single Django monolith: CRUD for products, categories, suppliers, and clients; stock movement auditing; a session-based HTMX POS with favorites and mixed-payment validation; and a dashboard of sales KPIs. The codebase is actively preparing for **ARCA/AFIP electronic invoicing** and **Mercado Pago** reconciliation via fiscal fields on / / , with agent-maintained docs describing the planned integration. Deployment targets **AWS App Runner** with PostgreSQL, Waitress, and WhiteNoise — no separate reverse proxy.`,
		related: [],
		tags: ["dj-west","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "dj-west",
	},
	{
		id: "dj-west-1-16ce2b0b",
		title: "dj-west — Django inventory and point-of-sale for Argentine retail — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Server-rendered Django inventory + POS with Cotton components, HTMX interactivity, and AWS App Runner deployment. |
| Audience | Internal operators and counter staff at a retail location; developers and AI agents maintaining the stack; deployers configuring App Runner and RDS secrets. |`,
		related: [],
		tags: ["dj-west","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "dj-west",
	},
	{
		id: "dj-west-2-48a9e257",
		title: "dj-west — Django inventory and point-of-sale for Argentine retail — P1 — Fragmented inventory and sales tracking",
		text: `### P1 — Fragmented inventory and sales tracking

- **Who hurts:** Small retail operators (owner, stock clerk, counter staff) managing SKU catalogs, supplier relationships, and daily sales without a single system of record.
- **Pain today:** Product costs, sale prices, and on-hand stock live in disconnected spreadsheets or memory. When a sale happens, stock is not decremented automatically; movement history is incomplete; low-stock situations are discovered too late.
- **How this repo answers:** A single Django app models **Categoria**, **Proveedor**, **Cliente**, **Producto**, **Venta**, **ItemVenta**, and **MovimientoStock**. CRUD views cover catalog entities. Completing a sale creates + rows, decrements , and logs a of type . Manual **ENTRADA** and **AJUSTE** movements provide an audit trail. (default 5) drives dashboard and UI alerts via .
- **Out of scope:** Multi-store franchise management, purchase-order workflows, barcode hardware integration, and full accounting/ledger beyond sales totals.`,
		related: [],
		tags: ["dj-west","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "dj-west",
	},
	{
		id: "dj-west-3-0a2ecc66",
		title: "dj-west — Django inventory and point-of-sale for Argentine retail — P2 — Slow, SPA-heavy POS alternatives for counter use",
		text: `### P2 — Slow, SPA-heavy POS alternatives for counter use

- **Who hurts:** Counter staff who need sub-second product lookup, quantity edits, discounts, and checkout on mobile or tablet form factors.
- **Pain today:** Building a React/Vue POS means duplicating validation on client and server, managing cart state, and shipping large JS bundles. Simple form posts feel sluggish without partial updates.
- **How this repo answers:** The sale module ( ) is an **HTMX-first POS**: session-backed cart, real-time product search ( ), inline quantity/discount updates with **out-of-band (OOB)** total refreshes, mixed-payment validation ( ), and to sale detail on success. UI is composed exclusively from **django-cotton** components under (domain components in , primitives in , , ). Favorites ( ) surface quick picks when search is empty. Stock is locked with at checkout to prevent overselling.
- **Out of scope:** Offline-first POS, receipt printer drivers, and native mobile apps. Customer and payment UI sections are documented as partially informational with room for future hardening per .`,
		related: [],
		tags: ["dj-west","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "dj-west",
	},
	{
		id: "dj-west-4-f99a0ab3",
		title: "dj-west — Django inventory and point-of-sale for Argentine retail — P3 — Fiscal and digital-payment readiness for Argentine compliance",
		text: `### P3 — Fiscal and digital-payment readiness for Argentine compliance

- **Who hurts:** Operators who must eventually issue AFIP/ARCA electronic invoices and tie Mercado Pago transactions to sales records without data model rework.
- **Pain today:** Retrofitting CAE, punto de venta, QR data, and MP transaction IDs onto a naive table breaks historical integrity if IVA rates change on products later.
- **How this repo answers:** Migrations through added **IVA alícuotas** on , **frozen ** on , and fiscal/payment fields on ( , , , , ). Agent docs and specify the target integration path, homologation certificates, and BDD validation scenarios. Fields exist; WSFE/MP API wiring is planned, not yet in dependencies.
- **Out of scope:** Completed AFIP WSAA/WSFE integration, PDF ticket generation, and live Mercado Pago webhook handling (documented as future work).`,
		related: [],
		tags: ["dj-west","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "dj-west",
	},
	{
		id: "dj-west-5-dfa05a26",
		title: "dj-west — Django inventory and point-of-sale for Argentine retail — 3. Product / idea",
		text: `## 3. Product / idea

follows a **semimonolithic Django pattern**: one app holds domain models, forms, views, and context processors; holds settings and root URLconf; holds page shells and Cotton component library; holds Tailwind input CSS, compiled output, fonts, and HTMX bundle. The user mental model is **back-office + front counter**: 1. **Dashboard** ( ) — KPI cards: product/category/supplier counts, today's sales and revenue, low-stock count, recent sales, top sellers. 2. **Catalog** — Singular English URL paths ( , , , ) with HTMX partial rendering for in-place navigation via in . 3. **Stock movements** ( ) — Manual entrada/ajuste entries with observaciones. 4. **POS** ( ) — Session cart, HTMX mutations, footer totals bar, finalize with server-side validation. 5. **Admin** ( ) — Standard Django admin for power users. 6. **Dev sandbox** ( ) — Staff-only component playground. Frontend architecture is **component-driven, zero custom JS**: Cotton enforces reusable tags; HTMX handles interactivity; Tailwind 4 ( / design tokens per ) styles everything. Navigation is injected globally via (aside items for Ventas, Productos, Movimientos, Configuraciones dropdown). Production runs as a **single Python process**: Waitress serves WSGI; WhiteNoise serves compressed static files from after . No Nginx sidecar. App Runner build compiles Tailwind and collects statics before run.`,
		related: [],
		tags: ["dj-west","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "dj-west",
	},
	{
		id: "django-captive-portal-oauth-0-799b2453",
		title: "Django Captive Portal OAuth — WiFi guest authentication via social login — Django Captive Portal OAuth",
		text: `## Django Captive Portal OAuth

> **Problem thesis (required):** This repository is a Django web application intended to serve as a **captive portal** for open WiFi: when a guest connects to the network, their HTTP traffic is redirected to this app, where they must authenticate (via Google or Facebook OAuth) before being allowed to browse. The README further describes a **registration gate** — returning users get internet access immediately, while first-time visitors see a page directing them to reception for manual approval — though that workflow is described at the product level and is not fully implemented in the checked-in tree.`,
		related: [],
		tags: ["django-captive-portal-oauth","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "django-captive-portal-oauth",
	},
	{
		id: "django-captive-portal-oauth-1-28997b00",
		title: "Django Captive Portal OAuth — WiFi guest authentication via social login — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Django captive portal that authenticates WiFi guests through Google/Facebook OAuth before granting internet access. |
| Audience | Venue operators deploying guest WiFi (hospitality context suggested by template branding), Django developers integrating UniFi or similar captive-portal hardware, and internal Kodex Arg maintainers. |`,
		related: [],
		tags: ["django-captive-portal-oauth","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "django-captive-portal-oauth",
	},
	{
		id: "django-captive-portal-oauth-2-1ef283cb",
		title: "Django Captive Portal OAuth — WiFi guest authentication via social login — P1 — Guest WiFi needs a login wall before internet access",
		text: `### P1 — Guest WiFi needs a login wall before internet access

- **Who hurts:** Venue operators running open or semi-open WiFi (hotels, cafés, coworking spaces) and the network admins who configure captive-portal hardware.
- **Pain today:** Raw open WiFi either grants unrestricted access (abuse, liability) or requires brittle manual credential distribution. Captive portals solve interception, but building a maintainable login UI with real identity providers is non-trivial.
- **How this repo answers:** Provides a Django project skeleton with wired for social login, a minimal home template that shows login state in three languages (Spanish, Portuguese, English), and URL routes that delegate authentication to allauth's standard account flows. The extended requirements file signals intent to integrate for UniFi controller handshake.
- **Out of scope:** Does not include firewall/radius configuration, DHCP, or hardware-side captive-portal redirect rules — those live outside this app on the access point or controller.`,
		related: [],
		tags: ["django-captive-portal-oauth","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "django-captive-portal-oauth",
	},
	{
		id: "django-captive-portal-oauth-3-81251466",
		title: "Django Captive Portal OAuth — WiFi guest authentication via social login — P2 — Social OAuth beats local guest accounts",
		text: `### P2 — Social OAuth beats local guest accounts

- **Who hurts:** Front-desk staff and guests who would otherwise need disposable usernames/passwords printed on receipts.
- **Pain today:** Local Django registration creates support burden; guests forget passwords; staff reset accounts manually.
- **How this repo answers:** registers , , , and . Settings configure email-based account authentication and Google as a entry. README states Facebook is also a target provider, but Facebook is not present in the active provider list in settings at the time of this summary.
- **Out of scope:** Enterprise SSO (SAML, OIDC beyond social), per-device MAC authorization, or bandwidth quotas.`,
		related: [],
		tags: ["django-captive-portal-oauth","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "django-captive-portal-oauth",
	},
	{
		id: "django-captive-portal-oauth-4-8c76c1eb",
		title: "Django Captive Portal OAuth — WiFi guest authentication via social login — P3 — First-time visitor approval workflow (product intent)",
		text: `### P3 — First-time visitor approval workflow (product intent)

- **Who hurts:** Reception staff at venues that want to vet new guests before granting WiFi.
- **Pain today:** Without a registration gate, any successful OAuth login immediately grants access — no staff checkpoint. - **How this repo answers (intended):** README describes that registered users navigate freely while first-time visitors are shown a page inviting them to approach reception for access registration. **The checked-in codebase does not yet implement this distinction** — the home template only branches on vs anonymous, with no custom user-registration or approval model.
- **Out of scope:** CRM integration, SMS verification, or payment for WiFi access.`,
		related: [],
		tags: ["django-captive-portal-oauth","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "django-captive-portal-oauth",
	},
	{
		id: "django-captive-portal-oauth-5-f65bbd15",
		title: "Django Captive Portal OAuth — WiFi guest authentication via social login — 3. Product / idea",
		text: `## 3. Product / idea

The mental model is a **thin Django portal layer** sitting behind captive-portal hardware: 1. Guest connects to WiFi; the access point redirects HTTP to this Django app. 2. Guest lands on (home), sees a trilingual prompt to log in. 3. Guest follows the login link → allauth social flow (Google configured; Facebook planned). 4. On success, sends them back to , which displays a welcome message confirming internet access. 5. (Planned) UniFi integration via would authorize the client MAC/session on the controller after successful login. The repository is **small and incomplete**: there are no custom Django apps ( , packages are absent). Business logic is limited to Django admin, allauth, and a for the landing page. Settings contain a developer comment marking OAuth provider configuration as work-in-progress.`,
		related: [],
		tags: ["django-captive-portal-oauth","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "django-captive-portal-oauth",
	},
	{
		id: "django-kmportal-0-176df7dc",
		title: "KM 1151 Enterprise Portal — B2B fuel-station ordering and pump-operator intranet — KM 1151 Enterprise Portal",
		text: `## KM 1151 Enterprise Portal

> **Problem thesis (required):** This repository is a Django web application for **KM 1151**, a fuel-station enterprise serving B2B fleet customers in Argentina. It digitizes the workflow from **fuel order creation** (by authenticated company users via social login) through **QR-based handoff** to **pump operators** who record refueling on a staff intranet, plus a parallel **ExtraCash** (cash transfer) module. The README explicitly marks the project as **work in progress and not production-ready**, but substantial modules (orders, vehicles, company, staff refueling, i18n, CI/CD hooks) are already implemented.`,
		related: [],
		tags: ["django-kmportal","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "django-kmportal",
	},
	{
		id: "django-kmportal-1-c8824ed4",
		title: "KM 1151 Enterprise Portal — B2B fuel-station ordering and pump-operator intranet — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Enterprise fuel-station portal where B2B fleet customers order fuel online and pump operators fulfill orders and ExtraCash requests through a staff intranet, with Spanish-first i18n and Google OAuth company binding. |
| Audience | B2B fleet dispatchers and company users (customer portal); pump operators and station staff (staff intranet); Django admins (admin site); internal operators deploying on EC2 with RDS MySQL. |
The product name in README is **KM 1151 Enterprise Portal**. It targets Grupo ALVS / KM 1151 operational context (Argentina, Spanish primary language). Customer users authenticate via django-allauth social providers; staff use a traditional username/password login restricted to the **Pump Operators** Django group.`,
		related: [],
		tags: ["django-kmportal","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "django-kmportal",
	},
	{
		id: "django-kmportal-2-35157e17",
		title: "KM 1151 Enterprise Portal — B2B fuel-station ordering and pump-operator intranet — P1 — B2B fleet fuel ordering without manual coordination",
		text: `### P1 — B2B fleet fuel ordering without manual coordination

- **Who hurts:** Fleet dispatchers and transport companies (B2B partners) who must request diesel/gasoline loads across multiple vehicle tanks (tractor, backpack/mochila, chamber/cámara) before trucks arrive at the station.
- **Pain today:** Orders spread across phone calls, informal messages, or paper — hard to track agreement status, liters requested vs. loaded, expiration, and which driver/tractor/trailer combination applies. No shared operation code for station handoff.
- **How this repo answers:** The Django application models **Company**, **Drivers**, **Tractors**, **Trailers**, and **FuelOrders** with a six-character , fuel-type enums (Infinia Diesel, Infinia, Diesel 500, Super), per-tank liter targets (including a sentinel meaning "max"), lifecycle flags ( , , ), and agreement states ( , , ). Views expose list/create/detail/edit flows under i18n URL prefixes, JSON endpoints for order data/pause/delete/agreement, CSV export per company, and QR PNG generation from the operation code.
- **Out of scope:** Full ticketing system (route exists but renders under-construction page). Instagram OAuth (README roadmap mentions it; only Google is configured in settings). Public anonymous order creation.`,
		related: [],
		tags: ["django-kmportal","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "django-kmportal",
	},
	{
		id: "django-kmportal-3-d185e8c4",
		title: "KM 1151 Enterprise Portal — B2B fuel-station ordering and pump-operator intranet — P2 — Pump-operator fulfillment at the physical station",
		text: `### P2 — Pump-operator fulfillment at the physical station

- **Who hurts:** Pump operators who must receive an order, record actual liters dispensed per tank, attach evidence photos, and mark refueling complete — often while the customer user is not at the console.
- **Pain today:** Disconnect between what the customer ordered online and what happens at the pump; risk of duplicate refueling records; no structured document capture.
- **How this repo answers:** The app provides a **separate login surface** ( ) gated by and membership in the **Pump Operators** group. Operators scan QR codes (POST to ), open refueling forms keyed by , and persist **Refuelings** (one-to-one with ) plus related **Documents** images stored via custom S3-backed . Staff list views cover active orders and ExtraCash queues; attend flows exist for ExtraCash by operation code.
- **Out of scope:** Full i18n for staff UI (explicit TODO in ). Replacing with Pump Operators group checks everywhere (noted as incomplete).`,
		related: [],
		tags: ["django-kmportal","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "django-kmportal",
	},
	{
		id: "django-kmportal-4-097b95ad",
		title: "KM 1151 Enterprise Portal — B2B fuel-station ordering and pump-operator intranet — P3 — Company-scoped identity for OAuth users",
		text: `### P3 — Company-scoped identity for OAuth users

- **Who hurts:** Enterprise customers logging in with Google who must only see their own company's drivers, vehicles, and orders.
- **Pain today:** Social login alone does not map users to B2B legal entities (CUIT, fantasy name).
- **How this repo answers:** links each to a . in prevents duplicate social registrations when an email already exists. View helpers resolve from the authenticated user's Google social account for template context and order scoping.
- **Out of scope:** Self-service company onboarding; admin must configure Sites and Social applications in Django admin per README.`,
		related: [],
		tags: ["django-kmportal","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "django-kmportal",
	},
	{
		id: "django-kmportal-5-13a3c664",
		title: "KM 1151 Enterprise Portal — B2B fuel-station ordering and pump-operator intranet — 3. Product / idea",
		text: `## 3. Product / idea

The mental model is a **two-surface Django monolith** sharing one MySQL database and one set of domain models: 1. **Customer portal ( )** — Marketing pages (home, about, contact), OAuth login, authenticated , and operational modules: fuel orders, ExtraCash, company profile, vehicles (drivers/tractors/trailers). URLs under so paths are language-prefixed (default ). 2. **Staff intranet ( )** — Non-i18n paths under for pump operators: home, QR scanner, refueling CRUD, order list, ExtraCash list and attend. Uses Django auth with , not allauth. 3. **Shared infrastructure** — configures MySQL, allauth, compressor, tailwind theme app, WhiteNoise static files, and S3 document storage. app is installed but views are empty and REST routes are commented out in . Orders move through a lifecycle: customer creates → generates and QR → operator scans QR on staff side → creates linked one-to-one → uploads → marks finished. ExtraCash follows a parallel model with cash amounts and image proof uploads. Internationalization uses Django's PO files plus a custom + pipeline (makemessages → JSON merge → compilemessages) supporting **en**, **es**, **pt**.`,
		related: [],
		tags: ["django-kmportal","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "django-kmportal",
	},
	{
		id: "django-unifi-portal-0-de626508",
		title: "Django UniFi Portal — reusable Django captive portal for UniFi guest WiFi with MAC authorization — Django UniFi Portal",
		text: `## Django UniFi Portal

> **Problem thesis (required):** When a guest connects to a UniFi wireless network with guest policy and an **external portal** configured, the access point redirects HTTP traffic to a captive portal server. That server must (1) authenticate the guest, (2) receive UniFi query parameters identifying the guest device MAC and access point, and (3) call the UniFi Controller API to **authorize-guest** for a configurable duration. This private repository is a **reusable Django application** ( ) that implements that full loop: Django username/password login, self-service registration with profile fields, Facebook OAuth2 sign-in, and programmatic MAC authorization against UniFi Controller versions 3–5. It originated as a fork of the open-source project and is packaged for internal reuse with a demo project illustrating integration.`,
		related: [],
		tags: ["django-unifi-portal","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "django-unifi-portal",
	},
	{
		id: "django-unifi-portal-1-8983ac76",
		title: "Django UniFi Portal — reusable Django captive portal for UniFi guest WiFi with MAC authorization — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Reusable Django app that authenticates WiFi guests (Django + Facebook OAuth) and authorizes their MAC on a UniFi Controller external captive portal. |
| Audience | Network operators and Django developers deploying UniFi guest WiFi with custom branding, user accounts, and social login; maintainers integrating the app into a host Django project. |`,
		related: [],
		tags: ["django-unifi-portal","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "django-unifi-portal",
	},
	{
		id: "django-unifi-portal-2-cc2c3f83",
		title: "Django UniFi Portal — reusable Django captive portal for UniFi guest WiFi with MAC authorization — P1 — UniFi external portal requires post-auth MAC authorizati",
		text: `### P1 — UniFi external portal requires post-auth MAC authorization

- **Who hurts:** Operators of UniFi access points with guest policies who configure an external captive portal instead of UniFi's built-in hotspot manager.
- **Pain today:** UniFi redirects unauthenticated guests to the external portal with query parameters ( = guest MAC, = AP MAC, = original destination, ). After the guest proves identity, something must call the controller's command or the device remains blocked. Manual voucher systems do not tie authorization to individual user records.
- **How this repo answers:** The at is the UniFi landing path. After succeeds, the view reads MAC/AP/URL from the query string, persists MAC and login timestamp on the profile, instantiates , logs into the controller API, checks whether the MAC is already authorized, and if not posts with from settings. Failure renders .
- **Out of scope:** UniFi built-in voucher/hotspot UI; RADIUS integration; per-SSID rate limiting; automatic deauthorization scheduling beyond the minutes parameter.`,
		related: [],
		tags: ["django-unifi-portal","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "django-unifi-portal",
	},
	{
		id: "django-unifi-portal-3-2e5e3abe",
		title: "Django UniFi Portal — reusable Django captive portal for UniFi guest WiFi with MAC authorization — P2 — Per-user guest accounts with registration and social log",
		text: `### P2 — Per-user guest accounts with registration and social login on a captive portal

- **Who hurts:** Venues (clubs, hotels, events) that want identifiable guest accounts, marketing opt-in, and Facebook sign-in rather than shared passwords or vouchers.
- **Pain today:** Captive portals are often static HTML forms or vendor-locked. Django's auth stack is powerful but does not include UniFi integration or Material-styled portal templates out of the box.
- **How this repo answers:** Ships (email-as-username login form), (extended profile: phone, gender, terms acceptance, newsletter opt-in), and Facebook OAuth via at . A custom in creates profiles, pulls Facebook avatar/locale/city/birthday, and handles by logging out instead of raising. Forms use layouts with Font Awesome social buttons.
- **Out of scope:** Google/Apple/other OAuth providers (backends are commented as extensible only); email verification workflows beyond social-auth mail validation; admin approval of new registrations.`,
		related: [],
		tags: ["django-unifi-portal","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "django-unifi-portal",
	},
	{
		id: "django-unifi-portal-4-333770c7",
		title: "Django UniFi Portal — reusable Django captive portal for UniFi guest WiFi with MAC authorization — P3 — Encapsulating UniFi Controller API complexity in a Djang",
		text: `### P3 — Encapsulating UniFi Controller API complexity in a Django library

- **Who hurts:** Django developers who do not want to reimplement controller login, cookie sessions, SSL quirks, and commands for every deployment.
- **Pain today:** UniFi's HTTPS API on port 8443 uses self-signed certificates, version-specific login paths ( vs ), and site-scoped endpoints ( ). Direct integration is error-prone.
- **How this repo answers:** in wraps session management (LWPCookieJar persisted under ), SSLAdapter for handshake issues, , , , (via ), and the orchestration method . Settings drive server host, port, version, site ID, and controller credentials.
- **Out of scope:** UniFi Network Application 6+ API changes; multi-site orchestration; guest analytics dashboards; firmware management.`,
		related: [],
		tags: ["django-unifi-portal","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "django-unifi-portal",
	},
	{
		id: "django-unifi-portal-5-6a671529",
		title: "Django UniFi Portal — reusable Django captive portal for UniFi guest WiFi with MAC authorization — 3. Product / idea",
		text: `## 3. Product / idea

The repository is structured as a **publishable Django app** plus a **demo host project**. The mental model: 1. Guest device associates with guest SSID → UniFi redirects browser to the external portal (must be configured as controller IP; README notes folder paths are not allowed in UniFi external portal settings). 2. Guest hits login ( ) or registration ( ) or Facebook OAuth ( ). 3. On success, Django session is established; UniFi's redirect (stored in session as ) or default sends the guest to . 4. authorizes the MAC via controller API and shows with SSID, timeout, and guest metadata from context processor. The model extends Django's with portal-specific fields: profile picture, language, gender, city, about, date of birth, phone, last seen guest MAC, and last backend login source. A custom permission is defined for future authorization gating. The demo project ( ) shows how a consuming site wires into , imports secrets from a separate module (not present in the tracked tree), mounts at root, and adds a small app with for listing registered guests.`,
		related: [],
		tags: ["django-unifi-portal","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "django-unifi-portal",
	},
	{
		id: "djangoconda-0-d756f42a",
		title: "DjangoConda — frozen Conda prefix with Python 3.7, Django 3, psycopg2, and Django ecosystem packages — DjangoConda",
		text: `## DjangoConda

> **Problem thesis (required):** This repository is **not a Django application** — it is a **complete, pre-built Conda environment prefix** checked into git. It exists to give kodexArg operators and developers a frozen, copy-paste Python 3.7 runtime already containing Django 3, PostgreSQL adapter (psycopg2), WSGI-capable framework dependencies (via Django + asgiref), and a broad set of Django ecosystem packages (tables, Bootstrap, REST framework, compressor, analytics). The pain it attacks is environment drift: instead of running and dozens of commands on each server or laptop, one shallow clone yields an executable tree under , , and ready for activation or path-based use.`,
		related: [],
		tags: ["djangoconda","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "DjangoConda",
	},
	{
		id: "djangoconda-1-05e34c9c",
		title: "DjangoConda — frozen Conda prefix with Python 3.7, Django 3, psycopg2, and Django ecosystem packages — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Frozen Conda prefix with Python 3.7, Django 3, psycopg2, and curated Django/pip packages for internal legacy deployments. |
| Audience | Internal operators and developers running or maintaining DjangoMCE-era Django projects on Linux; not end users or public consumers. |`,
		related: [],
		tags: ["djangoconda","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "DjangoConda",
	},
	{
		id: "djangoconda-2-5ad3e61b",
		title: "DjangoConda — frozen Conda prefix with Python 3.7, Django 3, psycopg2, and Django ecosystem packages — P1 — Reproducible Django + Postgres runtime without depen",
		text: `### P1 — Reproducible Django + Postgres runtime without dependency resolution

- **Who hurts:** Developers and operators who deploy internal Django apps that require Python 3.7, Django, and PostgreSQL connectivity on Linux servers.
- **Pain today:** Building a conda environment from scratch requires matching Python minor version, conda channel packages, and pip extras; version skew between machines causes import errors, migration failures, and psycopg2 binary mismatches.
- **How this repo answers:** The entire conda prefix is version-locked in git: records the original transaction (dated 2019-12-22), and holds the pip-upgraded stack (Django 3.0.3, psycopg2 2.8.4, DRF, tables2, etc.). Cloning the repo reproduces the same interpreter and site-packages tree.
- **Out of scope:** Application source code, database migrations, WSGI server process management (Gunicorn/uWSGI binaries are not present), container images, or modern Python 3.10+ runtimes.`,
		related: [],
		tags: ["djangoconda","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "DjangoConda",
	},
	{
		id: "djangoconda-3-311aa4f8",
		title: "DjangoConda — frozen Conda prefix with Python 3.7, Django 3, psycopg2, and Django ecosystem packages — P2 — Pre-bundled Django ecosystem for data-heavy internal",
		text: `### P2 — Pre-bundled Django ecosystem for data-heavy internal UIs

- **Who hurts:** Teams building Django admin-style interfaces with tables, charts, Excel export, SCSS compression, and REST APIs without assembling each library manually.
- **Pain today:** Each project repeats pip installs for django-tables2, tablib, django-bootstrap4, django-octicons, django-compressor, django-pandas, matplotlib, and related tooling; transitive conflicts (libsass, rcssmin, numpy/pandas versions) waste time.
- **How this repo answers:** Pip packages are already installed in the prefix: django-tables2 2.2.1, tablib 0.14.0, django-bootstrap4 1.1.1, django-octicons 1.0.2, django-compressor 2.4, djangorestframework 3.11.0, django-pandas 0.6.1, matplotlib 3.1.3, pandas 1.0.1, scikit-learn 0.22, plus SCSS/sass tooling ( , , , , binaries , , ).
- **Out of scope:** Frontend SPA frameworks, modern Tailwind/CSS pipelines, or package updates — versions are frozen at 2019–2020 era.`,
		related: [],
		tags: ["djangoconda","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "DjangoConda",
	},
	{
		id: "djangoconda-4-1981bb7f",
		title: "DjangoConda — frozen Conda prefix with Python 3.7, Django 3, psycopg2, and Django ecosystem packages — P3 — Portable deployment artifact for server paths",
		text: `### P3 — Portable deployment artifact for server paths

- **Who hurts:** Operators who deploy to fixed paths on Linux hosts (conda history references ).
- **Pain today:** Shipping a venv or conda env as a tarball is opaque; git clone gives audit history and a known layout ( , , ).
- **How this repo answers:** The repo root **is** the environment prefix — not a wrapper project. , , and are entrypoints. and provide Anaconda glibc backwards-compatibility for older Linux targets.
- **Out of scope:** Cross-platform macOS/Windows support (layout is Linux conda); automated activation scripts beyond what conda normally provides.`,
		related: [],
		tags: ["djangoconda","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "DjangoConda",
	},
	{
		id: "djangoconda-5-a4f24675",
		title: "DjangoConda — frozen Conda prefix with Python 3.7, Django 3, psycopg2, and Django ecosystem packages — 3. Product / idea",
		text: `## 3. Product / idea

The central idea is **environment-as-repository**: treat a Conda prefix like source code. There is no Django , no , and no in this tree — only the **runtime** that other repos (e.g. DjangoMCE-family projects) consume. Mental model: An operator points or conda activation at this prefix, then runs a separate application repo's Django project against the bundled packages. WSGI deployment is **implicit** (Django is WSGI-capable; includes WSGI-to-ASGI adapters) but this repo does **not** ship Gunicorn, uWSGI, or mod_wsgi binaries — an external WSGI server or platform layer is assumed. documents an older creation recipe ( plus pip extras), which diverges from the actual frozen state (Python 3.7.5, Django 3.0.3). Treat as historical hint, not SSOT for the checked-in prefix.`,
		related: [],
		tags: ["djangoconda","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "DjangoConda",
	},
	{
		id: "djangomce-0-7c18f475",
		title: "DjangoMCE — internal Mendoza Central operations portal — DjangoMCE",
		text: `## DjangoMCE

> **Problem thesis (required):** DjangoMCE is the base Django web application for the Mendoza Central (MCE) internal portal. It unifies announcement publishing, HR novedades management, environmental temperature dashboards, and slot-machine production analytics behind one Spanish-language, session-authenticated site. It is designed to run alongside the companion **DjangoConda** repository (conda environment at path ), reading from existing operational databases rather than replacing them.`,
		related: [],
		tags: ["djangomce","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "DjangoMCE",
	},
	{
		id: "djangomce-1-152a3fc4",
		title: "DjangoMCE — internal Mendoza Central operations portal — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Internal Django portal for casino-floor staff: announcements, HR novedades, temperature charts, and slot production tables. |
| Audience | MCE staff (HR, operations analysts, floor supervisors), authenticated via Django users; admin users manage master data. |`,
		related: [],
		tags: ["djangomce","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "DjangoMCE",
	},
	{
		id: "djangomce-2-8d227c30",
		title: "DjangoMCE — internal Mendoza Central operations portal — P1 — Fragmented internal tools for floor and HR staff",
		text: `### P1 — Fragmented internal tools for floor and HR staff

- **Who hurts:** HR coordinators, shift supervisors, and floor staff at Mendoza Central who need to communicate changes and consult live operational data.
- **Pain today:** Announcements, employee incident/leave reporting, temperature monitoring, and slot statistics were spread across separate systems and raw database access.
- **How this repo answers:** Provides a single Bootstrap-styled portal with navigation zones for Anuncios (bulletin board), RRHH (novedades + employee directory), Temperatura (charts), and Operaciones (production statistics). Django auth gates staff-only sections; the admin site handles master employee data.
- **Out of scope:** Does not replace the upstream slot telemetry pipeline or the Raspberry Pi sensor ingestion stack; it reads their databases. Does not provide a public-facing marketing site.`,
		related: [],
		tags: ["djangomce","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "DjangoMCE",
	},
	{
		id: "djangomce-3-ad5e5c33",
		title: "DjangoMCE — internal Mendoza Central operations portal — P2 — Legacy databases need a readable façade",
		text: `### P2 — Legacy databases need a readable façade

- **Who hurts:** Operations analysts who need coin-in/win summaries and temperature history without writing SQL.
- **Pain today:** Temperature readings live in a MySQL table; slot master list and daily telemetry live in a PostgreSQL database with Spanish column names and underscore-prefixed fields.
- **How this repo answers:** Defines unmanaged Django models ( , , ) mapped to existing tables, uses DataFrame managers for aggregation, and renders Highcharts JSON (temperature) or styled pandas HTML tables (production per day).
- **Out of scope:** Schema migrations for legacy DBs ( on all external models). No ETL or data warehouse layer.`,
		related: [],
		tags: ["djangomce","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "DjangoMCE",
	},
	{
		id: "djangomce-4-994687b0",
		title: "DjangoMCE — internal Mendoza Central operations portal — P3 — Structured HR novedades with type-driven forms",
		text: `### P3 — Structured HR novedades with type-driven forms

- **Who hurts:** HR staff tracking vacations, shift swaps, incidents, and other employee events.
- **Pain today:** Paper or ad-hoc spreadsheets lack approval workflow fields and per-type form requirements.
- **How this repo answers:** defines boolean flags ( , , , etc.) that drive dynamic form visibility via a JSON injected into create views. tracks approval states (Visto, Aprobado, Denegado, En espera). List views use with export support.
- **Out of scope:** Full workflow engine or email notifications; is configured but outbound mail integration is not evident in views.`,
		related: [],
		tags: ["djangomce","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "DjangoMCE",
	},
	{
		id: "djangomce-5-ac0dceaa",
		title: "DjangoMCE — internal Mendoza Central operations portal — 3. Product / idea",
		text: `## 3. Product / idea

DjangoMCE is a monolithic Django 3.0 project ( ) with five domain apps under . The mental model is **portal shell + read-mostly analytics adapters + HR CRUD**: - **Home / Anuncios:** filters announcements active between and ; this is also mounted at as the landing page. - **RRHH:** app handles employee roster tables and novedad creation with conditional fields; staff see this in the nav dropdown. - **Temperatura:** Renders a chart page; AJAX calls which aggregates MySQL sensor rows into Highcharts spline series grouped by Raspberry Pi unit ( ). - **Operaciones / Estadísticas:** Permission-gated ( ); shows welcome page and "Producción por día" table merging slot telemetry with master list metadata via pandas. - **API:** Thin DRF exposing temperature rows for programmatic access. Static assets are collected to ( ); source static lives in with SCSS compiled via and . Frontend vendor libs (Bootstrap, Highcharts, moment, underscore) are managed through . Timezone is ; (local naive datetimes). UI language is Spanish ( ).`,
		related: [],
		tags: ["djangomce","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "DjangoMCE",
	},
	{
		id: "docker-kmportal-0-2e4a0873",
		title: "KM 1151 Enterprise Portal — Dockerized Django fuel-station B2B portal — KM 1151 Enterprise Portal (docker-kmportal)",
		text: `## KM 1151 Enterprise Portal (docker-kmportal)

> **Problem thesis (required):** This repository packages and delivers a Django-based enterprise web portal for KM 1151, an Argentine fuel station serving B2B fleet customers. It solves the operational gap between fleet dispatchers (who need to order fuel loads across tractor, backpack, and chamber tanks for specific drivers and plates) and on-site pump operators (who need a staff intranet to fulfill those orders via QR scanning and refueling records). The repo unifies the application source, Docker build/runtime configuration, and deployment scaffolding so the portal can be developed locally and deployed to EC2 with a consistent MySQL-backed stack.`,
		related: [],
		tags: ["docker-kmportal","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "docker-kmportal",
	},
	{
		id: "docker-kmportal-1-48287c64",
		title: "KM 1151 Enterprise Portal — Dockerized Django fuel-station B2B portal — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Containerized Django portal for B2B fuel load ordering, ExtraCash transfers, and pump-operator fulfillment at KM 1151. |
| Audience | B2B fleet customer users (OAuth login), pump operators (staff intranet), Django admins, and internal operators deploying to EC2. |`,
		related: [],
		tags: ["docker-kmportal","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "docker-kmportal",
	},
	{
		id: "docker-kmportal-2-2325f7c6",
		title: "KM 1151 Enterprise Portal — Dockerized Django fuel-station B2B portal — P1 — B2B fleet fuel ordering without manual coordination",
		text: `### P1 — B2B fleet fuel ordering without manual coordination

- **Who hurts:** Fleet dispatchers and transport companies (B2B partners) who regularly send trucks to KM 1151 for multi-tank refueling.
- **Pain today:** Coordinating fuel loads by phone or paper is error-prone: wrong driver, wrong plate, unclear liters per tank (tractor / backpack / chamber), and no shared audit trail of order state (paused, locked, agreed, finished).
- **How this repo answers:** The Django application models with operation codes, company-scoped drivers, tractors, and trailers, fuel-type choices (Infinia Diesel, Infinia, Diesel 500, Super), liters-to-load per tank, agreement workflow, and pause/lock/finish flags. Customer users authenticate via Google OAuth (django-allauth), land on a localized user home, and manage orders through module views ( , , ). QR codes tie orders to the staff fulfillment flow.
- **Out of scope:** Consumer retail fuel purchases, payment processing, real-time pump hardware integration, and the ticketing/helpdesk module (still marked under construction).`,
		related: [],
		tags: ["docker-kmportal","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "docker-kmportal",
	},
	{
		id: "docker-kmportal-3-988890e5",
		title: "KM 1151 Enterprise Portal — Dockerized Django fuel-station B2B portal — P2 — Pump-operator fulfillment intranet",
		text: `### P2 — Pump-operator fulfillment intranet

- **Who hurts:** On-site pump operators who must fulfill queued fuel orders and ExtraCash requests accurately and record actual dispensed liters.
- **Pain today:** Without a dedicated staff UI, operators cannot reliably match incoming orders to physical refueling events, capture photos/documents, or prevent duplicate refueling of finished orders.
- **How this repo answers:** The Django app provides a separate login path ( ) restricted to users in the "Pump Operators" group. Operators access QR scanning ( ), order lists ( ), refueling forms ( ), and ExtraCash attendance ( ). The model links one-to-one to and records actual liters, fuel types, observations, and attached document images stored via S3-backed .
- **Out of scope:** Full HR/payroll for operators, inventory management of underground tank levels, and Instagram OAuth (listed in roadmap but not implemented).`,
		related: [],
		tags: ["docker-kmportal","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "docker-kmportal",
	},
	{
		id: "docker-kmportal-4-05780071",
		title: "KM 1151 Enterprise Portal — Dockerized Django fuel-station B2B portal — P3 — Reproducible containerized deployment",
		text: `### P3 — Reproducible containerized deployment

- **Who hurts:** Developers and operators who need the portal running consistently across local machines and EC2 production hosts.
- **Pain today:** A bare Django project on a developer laptop does not match production topology (MySQL, reverse proxy, WSGI server, env-driven secrets). Manual EC2 setup is fragile and hard to onboard.
- **How this repo answers:** Root (Python 3.12 slim), (MySQL 8, web/Gunicorn, Nginx 1.25), , , and define a three-service stack. Environment variables drive database credentials and Django settings. README documents EC2 deployment via GitHub Actions SSH pull workflow (referenced in docs; workflow file not present in current shallow clone). Extras include EC2 bootstrap script and a standalone MySQL compose stub.
- **Out of scope:** Kubernetes orchestration, Terraform/IaC, and fully automated initial EC2 provisioning (README states EC2 must be pre-configured).`,
		related: [],
		tags: ["docker-kmportal","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "docker-kmportal",
	},
	{
		id: "docker-kmportal-5-c199b213",
		title: "KM 1151 Enterprise Portal — Dockerized Django fuel-station B2B portal — 3. Product / idea",
		text: `## 3. Product / idea

The central idea is a **two-surface Django monolith** for a fuel-station enterprise: 1. **Customer portal ( )** — OAuth-authenticated B2B users linked to a via . They manage fleet metadata (drivers, tractors, trailers), create and track fuel orders and ExtraCash requests, and export CSV reports. Pages are internationalized (Spanish default, English and Portuguese) via Django i18n plus a custom workflow. 2. **Staff intranet ( )** — Username/password login for pump operators. QR-based order lookup converts a operation code into a record. Operators record actual liters dispensed per tank, attach photos, and mark orders finished. 3. **Container runtime** — Nginx terminates HTTP on port 8000 (host) and proxies to Gunicorn on 8080 inside the container. MySQL persists data in a named volume. The Django tree is bind-mounted for development. Mental model: **Order creation (customer) → QR/share operation code → Staff scan/lookup → Refueling record (operator) → Order finished**. ExtraCash follows a parallel cash-transfer workflow with document image uploads. The project README explicitly states it is **work in progress and not production-ready**, with incomplete ticketing, partial OAuth (Google only, not Instagram), and ongoing S3 document storage setup.`,
		related: [],
		tags: ["docker-kmportal","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "docker-kmportal",
	},
	{
		id: "docs-new-infra-grupoalvs-com-0-05a1ecd4",
		title: "ALVS New-Infra AWS Platform — living MkDocs specification and tooling — ALVS New-Infra AWS Platform Docs",
		text: `## ALVS New-Infra AWS Platform Docs

> **Problem thesis (required):** This repository is the living specification and publication pipeline for ALVS's greenfield AWS platform — a deliberately simple, cost-conscious, convention-driven stack for workloads. It exists so architects, operators, and AI agents share one evolving truth about networking, security, compute, databases, Cognito identity, CI/CD, and per-project bootstrap — while the actual infrastructure is provisioned separately and legacy systems remain untouched.`,
		related: [],
		tags: ["docs-new-infra-grupoalvs-com","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "docs-new-infra-grupoalvs-com",
	},
	{
		id: "docs-new-infra-grupoalvs-com-1-74e51a7f",
		title: "ALVS New-Infra AWS Platform — living MkDocs specification and tooling — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Canonical MkDocs site plus Python tooling that documents and orchestrates ALVS v3 AWS infrastructure (DEV+PROD VPCs, ECS, RDS, Cognito, OIDC CI/CD) for projects. |
| Audience | ALVS admins and architects (infra ownership), project developers (CI/CD and Django conventions), and AI agents editing or consuming the spec ( , ). |`,
		related: [],
		tags: ["docs-new-infra-grupoalvs-com","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "docs-new-infra-grupoalvs-com",
	},
	{
		id: "docs-new-infra-grupoalvs-com-2-f0cc59b4",
		title: "ALVS New-Infra AWS Platform — living MkDocs specification and tooling — P1 — Fragmented infrastructure knowledge blocks safe greenfield delivery",
		text: `### P1 — Fragmented infrastructure knowledge blocks safe greenfield delivery

- **Who hurts:** Platform admins, architects, and developers onboarding to ALVS's new AWS footprint.
- **Pain today:** Before v3, infrastructure intent lived in ad-hoc audits, pre-v3 plans, frozen ADRs, and console state that diverged from written specs. Teams could not tell whether a design choice was aspirational, superseded, or actually deployed. Greenfield work risked overlapping CIDRs with legacy VPCs or re-litigating rejected options (NAT Gateway, WAF, API Gateway backends).
- **How this repo answers:** is the human-facing chapter-by-chapter spec (networking, security, Cognito, databases, compute, frontend, CI/CD, bootstrap). holds the dense SSOT v3.2 for agents. ratifies verified drift between original SPEC and real AWS inventory so the canon stays honest. provides topology diagrams, naming conventions, and current phase status.
- **Out of scope:** It does not manage legacy infrastructure ( is read-only inventory). It does not replace per-application business logic repos.`,
		related: [],
		tags: ["docs-new-infra-grupoalvs-com","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "docs-new-infra-grupoalvs-com",
	},
	{
		id: "docs-new-infra-grupoalvs-com-3-d8b602bd",
		title: "ALVS New-Infra AWS Platform — living MkDocs specification and tooling — P2 — Per-project onboarding is error-prone without enforced conventions",
		text: `### P2 — Per-project onboarding is error-prone without enforced conventions

- **Who hurts:** Admins spinning up new ALVS applications (e.g. pilot project ).
- **Pain today:** Manual console work produces inconsistent resource names, missing ECR lifecycle rules, wrong DNS patterns, forgotten Cognito app clients, and misaligned Secrets Manager paths. Partial failures leave half-provisioned environments.
- **How this repo answers:** defines the contract. idempotently orchestrates GitHub repo creation, branch protection, GHA environment, RDS databases/users, Secrets Manager entries, ECR, ECS services, S3+CloudFront, Route 53 records, and Cognito clients/groups — with dry-run as default. supplies a reusable DEV deploy workflow (runtime-state model). documents adoption prerequisites.
- **Out of scope:** Shared base infra (VPCs, ALBs, clusters, org Cognito pool, hosted zone) is provisioned once via , not per project.`,
		related: [],
		tags: ["docs-new-infra-grupoalvs-com","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "docs-new-infra-grupoalvs-com",
	},
	{
		id: "docs-new-infra-grupoalvs-com-4-babbf926",
		title: "ALVS New-Infra AWS Platform — living MkDocs specification and tooling — P3 — Docs must stay publishable and agent-governed as the spec evolves",
		text: `### P3 — Docs must stay publishable and agent-governed as the spec evolves

- **Who hurts:** Anyone consuming the published docs site and AI agents editing chapters.
- **Pain today:** Documentation without CI rots; agent edits without rules create inconsistent diagrams, inline comment labels, or unauthorized AWS mutations.
- **How this repo answers:** configures Material theme (Spanish UI, Mermaid, search). builds with and deploys to AWS Amplify via OIDC role . (and symlink ) define agent access rules: free edit on , read-only on , read-only on live AWS until authorized, Mermaid-only diagrams, heading-before-code-block style. records pipeline design decisions and legacy fallback via .
- **Out of scope:** Application runtime hosting for ALVS projects (that uses ECS Fargate per ); this repo's own hosting is Amplify for the docs site only.`,
		related: [],
		tags: ["docs-new-infra-grupoalvs-com","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "docs-new-infra-grupoalvs-com",
	},
	{
		id: "docs-new-infra-grupoalvs-com-5-42235854",
		title: "ALVS New-Infra AWS Platform — living MkDocs specification and tooling — 3. Product / idea",
		text: `## 3. Product / idea

The repository is two coupled products in one tree: 1. **A published documentation site** — Spanish-language MkDocs Material chapters explaining ALVS v3 architecture end-to-end, from VPC design through Cognito groups to Django deployment conventions. 2. **Infrastructure orchestration tooling** — Python CLI scripts under that apply CloudFormation templates in phase order and bootstrap per-project resources, always defaulting to dry-run for safety. The mental model is **"spec is truth, infra is volatile."** AWS resources can be recreated; the documentation and templates define naming, security boundaries, and operational flows. Two isolated VPCs ( at , at ) host shared ALBs and ECS clusters. Applications land as ECS Fargate services behind host-based routing, with per-project S3+CloudFront for static/media assets. A single org-wide Cognito User Pool ( ) federates Google OAuth. GitHub Actions assumes IAM roles via OIDC — DEV deploys automatically on push to ; PROD promotion requires admin approval, wait timer, and ECR image re-tag (no rebuild). Philosophy (from ): simplicity over scale, cost over redundancy (no NAT GW, no WAF, RDS single-AZ by choice), greenfield coexistence with legacy, minimal AWS tags ( , only).`,
		related: [],
		tags: ["docs-new-infra-grupoalvs-com","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "docs-new-infra-grupoalvs-com",
	},
	{
		id: "docs-portal-0-c01a81a3",
		title: "docs-portal — secure Obsidian-to-web documentation hub on Cloudflare Pages — docs-portal",
		text: `## docs-portal

> **Problem thesis (required):** docs-portal is the kodexArg **personal documentation platform**: it turns clean Obsidian vault folders into Google-authenticated static websites on Cloudflare Pages, and provides a Tone-themed Astro portal that indexes all vaults from a central dashboard. The repository solves the split between **authoring** (100% Obsidian-compatible markdown in ) and **publishing** (Node compile step + Pages deploy scripts), while encoding operational knowledge about which DNS subtrees can be Access-gated for free and which cannot.`,
		related: [],
		tags: ["docs-portal","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "docs-portal",
	},
	{
		id: "docs-portal-1-dfdd86a1",
		title: "docs-portal — secure Obsidian-to-web documentation hub on Cloudflare Pages — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Compile Obsidian vaults to static HTML, deploy each vault and a shared portal index behind Cloudflare Access, with one wildcard auth policy covering all docs subdomains. |
| Audience | Primary operator (Gabriel Cavedal); AI agents maintaining vaults and deployment; readers of hosted documentation after Google login. |`,
		related: [],
		tags: ["docs-portal","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "docs-portal",
	},
	{
		id: "docs-portal-2-ff7d88b4",
		title: "docs-portal — secure Obsidian-to-web documentation hub on Cloudflare Pages — P1 — Obsidian notes need web publishing without contaminating the vault",
		text: `### P1 — Obsidian notes need web publishing without contaminating the vault

- **Who hurts:** A solo operator maintaining technical documentation in Obsidian who wants browser access from any device without running Obsidian Sync or exposing raw folders.
- **Pain today:** Typical SSG workflows require markdown inside the framework repo, mixed with components and config. That breaks the Obsidian mental model: wikilinks, callouts, and attachments expect a pure note tree. Copying notes into an Astro project duplicates content and drifts from the canonical vault.
- **How this repo answers:** holds **only** markdown and attachments—no JS, no Astro, no HTML. reads a vault by name, resolves wikilinks to shortest-path URLs, renders Obsidian callouts and embeds, wraps output in a Tone-styled layout with responsive sidebar navigation, and writes static HTML under . Vault folders remain openable directly in Obsidian.
- **Out of scope:** Real-time collaboration, bidirectional sync, search indexing inside compiled vaults (portal index has pagefind; per-vault search is sidebar navigation only), and WYSIWYG editing in the browser.`,
		related: [],
		tags: ["docs-portal","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "docs-portal",
	},
	{
		id: "docs-portal-3-53b48964",
		title: "docs-portal — secure Obsidian-to-web documentation hub on Cloudflare Pages — P2 — Many doc sites, one front door and one auth policy",
		text: `### P2 — Many doc sites, one front door and one auth policy

- **Who hurts:** The operator managing Coveris, ALVS, SyV character-kit, and future internal docs who does not want to configure Cloudflare Access separately for every new site.
- **Pain today:** Each static site on Pages is public by default. Gating requires per-project Access apps, DNS records, and policy maintenance. Without a catalog, readers forget which subdomain hosts which body of knowledge.
- **How this repo answers:** is an Astro 6 site using the **Tone** theme. At build time scans , counts markdown notes recursively, and renders a dashboard of vault cards linking to each vault's docs subdomain. builds the portal, deploys to Pages project , wires the primary docs hostname, and creates a wildcard Access application covering the portal and subdomains under the same Google IdP. compiles one vault and deploys to with hostname .
- **Out of scope:** Multi-tenant auth beyond the email allowlist in deploy scripts; CMS or dynamic vault registration without redeploying the portal.`,
		related: [],
		tags: ["docs-portal","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "docs-portal",
	},
	{
		id: "docs-portal-4-4af05ee3",
		title: "docs-portal — secure Obsidian-to-web documentation hub on Cloudflare Pages — P3 — Cloudflare Access only works on proxied zones (DNS gotcha)",
		text: `### P3 — Cloudflare Access only works on proxied zones (DNS gotcha)

- **Who hurts:** Anyone attempting free Gmail-gated sites on delegated subzones (notably the dev subtree routed to AWS Route 53).
- **Pain today:** A Pages custom domain CNAME in a non-Cloudflare zone can serve TLS and content but **does not enforce Access**—the site stays public. This failure mode was documented after a real incident in .
- **How this repo answers:** and codify the rule: secure documentation lives on the docs subtree or apex zone under Cloudflare proxy, never on the dev subtree unless a dedicated Cloudflare zone is sub-delegated (requires zone-create capability). and only create proxied CNAMEs in the main zone. The playbook in is reusable for future Pages + Access sites.
- **Out of scope:** Enterprise Cloudflare for SaaS custom hostnames; Workers-based hosting (account tokens documented as Pages+Access only, not Workers).`,
		related: [],
		tags: ["docs-portal","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "docs-portal",
	},
	{
		id: "docs-portal-5-cf75537d",
		title: "docs-portal — secure Obsidian-to-web documentation hub on Cloudflare Pages — P4 — Agent-assisted vault authoring needs conventions",
		text: `### P4 — Agent-assisted vault authoring needs conventions

- **Who hurts:** AI agents editing Obsidian vaults or deploying docs who need syntax and Cloudflare deployment guardrails.
- **How this repo answers:** bundles Obsidian markdown reference, Obsidian bases, Cloudflare wrangler/workers skills (vendor tree), find-skills, and skill-creator tooling. Vaults like ship their own with editorial policy (rolling-release PRDs, schema sync rules, lore canon boundaries).
- **Out of scope:** The repo does not run agents; it only stores instruction trees.`,
		related: [],
		tags: ["docs-portal","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "docs-portal",
	},
	{
		id: "dollar-today-km1151-0-51adee06",
		title: "dollar-today-km1151 — Marquee currency-rate display (Python image overlay) — dollar-today-km1151",
		text: `## dollar-today-km1151

> **Problem thesis (required):** dollar-today-km1151 is an **on-work Python prototype** for a **marquesina** (marquee / signboard) that shows current currency exchange rates — especially Argentine peso–dollar variants and related pairs. The repo attacks the pain of manually updating a visual price board: it provides scripts to composite large numeric prices onto a shared background image and a stub toward fullscreen display, driven by a small JSON pricing file rather than a CMS or spreadsheet workflow.`,
		related: [],
		tags: ["dollar-today-km1151","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "dollar-today-km1151",
	},
	{
		id: "dollar-today-km1151-1-0118dd08",
		title: "dollar-today-km1151 — Marquee currency-rate display (Python image overlay) — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Small Python toolkit to overlay daily currency prices on a marquee background and preview fullscreen — marquesina on-work project. |
| Audience | Internal operators updating a physical or digital marquee (KM1151 context); developers extending the overlay/display pipeline. |`,
		related: [],
		tags: ["dollar-today-km1151","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "dollar-today-km1151",
	},
	{
		id: "dollar-today-km1151-2-86f49650",
		title: "dollar-today-km1151 — Marquee currency-rate display (Python image overlay) — P1 — Manual marquee price updates",
		text: `### P1 — Manual marquee price updates

- **Who hurts:** Staff responsible for a currency-exchange or retail marquee that must show "dollar today" and related rates (official dollar, blue dollar, euros, etc.).
- **Pain today:** Updating a signboard image often means opening a design tool, typing numbers, aligning text, and exporting — repetitive work every trading day, easy to misalign or use stale dates.
- **How this repo answers:** loads a fixed , prompts for a numeric value, draws it centered in large white Arial text (512 pt via ), and saves . holds structured rate entries (name, date, price) that is intended to consume after JSON normalization (date formatting, float prices).
- **Out of scope:** Live API feeds from central banks or brokers; multi-currency layout on one canvas; scheduling or cron; web UI; authentication; production deployment manifests.`,
		related: [],
		tags: ["dollar-today-km1151","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "dollar-today-km1151",
	},
	{
		id: "dollar-today-km1151-3-a392104a",
		title: "dollar-today-km1151 — Marquee currency-rate display (Python image overlay) — P2 — Fullscreen preview on a display PC",
		text: `### P2 — Fullscreen preview on a display PC

- **Who hurts:** Whoever mounts a monitor or TV as the marquee and needs to verify background scaling before going live.
- **Pain today:** Without a dedicated player, operators resize windows manually or rely on slideshow software unrelated to the price data.
- **How this repo answers:** sketches an OpenCV fullscreen window ( , ) that loads and displays . The helper prepares pricing records for future overlay logic.
- **Out of scope:** Completed integration between JSON prices and on-screen text (current body does not draw prices yet; the function definition appears incomplete in the tree).`,
		related: [],
		tags: ["dollar-today-km1151","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "dollar-today-km1151",
	},
	{
		id: "dollar-today-km1151-4-51139c06",
		title: "dollar-today-km1151 — Marquee currency-rate display (Python image overlay) — 3. Product / idea",
		text: `## 3. Product / idea

The central idea is **image-first marquee publishing**: one canonical background artwork, daily numbers injected programmatically, output as PNG for downstream use (digital signage, print, or a simple local fullscreen preview). The mental model is not a web app or API service but a **two-script workstation**: 1. **Compositor ( )** — interactive CLI: enter today's number, get a centered overlay on the background, save static asset. 2. **Display prototype ( )** — OpenCV window for fullscreen background preview; JSON reader for structured multi-rate data (official dollar, blue dollar, Chilean peso, euro in the sample file). Pieces relate as: → (planned) display pipeline; → shared visual template; → ad-hoc single-value export path. A committed in the repo illustrates a generated result. The GitHub description labels the effort **"Marquesina - onwork project"**, consistent with an early prototype rather than a finished product.`,
		related: [],
		tags: ["dollar-today-km1151","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "dollar-today-km1151",
	},
	{
		id: "dollar-today-km1151-5-ebb8b34b",
		title: "dollar-today-km1151 — Marquee currency-rate display (Python image overlay) — 3.1 North-star use cases",
		text: `### 3.1 North-star use cases

1. Operator runs , enters the day's dollar price, obtains for the marquee feed.
2. Operator edits with dated rates for several labels, runs display script (when complete) for fullscreen TV preview.
3. Developer swaps or adds alternate backgrounds ( , present) for seasonal branding.`,
		related: [],
		tags: ["dollar-today-km1151","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "dollar-today-km1151",
	},
	{
		id: "el-presente-de-la-ai-0-58a38a44",
		title: "El Presente de la AI — ALVS talk deck SSOT and agent-operated slide factory — El Presente de la AI",
		text: `## El Presente de la AI

> **Problem thesis (required):** This private repository is the **single source of truth** for Gabriel Cavedal's ALVS talk **"El Presente de la AI"** — a six-chapter, twenty-six-slide Spanish presentation that demystifies modern AI for a non-specialist room. It is not a web app or API service; it is a **content + design + operations factory**: every slide is specified as a markdown file ( ), visual rules live in and , generated infographics land in , and coding agents apply those specs to a live Google Slides deck through Drive MCP or the CLI. Content is **decided and locked**; agents execute aesthetics and structure one slide at a time.`,
		related: [],
		tags: ["el-presente-de-la-ai","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "El-presente-de-la-aI",
	},
	{
		id: "el-presente-de-la-ai-1-bc336d30",
		title: "El Presente de la AI — ALVS talk deck SSOT and agent-operated slide factory — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Agent-operated SSOT for an ALVS capacitación deck that explains what AI is today — LLMs, tokens, automations vs agents, and market tools — with a warm orange-on-black design system and pre-generated infographic assets. |
| Audience | ALVS internal training attendees (Spanish, live room with large display); Gabriel Cavedal as author and presenter; AI coding agents tasked with slide generation and deck maintenance. |`,
		related: [],
		tags: ["el-presente-de-la-ai","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "El-presente-de-la-aI",
	},
	{
		id: "el-presente-de-la-ai-2-229506a5",
		title: "El Presente de la AI — ALVS talk deck SSOT and agent-operated slide factory — P1 — Accessible AI literacy for a business audience",
		text: `### P1 — Accessible AI literacy for a business audience

- **Who hurts:** ALVS operators, managers, and cross-functional staff who hear "AI" daily but lack a coherent mental model separating chatbots, LLMs, datacenters, tokens, automations, and agents.
- **Pain today:** Vendor marketing and news cycles produce fear, hype, or magical thinking; generic slide decks reuse stock imagery and fail at five-meter readability on a 54-inch monitor in a lit room.
- **How this repo answers:** Six narrative chapters ( ): (1) AI today, (2) what an intelligence artificial is and how it works, (3) automations vs agents, (4) market tools, (5) optional "magic" demos, (6) closing. Chapter two builds the **orbital system diagram** (LLM at center, tool satellites, dotted border = "the AI system") that reappears as the talk's map. Chapter two also uses a token hook ("El perro ladra y el gato ___" → audience completes → "maúlla") so "token" becomes tangible. Take-away slides use high-contrast orange ( ) with black/white type per .
- **Out of scope:** Training engineers to fine-tune models, legal/compliance deep dives, hands-on coding workshops, or certifying tool expertise — the talk orients and names concepts; live demos (NotebookLM, nocode builders) are optional chapter-five extras.`,
		related: [],
		tags: ["el-presente-de-la-ai","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "El-presente-de-la-aI",
	},
	{
		id: "el-presente-de-la-ai-3-7bb30ab8",
		title: "El Presente de la AI — ALVS talk deck SSOT and agent-operated slide factory — P2 — Repeatable agent operations without content drift",
		text: `### P2 — Repeatable agent operations without content drift

- **Who hurts:** Presenters and agents who would otherwise edit Google Slides directly, losing version history, design consistency, and the link between spoken narrative and on-screen text.
- **Pain today:** Blind overwrites in Slides, invented slide copy, restated typography rules per slide, and no checklist of which deck slides actually exist versus which are still spec-only.
- **How this repo answers:** declares agents **operational only** — content is fixed in per-slide markdown. Workflow invariants: read current deck state before edit; one slide per iteration unless batched; confirm completion; record new design decisions in before proceeding. tracks pending vs created in the live deck (all twenty-six entries currently pending in the index snapshot). enforces frontmatter ( , , , , ) plus sections: Tipo, Intención, Contenido, Estáticos (optional), Instrucciones (deviations only — never restate layout defaults). Skills in ( , , , ) document Drive MCP auth and API usage; symlinks into as authoritative.
- **Out of scope:** Autonomous content rewriting, speculative slide additions, or browser/curl shortcuts for Drive — and mandate Google Drive MCP for deck operations.`,
		related: [],
		tags: ["el-presente-de-la-ai","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "El-presente-de-la-aI",
	},
	{
		id: "el-presente-de-la-ai-4-6a0ac12b",
		title: "El Presente de la AI — ALVS talk deck SSOT and agent-operated slide factory — P3 — Visual consistency for generated infographics",
		text: `### P3 — Visual consistency for generated infographics

- **Who hurts:** Anyone generating diagram PNGs for slides — manual designers, scripts, or image models — without a shared palette, icon stroke, or layout contract.
- **Pain today:** Each diagram picks random blues, mixed icon families, tiny labels, and busy backgrounds that collapse on a projector; infographics compete with the speaker instead of supporting one focal idea per slide.
- **How this repo answers:** Closed three-background system in : real black , warm cream , takeaway orange , plus pure white only for infographic canvases. Single font family Nunito (rounded sans); minimum 32 pt on screen; max five legible components per slide. splits outputs into Type A (infographics on white), Type B (atmospheric full-bleed), Type C (recortable illustrations) with strict role separation: slide prompt supplies **what**; design docs supply **how**. holds twenty-seven canonical Lucide SVGs; generators must read disk icons, not invent strokes ( pipeline). already contains chapter-two through chapter-four infographics (flow, orbital system, tokens, market map, pricing columns, non-chat tools grid) plus iteration variants ( , ). Python helpers in ( , , , , ) implement early raster experiments; canonical path is SVG compose + via per design docs.
- **Out of scope:** A general-purpose design system product, automated Slides API`,
		related: [],
		tags: ["el-presente-de-la-ai","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "El-presente-de-la-aI",
	},
	{
		id: "el-presente-de-la-ai-5-ef31a951",
		title: "El Presente de la AI — ALVS talk deck SSOT and agent-operated slide factory — P3 — Visual consistency for generated infographics (2)",
		text: `layout engine, or brand kit for non-ALVS decks — rules inherit typography/color inspiration from sibling repo but content is unique to this talk.`,
		related: [],
		tags: ["el-presente-de-la-ai","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "El-presente-de-la-aI",
	},
	{
		id: "flia-0-a20c7f10",
		title: "Flia — family household expense tracker (Django admin) — Flia",
		text: `## Flia

> **Problem thesis (required):** Flia is a private, legacy Django application for **family household economics** — tracking articles (purchases and services), who is responsible, payment method, category, and dated payment amounts. It exists to give a small household a structured back-office (Django admin) instead of ad-hoc notes or spreadsheets, with Argentine Spanish labels and a data model sketched in before implementation.`,
		related: [],
		tags: ["flia","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "Flia",
	},
	{
		id: "flia-1-c28d8988",
		title: "Flia — family household expense tracker (Django admin) — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Django admin–backed family expense ledger with articles, categories, payers, payment types, and recurring amount history. |
| Audience | Internal household operators (family members) entering and reviewing expenses via Django admin; originally built for personal/family use circa 2019. |`,
		related: [],
		tags: ["flia","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "Flia",
	},
	{
		id: "flia-2-4909d5a6",
		title: "Flia — family household expense tracker (Django admin) — P1 — Centralized family purchase and expense records",
		text: `### P1 — Centralized family purchase and expense records

- **Who hurts:** Household members who share bills, groceries, subscriptions, and occasional large purchases and need one shared record.
- **Pain today:** Expenses live in memory, paper, or disconnected spreadsheets; nobody agrees on category, date, or who “owns” the line item.
- **How this repo answers:** The Django application defines (items), , , , and models. Operators use the built-in Django admin ( URL) to create and maintain records with Spanish field labels ( locale).
- **Out of scope:** No public-facing UI, no bank import, no multi-tenant SaaS, no mobile app, no reporting dashboards beyond what Django admin provides.`,
		related: [],
		tags: ["flia","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "Flia",
	},
	{
		id: "flia-3-35227eed",
		title: "Flia — family household expense tracker (Django admin) — P2 — Recurring services vs one-time purchases",
		text: `### P2 — Recurring services vs one-time purchases

- **Who hurts:** Families with both monthly subscriptions (“infinite” / service items) and one-off buys that should not be modeled the same way.
- **Pain today:** Flat expense lists mix recurring and ephemeral spending, making monthly burn hard to reason about.
- **How this repo answers:** carries (is it a service?) and (is it recurring/infinite?) booleans plus (purchase/start date) and optional text.
- **Out of scope:** No cron jobs, reminders, or automatic renewal detection — flags are metadata only unless extended later.`,
		related: [],
		tags: ["flia","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "Flia",
	},
	{
		id: "flia-4-419c1d0b",
		title: "Flia — family household expense tracker (Django admin) — P3 — Multiple payment amounts per item over time",
		text: `### P3 — Multiple payment amounts per item over time

- **Who hurts:** Operators tracking utilities or installment-style spending where one logical “item” receives several dated payments.
- **Pain today:** Early schema tied a single row directly to ; that does not scale when history matters.
- **How this repo answers:** Migration refactored the relationship so holds → with (decimal) and , enabling one-to-many amount history per article. Admin registers both and .
- **Out of scope:** No amortization math, currency conversion, or tax reporting.`,
		related: [],
		tags: ["flia","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "Flia",
	},
	{
		id: "flia-5-99af5098",
		title: "Flia — family household expense tracker (Django admin) — 3. Product / idea",
		text: `## 3. Product / idea

Flia wraps a single Django project named **vaneconomic** inside the repository root. The mental model is a **small CRUD ledger**: every spending event rolls up to an classified by category, payment type, and responsible person; actual money movements over time live in child rows. There are **no custom HTTP views** — is empty and only mounts . The product surface is entirely the Django admin site plus whatever data already sits in the committed file (local dev artifact). A bundled **Conda prefix** at was created on 2019-10-14 with , , and , so the original developer could run the project without a separate virtualenv setup. Runtime settings nonetheless point at **SQLite**, not MySQL.`,
		related: [],
		tags: ["flia","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "Flia",
	},
	{
		id: "fsk-showers-0-0c020eb9",
		title: "FSK Showers — Flask CRUD for roadside shower registrations — FSK Showers",
		text: `## FSK Showers

> **Problem thesis (required):** This repository is a small internal web application for registering and managing **shower usage** at a roadside fuel/highway service location in the Uspallata corridor (referenced in page metadata as KM1107 / KM1151). It replaces ad-hoc paper or spreadsheet tracking with a browser-based CRUD interface so on-site staff can create, list, and delete shower-use tickets while persisting records in MySQL.`,
		related: [],
		tags: ["fsk-showers","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "fsk-showers",
	},
	{
		id: "fsk-showers-1-d8da7caa",
		title: "FSK Showers — Flask CRUD for roadside shower registrations — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Flask + MySQL CRUD app for logging shower registrations at a highway fuel station, with Spanish operator UI. |
| Audience | On-site operators and internal staff at the Uspallata-area facility; not a public consumer product. |`,
		related: [],
		tags: ["fsk-showers","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "fsk-showers",
	},
	{
		id: "fsk-showers-2-32f895a4",
		title: "FSK Showers — Flask CRUD for roadside shower registrations — P1 — Manual shower-use tracking at a remote facility",
		text: `### P1 — Manual shower-use tracking at a remote facility

- **Who hurts:** Highway fuel-station operators and attendants who must record when customers use paid shower facilities.
- **Pain today:** Paper logs or informal notes are hard to search, easy to lose, and do not tie cleanly to staff accountability or pricing plans.
- **How this repo answers:** Provides a minimal Flask web UI ( , , ) backed by a relational schema ( , , , , ) so each shower session can be recorded and later listed or removed from a central database.
- **Out of scope:** Payment processing, customer self-service portals, multi-site fleet management, reporting dashboards, or mobile-native apps.`,
		related: [],
		tags: ["fsk-showers","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "fsk-showers",
	},
	{
		id: "fsk-showers-3-aac27ab6",
		title: "FSK Showers — Flask CRUD for roadside shower registrations — P2 — Lightweight internal ops tooling without enterprise overhead",
		text: `### P2 — Lightweight internal ops tooling without enterprise overhead

- **Who hurts:** Small teams that need a database-backed registry but do not want a full ERP or POS integration for a single amenity (showers).
- **Pain today:** Generic tools are either too heavy or too unstructured; bespoke spreadsheets lack referential integrity across clients, plans, and staff.
- **How this repo answers:** Uses Flask, SQLAlchemy, and Docker Compose for MySQL to deliver a locally runnable CRUD stack with Bootstrap-styled forms and Spanish labels ( , , , ).
- **Out of scope:** Authentication/authorization UI, audit trails, automated backups, production hardening, and CI/CD pipelines (none present in tree).`,
		related: [],
		tags: ["fsk-showers","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "fsk-showers",
	},
	{
		id: "fsk-showers-4-0c9da57e",
		title: "FSK Showers — Flask CRUD for roadside shower registrations — 3. Product / idea",
		text: `## 3. Product / idea

The mental model is a **single-tenant operator console**: an attendant opens the site, creates a ticket linking a responsible staff member, a client, and a plan/price tier, then reviews or deletes entries from a table view. The domain schema anticipates normalized entities — users belong to roles, clients have name fields, plans carry prices, and tickets join those foreign keys — even though parts of the view layer still use simplified string fields from an earlier iteration. The UI is Spanish-first (navbar: , ; flash messages in Spanish). Page metadata in explicitly describes the app as a CRUD for shower use in Uspallata, anchoring the business context.`,
		related: [],
		tags: ["fsk-showers","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "fsk-showers",
	},
	{
		id: "fsk-showers-5-3ffaad90",
		title: "FSK Showers — Flask CRUD for roadside shower registrations — 3.1 North-star use cases",
		text: `### 3.1 North-star use cases

1. **Register shower use** — Operator navigates to Create, fills , , and optional , submits; record is persisted and user is redirected to the list with a success flash.
2. **Review today's registrations** — Operator opens List to see ticket ID, client, responsible party, and timestamp columns (intended; see open questions for model/template drift).
3. **Correct mistakes** — Operator deletes a row via the delete link on the list page.`,
		related: [],
		tags: ["fsk-showers","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "fsk-showers",
	},
	{
		id: "gdt-syv-0-08e71dfb",
		title: "Subordinación y Valor — simultaneous turn-based hex strategy in Godot 4.4.1 — Subordinación y Valor (SyV)",
		text: `## Subordinación y Valor (SyV)

> **Problem thesis (required):** Subordinación y Valor is a private Godot 4.4.1 project for a simultaneous turn-based strategy game on a multi-level hexagonal grid, set in a post-apocalyptic Argentina (2178). The player is not an omniscient puppeteer but a Commander in a static HQ, issuing orders over a radio chain that can fail, arrive late, or be intercepted. The repository's central engineering bet is an **authoritative headless Godot server** that shares GDScript with the client, enforces **per-player scope** for fog-of-war at the protocol layer, and runs a strict **Briefing → Orders → Resolution** turn cycle. At the time of this summary, the tree is overwhelmingly **design and specification** — twenty-four accepted ADRs, a full game manual, network protocol contracts, and premade squad data — with **no committed Godot source trees** ( , , ) yet on .`,
		related: [],
		tags: ["gdt-syv","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "gdt-syv",
	},
	{
		id: "gdt-syv-1-20d09580",
		title: "Subordinación y Valor — simultaneous turn-based hex strategy in Godot 4.4.1 — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Turn-based simultaneous hex strategy where command chains, radio interception, and moral degradation matter as much as positioning — built on an authoritative Godot headless backend. |
| Audience | Game designers and implementers on the SyV team; AI coding agents equipped with Godot and Notion backlog skills; future players once a playable prototype exists. Extended lore and world-building live in the separate companion repo. |`,
		related: [],
		tags: ["gdt-syv","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "gdt-syv",
	},
	{
		id: "gdt-syv-2-77771e12",
		title: "Subordinación y Valor — simultaneous turn-based hex strategy in Godot 4.4.1 — P1 — Command-and-control as gameplay, not UI chrome",
		text: `### P1 — Command-and-control as gameplay, not UI chrome

- **Who hurts:** Players and designers of military strategy games who want tension from **delegation, delay, and miscommunication** rather than perfect unit control.
- **Pain today:** Most RTS/TBS titles treat the player as a god with instant, lossless orders. SyV's design thesis is the opposite: orders travel as semantic messages through a hierarchical chain (L5 HQ → L4/L3 officers → L2 groups → L1 troops). Transmissions can fail, officers can die before relaying, and late orders execute literally on a battlefield that already changed. Generic orders to officers ("attack at all costs") trade Commander bandwidth for autonomous — and possibly disastrous — interpretation.
- **How this repo answers:** The series (especially chapters 06–09, 08, 12, 12b) and ADRs 015–018 formalize mando, communications, triangulation, order pools, generic orders, and Valor degradation. ADR-009 defines the five-level military hierarchy (Sección → Pelotón → Escuadra → Grupo → Tropa) with radio rules (L3+ carry E-UHF; L1/L2 do not, except the special Communications Troop). ADR-015 closes the tactical axis tying , , and triangulation to server-computed scope.
- **Out of scope:** Narrative canon, character biographies, and extended world geography — those belong to . This repo holds game mechanics and implementation contracts only.`,
		related: [],
		tags: ["gdt-syv","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "gdt-syv",
	},
	{
		id: "gdt-syv-3-278c4fa8",
		title: "Subordinación y Valor — simultaneous turn-based hex strategy in Godot 4.4.1 — P2 — Trustworthy multiplayer fog-of-war",
		text: `### P2 — Trustworthy multiplayer fog-of-war

- **Who hurts:** Multiplayer strategy developers who cannot rely on client-side filtering to hide enemy positions — any leaked state is exploitable.
- **Pain today:** Client-side fog-of-war is trivially bypassed by memory inspection or packet sniffing. Broadcasting full state and hiding it in UI is insecure.
- **How this repo answers:** ADR-005 mandates **scope server-side**: the server never serializes information outside a player's scope. Briefing messages ( ) are **individualized per peer** via — not a broadcast of the same packet. Enemy contacts appear only as opaque IDs with fidelity stamps ( , , ), never with true composition or morale. The directory is the auditable contract: every server→client message declares a **Nota de scope** clause. Triangulation intelligence (post–"El Fin de los Secretos" setting) is computed server-side and scoped per receiving player (ADR-015, ADR-020).
- **Out of scope:** Anti-cheat for modified clients beyond architectural non-leakage; matchmaking and player authentication (future production concerns per ).`,
		related: [],
		tags: ["gdt-syv","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "gdt-syv",
	},
	{
		id: "gdt-syv-4-185e3fe2",
		title: "Subordinación y Valor — simultaneous turn-based hex strategy in Godot 4.4.1 — P3 — Single codebase for client presentation and authoritative server",
		text: `### P3 — Single codebase for client presentation and authoritative server

- **Who hurts:** Small teams building turn-based multiplayer who would otherwise maintain parallel rule implementations (e.g., GDScript client + Python/Rust server) that inevitably diverge.
- **Pain today:** Split stacks double every rule change and multiply test surface. Hybrid proxy architectures add premature ops complexity.
- **How this repo answers:** ADR-003 commits to **Godot 4.4.1 headless** as the authoritative backend, sharing GDScript with the client. ADR-008 defines the intended layout: (rules, hex grid, units), (UI, rendering, input), (headless arbiter, turn resolution), (message contract). ADR-007 allows a listen-server prototype on localhost with ENet (ADR-006), migrating later to Steam Networking Sockets without renaming RPCs. Turn phases are discrete — the server is idle during the local Orders phase (ADR-004).
- **Out of scope:** Actual Godot project scaffolding on at summary time — directories are specified but not yet present in the clone. Containerized production deploy and Steam SDK integration are documented as future phase only.`,
		related: [],
		tags: ["gdt-syv","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "gdt-syv",
	},
	{
		id: "gdt-syv-5-61b4eef9",
		title: "Subordinación y Valor — simultaneous turn-based hex strategy in Godot 4.4.1 — 3. Product / idea",
		text: `## 3. Product / idea

SyV is a **two-player, simultaneous (WEGO)** hex strategy game. Each turn represents four hours of operations. Before the first turn, both players deploy forces simultaneously and hidden in their deployment zones; the server validates and only then starts the turn cycle. The mental model: **Briefing:** Server computes world state and delivers a **different payload per player** — own force in full, enemy only as detected contacts, map deltas visible to that player, command-chain coverage (BFS from HQ per ADR-009). **Orders:** Entirely local on each client. Undo/reset freely. One message closes the phase. **Resolution:** Server executes both players' validated orders in initiative order (ADR-012), streaming events per scoped peer. Cycle repeats until victory (ADR-014, manual chapter 11).`,
		related: [],
		tags: ["gdt-syv","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "gdt-syv",
	},
	{
		id: "gitcon-0-65876f44",
		title: "GITCon — GIC gym analytics console (Django shell + Oracle reporting scripts) — GITCon",
		text: `## GITCon

> **Problem thesis (required):** GITCon (internal project name **GICCon**) is a **private, early-2019 Python workspace** for gym/fitness-club (**GIC**) operations analytics. Its active code path is , which connects to a corporate **Oracle** database, runs against the session table, aggregates unique member card IDs per calendar session day (with a 10:00 boundary rule), and was designed to render **matplotlib** bar charts titled *Socios x Día*. Alongside that, the repo carries a **stock Django 2.2** project ( ) with an empty app stub and a committed virtualenv. The repository has had **no commits since May 2019**, contains **no README**, and stores **hardcoded database credentials** in source — treat it as a **legacy prototype**, not a deployable product.`,
		related: [],
		tags: ["gitcon","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "GITCon",
	},
	{
		id: "gitcon-1-76f3fee6",
		title: "GITCon — GIC gym analytics console (Django shell + Oracle reporting scripts) — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Internal gym-member analytics toolkit: Oracle SQL + pandas/matplotlib reporting, with an unused Django admin shell for future GIC web tooling. |
| Audience | Internal operators/analysts for a gym chain using Oracle-backed session tracking; original developer workstation paths suggest a single-maintainer dev setup. No agent harness or external consumer docs exist. |`,
		related: [],
		tags: ["gitcon","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "GITCon",
	},
	{
		id: "gitcon-2-5cd013e5",
		title: "GITCon — GIC gym analytics console (Django shell + Oracle reporting scripts) — P1 — Daily active-member visibility from Oracle session data",
		text: `### P1 — Daily active-member visibility from Oracle session data

- **Who hurts:** Gym managers and analysts who need to know how many distinct members (*socios*) actually used the facility, not just raw turnstile events or credit purchases in isolation.
- **Pain today:** Session data lives in Oracle ( ) with card IDs ( ), session start timestamps ( ), and credit flags ( ). Extracting a clean per-day unique-member count requires custom SQL, date-boundary logic, and post-processing outside the legacy application UI.
- **How this repo answers:** selects distinct card visits with credits in a date window (formatted via / placeholders). loads that SQL, queries Oracle through + , converts to datetime, assigns a **SESSION** date using a **10:00 cutoff** (sessions before 10:00 roll to the prior calendar day), groups by session, and counts unique (card IDs). Chart helpers and produce annotated bar charts with Spanish weekday abbreviations.
- **Out of scope:** Member billing, credit purchases, staff scheduling, real-time dashboards, or authenticated multi-user access. Chart calls are commented out in the main flow; the script currently prints the aggregated dataframe and calls .`,
		related: [],
		tags: ["gitcon","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "GITCon",
	},
	{
		id: "gitcon-3-3423ee3c",
		title: "GITCon — GIC gym analytics console (Django shell + Oracle reporting scripts) — P2 — PDF chart prototyping for reports",
		text: `### P2 — PDF chart prototyping for reports

- **Who hurts:** Someone exploring printable gym reports mixing narrative text and charts.
- **Pain today:** Matplotlib alone does not produce polished PDF documents with embedded vector charts and legends in a single pipeline.
- **How this repo answers:** demonstrates **ReportLab** flowables with an inline pie chart, legend, and before/after paragraphs. A sample output artifact is committed as evidence of a successful run (April 2019 timestamp in PDF metadata).
- **Out of scope:** Production report templates, scheduled PDF generation, or integration with live Oracle data — the example uses static numeric data only.`,
		related: [],
		tags: ["gitcon","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "GITCon",
	},
	{
		id: "gitcon-4-71537a33",
		title: "GITCon — GIC gym analytics console (Django shell + Oracle reporting scripts) — P3 — Django namespace for future GIC web console",
		text: `### P3 — Django namespace for future GIC web console

- **Who hurts:** A developer who wants a conventional Django project layout ready for future gym admin features.
- **Pain today:** Without a project skeleton, ad-hoc scripts lack a path toward authenticated web UIs, migrations, or admin CRUD.
- **How this repo answers:** + provide a standard Django 2.2 project (per settings header) with SQLite, debug mode, and routing. A app directory exists with empty , , and .
- **Out of scope:** The app is **not registered** in , has no models, no URL includes, and no templates — the Django layer is a **non-functional scaffold**.`,
		related: [],
		tags: ["gitcon","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "GITCon",
	},
	{
		id: "gitcon-5-7403032e",
		title: "GITCon — GIC gym analytics console (Django shell + Oracle reporting scripts) — 3. Product / idea",
		text: `## 3. Product / idea

The **central idea** is a two-track workspace for **GIC** (gym) data work: 1. **Analytics track ( )** — pull member-session facts from Oracle, reshape them in pandas, visualize attendance in matplotlib (and experiment with ReportLab PDFs). 2. **Web track ( + )** — reserve a Django project name and app slot for future gym tooling, currently untouched beyond / boilerplate. The mental model is **read-mostly analytics against a legacy Oracle schema**, with optional local Django experimentation on SQLite. There is no unified service boundary: scripts run standalone; Django runs separately via or .`,
		related: [],
		tags: ["gitcon","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "GITCon",
	},
	{
		id: "harness-triage-party-0-9ba385c2",
		title: "harness-triage-party — Kimi-native triage-and-fix agent party — harness-triage-party",
		text: `## harness-triage-party

> **Problem thesis (required):** This repository is the single source of truth for **kdx-kimi-triage-and-fix** — a Kimi-native port of the Claude Code triage-and-fix workflow. It solves three intertwined pains: (1) Kimi has no Workflow runtime, so reliability must come from a deterministic skill playbook, closed YAML contracts, and tool-grant enforcement in agent definitions; (2) GitHub cannot express PR merge ordering, so work that builds on unmerged PRs needs a labels-only REQUIREMENT system with transitive defer cascade; (3) real issues often span disjoint file sets that should be built in parallel by role-specialized agents (backend, frontend, devops, design) with doctrine review before any code is written.`,
		related: [],
		tags: ["harness-triage-party","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "harness-triage-party",
	},
	{
		id: "harness-triage-party-1-7df76086",
		title: "harness-triage-party — Kimi-native triage-and-fix agent party — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | The Kimi-native triage-and-fix party: eighteen agent cast definitions, one orchestration skill, and a Python CLI that manages PR requirement labels and defer cascades. |
| Audience | Operators running Kimi Code CLI against kodexArg repos; the main Kimi agent executing the skill; developers vendoring the optional GitHub Actions cascade workflow. |`,
		related: [],
		tags: ["harness-triage-party","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "harness-triage-party",
	},
	{
		id: "harness-triage-party-2-bc06f655",
		title: "harness-triage-party — Kimi-native triage-and-fix agent party — P1 — No deterministic Workflow runtime on Kimi",
		text: `### P1 — No deterministic Workflow runtime on Kimi

- **Who hurts:** Teams that already run on Claude Code and want the same end-to-end issue-to-PR pipeline on Kimi Code CLI.
- **Pain today:** Claude's Workflow runtime enforces phase order, branching, and structured outputs. Kimi exposes dispatch and resume but no schema-enforced subagent output — orchestration would otherwise drift into prose improvisation.
- **How this repo answers:** The skill is the script: the main agent follows fixed phases (forest → tavern → camp → stalking → plaza) with explicit quick exits. Each node declares a closed YAML output contract as its final message; the main agent parses typed fields and branches. Tool grants in frontmatter ( means zero tools) enforce what nodes can and cannot do — "a grant is a claim; a prompt is a wish." is the node spec SSOT.
- **Out of scope:** A hosted workflow engine, Kimi product changes, or automatic tier enforcement beyond dispatch-time pins and optional in config.`,
		related: [],
		tags: ["harness-triage-party","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "harness-triage-party",
	},
	{
		id: "harness-triage-party-3-94841b6b",
		title: "harness-triage-party — Kimi-native triage-and-fix agent party — P2 — PR dependency and defer propagation on GitHub",
		text: `### P2 — PR dependency and defer propagation on GitHub

- **Who hurts:** Anyone stacking PRs where later work assumes an unmerged prerequisite, or issues that declare in the body.
- **Pain today:** GitHub has no first-class merge ordering. When a prerequisite PR is labeled or closed unmerged, dependent PRs can remain open and look mergeable while their ground is gone.
- **How this repo answers:** Labels-only contract: on a PR means "must not merge before PR #N"; means the hunt is off. implements , , , , and using and Python stdlib. The hunter checks issue-side at intake; the mage sets and in the plan; the bard declares labels at publish and runs cascade on deferral. vendors an Actions trigger for human-side defers.
- **Out of scope:** Branch protection rules, merge queues, or parsing requirement declarations from PR comment text (the label is the machine contract).`,
		related: [],
		tags: ["harness-triage-party","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "harness-triage-party",
	},
	{
		id: "harness-triage-party-4-06798142",
		title: "harness-triage-party — Kimi-native triage-and-fix agent party — P3 — Parallel, role-aware builds with governance gates",
		text: `### P3 — Parallel, role-aware builds with governance gates

- **Who hurts:** Issues that touch backend, frontend, infra, and cosmetic surfaces in one hunt — a single generic builder cannot split work cleanly or enforce path-disjoint parallel slices.
- **Pain today:** A two-way backend/frontend split is too coarse; unreviewed plans reach builders; secrets can slip into diffs; code review conflates intent with legibility.
- **How this repo answers:** The mage (or sorcerer for ) emits with path-disjoint file sets, each assigned to a camp specialist ( , , , , , ). Builders create their own git worktrees and branches from . The inquisitor reviews the plan against PRD and ADRs before camp (up to two resume loops). The priest scans the combined diff for secrets with zero tools. The shadow performs a blind legibility review with zero tools. The bard merges slice branches into one PR.
- **Out of scope:** Post-bard hooks (guardian, verifier, smoke-test pause), shadow-to-builder retry loops, and priest appeal paths — noted as open in .`,
		related: [],
		tags: ["harness-triage-party","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "harness-triage-party",
	},
	{
		id: "harness-triage-party-5-1fb37007",
		title: "harness-triage-party — Kimi-native triage-and-fix agent party — 3. Product / idea",
		text: `## 3. Product / idea

The repository is not an application server — it is an **agent harness**: markdown cast definitions plus one skill playbook plus a small GitHub automation CLI. After installation (cast paths registered in Kimi , skill on the path the operator uses), a human or main agent can run **one GitHub issue end to end** through a fixed party: The **main Kimi agent is the script** — there is no separate runtime process. Determinism lives in phase order, closed enums in YAML contracts, and tool allowlists. Fiction (Spanish flavor lines, prey names) is a closed render for humans; nodes never produce or consume it. Model tiers are pinned at dispatch: mage and inquisitor on ; sorcerer on for trivial hunts; familiars on cheapest ; heavy camp pair ( , ) on k3-256k. Builders inherit the caller's model unless explicitly pinned.`,
		related: [],
		tags: ["harness-triage-party","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "harness-triage-party",
	},
	{
		id: "home-hyprland-0-4ee69bef",
		title: "home-hyprland — Hyprland desktop bundle for debian-sid dual-session — home-hyprland",
		text: `## home-hyprland

> **Problem thesis (required):** This private repository is the version-controlled source of truth for a **Hyprland 0.55** desktop experiment on **debian-sid**, running alongside GNOME as a GDM-selectable dual session. It solves the gap between “I want a custom tiling Wayland session” and “I need it to survive real hardware”: dual NVIDIA + amdgpu outputs, portrait + landscape layout, supervised AGS bar widgets, capture/recording helpers, monitor-heal after sleep, and an agent skill so AI assistants edit live config safely. GNOME stays the daily driver; this bundle is the reproducible, syncable artifact for the Hyprland path only.`,
		related: [],
		tags: ["home-hyprland","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "home-hyprland",
	},
	{
		id: "home-hyprland-1-c7bd18d5",
		title: "home-hyprland — Hyprland desktop bundle for debian-sid dual-session — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Hyprland config for debian-sid (GNOME dual-session experiment) — Lua compositor config, AGS 3.1 bar, helper scripts, wallpapers, Kitty profile, and agent skill snapshot. |
| Audience | Primary operator (kodex) on the target workstation; AI agents via ; anyone syncing Hyprland session files to , , and . |`,
		related: [],
		tags: ["home-hyprland","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "home-hyprland",
	},
	{
		id: "home-hyprland-2-faa44ced",
		title: "home-hyprland — Hyprland desktop bundle for debian-sid dual-session — P1 — Reproducible Hyprland session without abandoning GNOME",
		text: `### P1 — Reproducible Hyprland session without abandoning GNOME

- **Who hurts:** A single-user workstation that wants Hyprland for experimentation (tiling, custom bar, GPU-heavy local LLM UI) but relies on GNOME for the primary daily workflow.
- **Pain today:** Dotfiles scattered across , ad-hoc copies, no git history, and risk of forcing globally or breaking GDM session selection.
- **How this repo answers:** Bundles , , , , , and with documented sync commands ( , , optional symlink). Hyprland starts only when chosen at GDM; autostart chain is explicit in ( , , , Kitty, anyrun daemon). Agent skill encodes stance: never force desktop env globally, prefer Lua over legacy hyprlang, reload vs full restart rules.
- **Out of scope:** Replacing GNOME, removing GNOME packages, installing unaudited third-party rices, or making Hyprland the only session.`,
		related: [],
		tags: ["home-hyprland","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "home-hyprland",
	},
	{
		id: "home-hyprland-3-0b7e5211",
		title: "home-hyprland — Hyprland desktop bundle for debian-sid dual-session — P2 — Dual-GPU + dual-monitor Hyprland stability",
		text: `### P2 — Dual-GPU + dual-monitor Hyprland stability

- **Who hurts:** Operators on NVIDIA (card0) + amdgpu (card1) with landscape primary on one GPU and portrait on another — a layout prone to EGL import failures, phantom cursors, blanked panels after idle, and broken CRTC after DPMS.
- **Pain today:** Default Hyprland/NVIDIA env vars insufficient; automatic DPMS blanks both panels; batching two calls races DRM page-flip; layer-shell clients (hyprpaper, AGS bar) keep stale geometry after scale changes; AGS dies after monitor storms unless supervised.
- **How this repo answers:** sets , , NVIDIA VA-GLX env, cursor policy (hardware cursors + CPU buffer, default monitor on portrait). disables automatic DPMS listeners; wake runs . implements hard rules (never DPMS portrait, sequential modesets, soft-hotplug). toggles portrait scale 1.0 ↔ 1.5 with settle delay and layer resync. restarts AGS with . Super+Shift+O binds manual heal.
- **Out of scope:** General NVIDIA driver support for all distros; single-GPU simplified layouts; automatic DPMS on portrait without ADR-level review.`,
		related: [],
		tags: ["home-hyprland","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "home-hyprland",
	},
	{
		id: "home-hyprland-4-11353b42",
		title: "home-hyprland — Hyprland desktop bundle for debian-sid dual-session — P3 — Desktop affordances on an AGS bar (no GNOME session)",
		text: `### P3 — Desktop affordances on an AGS bar (no GNOME session)

- **Who hurts:** Hyprland session users who lose GNOME’s idle inhibit, volume UI, and quick access to host services (local LLM API) when the bar is custom.
- **Pain today:** is a no-op without gnome-session; stock GTK scales break on layer-shell + GSK GL; audio topology on this host maps HDMI to headphones and motherboard jack to speakers — not discoverable from generic widgets.
- **How this repo answers:** AGS bar on portrait only ( , ). **Caffeine** ( ): FSM driving for idle/sleep block. **Local LLM** ( ): scans host GGUF dir, writes selection file, manages , readiness via OpenAI-compatible probe, VRAM header via , 90s load timeout for 8 GB GPU. **Volume**: custom gesture track (not ) + WirePlumber endpoint classification for speakers/mute/headphones cycle. **Bar mode**: always → temp → hidden with edge peek and Super+B / IPC. Helper scripts cover screenshots ( + ), recording ( ), reveal-all windows, screen share ( ).
- **Out of scope:** Packaging local-llm itself (lives under host ); voice stack (dictation/live binds commented paused in ); capture toggle panel in bar (commented since 2026-07-17 — Print keybinds handle capture).`,
		related: [],
		tags: ["home-hyprland","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "home-hyprland",
	},
	{
		id: "home-hyprland-5-e3226ef7",
		title: "home-hyprland — Hyprland desktop bundle for debian-sid dual-session — 3. Product / idea",
		text: `## 3. Product / idea

The repository is a **desktop configuration bundle**, not an application server. Mental model: clone or sync → copy zones to live XDG paths → start Hyprland from GDM → compositor loads Lua config → autostart chain brings wallpaper, idle daemon, supervised AGS, terminal, launcher daemon → bar exposes host-integrated controls → shell scripts extend OS-level actions (capture, record, heal, zoom, share). Architecture narrative: Hyprland uses **dwindle** layout, **SUPER** mod, orange kdx border theme, gaps 5, blur/shadow decorations, custom animation curves, special workspace , and extensive media key binds via / / .`,
		related: [],
		tags: ["home-hyprland","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "home-hyprland",
	},
	{
		id: "kcbd-monitor-0-66d7990e",
		title: "kcbd-monitor — IoT indoor environment time-series monitoring (Astro + Django DRF) — kcbd-monitor",
		text: `## kcbd-monitor

> **Problem thesis (required):** kcbd-monitor exists to replace a production legacy indoor-environment monitoring system with a **decoupled, secure, headless architecture** that continuously ingests IoT sensor readings (temperature, humidity, light, substrate), stores them as durable time series grouped by cultivation room, and surfaces live dashboards plus historical charts — including derived agronomic indicators like Vapor Pressure Deficit (VPD) — so growers and technicians can see whole-facility state at a glance, spot drifts before crop damage, and trust that only authorized devices can write data. The refactor preserves the legacy domain logic while eliminating the monolith's security and scalability risks.`,
		related: [],
		tags: ["kcbd-monitor","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kcbd-monitor",
	},
	{
		id: "kcbd-monitor-1-bd4fc55e",
		title: "kcbd-monitor — IoT indoor environment time-series monitoring (Astro + Django DRF) — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Full-stack refactor of dj-indoor-monitor: headless Django REST API + Astro static frontend for IoT environmental time-series monitoring in controlled cultivation spaces. |
| Audience | Growers/operators (dashboard consumers), technicians/installers (sensor catalog), Raspberry Pi field devices (ingest clients), system admins (infra/CI), AI coding agents (extensive SSOT docs and ADRs). |`,
		related: [],
		tags: ["kcbd-monitor","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kcbd-monitor",
	},
	{
		id: "kcbd-monitor-2-ff07d5fc",
		title: "kcbd-monitor — IoT indoor environment time-series monitoring (Astro + Django DRF) — P1 — No centralized, continuous environmental visibility",
		text: `### P1 — No centralized, continuous environmental visibility

- **Who hurts:** Indoor cultivation operators managing multiple rooms with heterogeneous Raspberry Pi sensor devices.
- **Pain today:** Without a centralized system, operators rely on spot checks, handheld meters, or memory — missing gradual drifts, catching problems only after visual plant stress, and lacking historical evidence for post-mortems or cycle planning.
- **How this repo answers:** Authenticated high-frequency ingestion stores every reading in a PostgreSQL time-series table. A public endpoint exposes the most recent value per (sensor, metric) pair for wall-display dashboards; authenticated endpoints serve history, resampled charts, room/sensor catalogs, and on-the-fly VPD. The Astro frontend polls these endpoints and renders gauges, traffic-light banding, and echarts time-series client-side.
- **Out of scope:** Actuation/control of HVAC or irrigation; agronomic prescriptions; real-time WebSocket push (MVP uses polling); multi-tenant SaaS.`,
		related: [],
		tags: ["kcbd-monitor","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kcbd-monitor",
	},
	{
		id: "kcbd-monitor-3-5a923bad",
		title: "kcbd-monitor — IoT indoor environment time-series monitoring (Astro + Django DRF) — P2 — Legacy monolith security and coupling",
		text: `### P2 — Legacy monolith security and coupling

- **Who hurts:** The organization running the legacy dj-indoor-monitor system and anyone depending on trustworthy sensor data.
- **Pain today:** The legacy stack coupled Django templates, HTMX, and server-side Plotly chart rendering in one deployable unit. It carried documented risks: unauthenticated ingestion, database ports exposed broadly, secrets in server env files, and manual EC2 deploys without reproducible CI/CD.
- **How this repo answers:** Strict separation — static Astro site on Amplify Hosting talks cross-origin to a headless DRF API on ECS Fargate behind an ALB. Ingestion requires a static Bearer token; operator reads use per-user DRF Token auth with Django Groups ( / ). Only and health probes are anonymously reachable, enforced at both DRF permission layer and ALB path rules (ADR-009). Credentials live in AWS Secrets Manager, never in the repo.
- **Out of scope:** Decommissioning or modifying the legacy EC2 deployment (explicitly left untouched in sa-east-1).`,
		related: [],
		tags: ["kcbd-monitor","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kcbd-monitor",
	},
	{
		id: "kcbd-monitor-4-b3a4a045",
		title: "kcbd-monitor — IoT indoor environment time-series monitoring (Astro + Django DRF) — P3 — Time-series visualization at scale without choking the API",
		text: `### P3 — Time-series visualization at scale without choking the API

- **Who hurts:** Operators requesting multi-day charts and the backend serving a ~7 GB readings table migrated from legacy TimescaleDB.
- **Pain today:** Raw point dumps would overwhelm browsers and API memory; the legacy system used TimescaleDB hypertables and server-side Plotly rendering.
- **How this repo answers:** Historical reads use pandas-based server-side resampling in via — one sensor per request, configurable timeframe buckets ( through ), optional min/max/mean/first/last aggregations, ~120-point display target, 7-day window cap, and admin-editable safety caps ( , ) stored in . Out-of-range values are filtered on read per metric catalog in . Chart rendering moved entirely to the browser via echarts Svelte islands.
- **Out of scope:** TimescaleDB or other proprietary time-series extensions (deliberately plain PostgreSQL on RDS); server-side chart image generation.`,
		related: [],
		tags: ["kcbd-monitor","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kcbd-monitor",
	},
	{
		id: "kcbd-monitor-5-8ae78451",
		title: "kcbd-monitor — IoT indoor environment time-series monitoring (Astro + Django DRF) — 3. Product / idea",
		text: `## 3. Product / idea

kcbd-monitor is the **greenfield rewrite** of the ALVS indoor monitoring product. Physical Raspberry Pi devices report single-character metric codes ( temperature, humidity, light, substrate) with float values and timestamps. The backend stores these as rows where is a free string (not a foreign key) for write efficiency; room membership resolves on-read by crossing with the catalog table linked to entities. The mental model is **three runtime tiers plus edge devices**: 1. **Sensor clients** — periodic HTTPS batches to with Bearer ingest auth. 2. **Headless API** — Django 6 + DRF on ECS Fargate, PostgreSQL on shared ALVS RDS, Django admin for low-frequency catalog/config CRUD. 3. **Static frontend** — Astro 7 builds to static HTML/JS; Svelte 5 islands handle interactivity (charts, polling, login, shadcn-svelte UI). Deployed via Amplify; refreshes data by visibility-aware polling, not WebSockets. Both dev and prod environments are live. The legacy system continues in parallel until a planned pg_dump migration cutover (documented in §6). Current project phase is **2B — frontend implemented, gap-closing**: all 12 API endpoints ship; the Astro app has eight routes and 442 Vitest tests; active work is visual polish, sensor grouping, and closing remaining gap-list features rather than initial scaffolding.`,
		related: [],
		tags: ["kcbd-monitor","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kcbd-monitor",
	},
	{
		id: "kdx-ng-coveris-docs-0-dec5db09",
		title: "Coveris Documentation Portal — Angular docs site and QA harness — kdx-ng-coveris-docs",
		text: `## kdx-ng-coveris-docs

> **Problem thesis (required):** This private repository is the **documentation and quality-assurance companion** for Coveris — a healthcare capacity-planning SaaS for private clinics. It solves two intertwined pains: (1) product and architecture knowledge for Coveris (PRD, 19+ ADRs, API SSOT, stack guides, AI agent registry) must be **published in one browsable, bilingual portal** that agents and humans can navigate by section; and (2) **repeatable QA audits** (security, accessibility, performance, SEO, compliance, operations) need shared scripts, scoring rules, and report templates. The Angular app in is the reader and design-system showcase; the Python scripts and at repo root are the audit harness. The markdown vault under describes the **full Coveris product** (Angular + Django + PostgreSQL on AWS), not only this docs repo.`,
		related: [],
		tags: ["kdx-ng-coveris-docs","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "kdx-ng-coveris-docs",
	},
	{
		id: "kdx-ng-coveris-docs-1-6095f63a",
		title: "Coveris Documentation Portal — Angular docs site and QA harness — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Private Coveris documentation portal (bilingual markdown browser + PrimeNG showcase) bundled with a senior-QA audit toolkit and agent skill lockfile. |
| Audience | Coveris developers, technical writers, AI coding agents ( , , , ), and QA engineers running structured audits against Coveris or related frontends. |`,
		related: [],
		tags: ["kdx-ng-coveris-docs","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "kdx-ng-coveris-docs",
	},
	{
		id: "kdx-ng-coveris-docs-2-175c091f",
		title: "Coveris Documentation Portal — Angular docs site and QA harness — P1 — Fragmented Coveris product knowledge",
		text: `### P1 — Fragmented Coveris product knowledge

- **Who hurts:** Engineers, product owners, and AI agents implementing or reviewing Coveris ( and related repos) need a single authoritative narrative for capacity planning domain logic, API contracts, and architectural decisions.
- **Pain today:** Knowledge lived across predecessor projects (SDGD v2, Coveris v4 spec), markdown files, and mental models. ADRs, PRD sections, and API.md could drift from implementation. Agents lacked a structured, sectioned docs tree with stable doc IDs.
- **How this repo answers:** Ships a curated markdown corpus (~44 files per locale) under , registered in with seven navigation sections (Overview, API Contract, ADRs, Tech Stack, Development, Production, AI & Tooling). An Angular 21 SPA loads markdown via HTTP, strips YAML frontmatter, renders with , and exposes EN/ES language toggle. is explicitly the SSOT for HTTP between Angular frontend and Django backend. Nineteen ADRs document conventions, stacks, auth, FSM rules, design system, and business logic.
- **Out of scope:** This repo does **not** implement the Coveris backend, database, or production deployment of the SaaS app itself. It documents and showcases; implementation lives in sibling application repos.`,
		related: [],
		tags: ["kdx-ng-coveris-docs","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "kdx-ng-coveris-docs",
	},
	{
		id: "kdx-ng-coveris-docs-3-093d9d93",
		title: "Coveris Documentation Portal — Angular docs site and QA harness — P2 — Inconsistent QA audit methodology",
		text: `### P2 — Inconsistent QA audit methodology

- **Who hurts:** QA engineers and agents tasked with pre-release quality gates on Coveris or similar Angular/marketing sites.
- **Pain today:** Ad-hoc checklists, non-reproducible findings, no shared severity taxonomy or weighted scoring, and manual report assembly.
- **How this repo answers:** Root defines a **10-area audit framework** (Security/OWASP, Accessibility/WCAG 2.2 AA, Performance/Core Web Vitals, SEO, Code Quality, Functional Testing, Dependencies, Compliance/GDPR, Operations/CI, Framework-Specific). Finding ID prefixes ( , , …), severity levels, evidence requirements, and a weighted scoring formula produce READY / READY WITH RESERVES / NOT READY verdicts. Nine Python scripts in automate HTTP security scans, link checks, SEO audits, dependency audits, operations checks, browser auth tests, finding extraction, test generation, and HTML report compilation via . pins third-party agent skills ( , ) for intake and browser workflows.
- **Out of scope:** Scripts are utilities for authorized audits; they do not modify target sites. Reports directory and cloned target repos are gitignored. No CI workflow is checked into this repo.`,
		related: [],
		tags: ["kdx-ng-coveris-docs","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "kdx-ng-coveris-docs",
	},
	{
		id: "kdx-ng-coveris-docs-4-6061ce12",
		title: "Coveris Documentation Portal — Angular docs site and QA harness — P3 — Design system discoverability for Coveris UI",
		text: `### P3 — Design system discoverability for Coveris UI

- **Who hurts:** Frontend developers adopting PrimeNG Lara with Coveris-specific theme tokens (Noir primary on Zinc surface).
- **Pain today:** ADR-012 mandates PrimeNG as the sole design system, but developers need live examples of buttons, forms, data tables, overlays, and advanced patterns without spelunking production screens.
- **How this repo answers:** route tree with 14 lazy-loaded showcase pages (colors, typography, buttons, forms, data, feedback, layout, overlays, menus, widgets, advanced variants). centralizes the KDX preset (Lara + Noir + Zinc). Component naming and accessibility rules are cross-referenced in ADR-012 and ADR-013 within the docs vault.
- **Out of scope:** Not a Storybook replacement for arbitrary third-party projects; scoped to Coveris/KDX PrimeNG patterns.`,
		related: [],
		tags: ["kdx-ng-coveris-docs","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "kdx-ng-coveris-docs",
	},
	{
		id: "kdx-ng-coveris-docs-5-c98f1aee",
		title: "Coveris Documentation Portal — Angular docs site and QA harness — 3. Product / idea",
		text: `## 3. Product / idea

The repository is a **two-layer artifact**: 1. **Documentation browser ( )** — A client-side Angular 21 application that serves static markdown from and renders it inside a PrimeNG shell with sidebar navigation, mobile drawer, skip links, and bilingual toggle. Hash-based routing ( ) supports static hosting. Default landing redirects to (“How Coveris Works”), a conceptual guide for non-technical readers explaining the coverage equation and organizational layers. 2. **QA harness (repo root)** — Operational reference ( ) plus Python scripts invoked with (inline PEP 723 dependencies). The full audit workflow spans intake → Brave CDP browser check → recon → ten parallel audit agents → terminal score table → optional HTML report. The **Coveris product** documented inside this portal is a SaaS **capacity planning platform for private clinics** (20–100 employees, multiple services). It replaces spreadsheet chaos when answering four staffing questions in real time: who has available hours, who holds required certifications, whether assignment triggers overtime, and post-assignment service coverage. The domain model centers on three pillars — **Demand** (org-unit tree with positions and required weekly hours), **Supply** (employees with contracts, tags, and lifecycle FSM), and **Bridge** (assignments linking people to positions with preview and balance math).`,
		related: [],
		tags: ["kdx-ng-coveris-docs","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "kdx-ng-coveris-docs",
	},
	{
		id: "kdx-ng-template-0-b89390fa",
		title: "kdx-ng-template — Angular 21 CSR + Django 5.2 DRF SaaS blueprint — kdx-ng-template",
		text: `## kdx-ng-template

> **Problem thesis (required):** kdx-ng-template is an **opinionated full-stack blueprint** — not a throwaway boilerplate — for building client-side-rendered SaaS applications with Angular 21 and Django 5.2 DRF. It exists because every new SaaS product otherwise re-decides the same painful questions: which state library, which form API, how frontend and backend agree on HTTP shapes, how auth works in dev vs production, and how to deploy CSR Angular on AWS without drifting into SSR complexity. The repo encodes those decisions in working code, human docs, as the HTTP contract SSOT, and a fleet of AI skills that force agents to produce identical patterns. Clone it, run Docker Compose + , and you immediately have cookie-based JWT auth, GDPR endpoints, seeded mock users, a PrimeNG design-system showcase, and a reference app to copy for new domains.`,
		related: [],
		tags: ["kdx-ng-template","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kdx-ng-template",
	},
	{
		id: "kdx-ng-template-1-386950b3",
		title: "kdx-ng-template — Angular 21 CSR + Django 5.2 DRF SaaS blueprint — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Opinionated Angular 21 CSR + Django 5.2 DRF SaaS blueprint with PrimeNG, signals, API-first contracts, and AI skills that enforce one way to build. |
| Audience | Internal developers and AI coding agents scaffolding new SaaS products on the kodexArg AWS stack; DevOps engineers targeting Amplify + App Runner + RDS; backend engineers extending DRF apps; frontend engineers building signal-native Angular features. |`,
		related: [],
		tags: ["kdx-ng-template","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kdx-ng-template",
	},
	{
		id: "kdx-ng-template-2-0768f980",
		title: "kdx-ng-template — Angular 21 CSR + Django 5.2 DRF SaaS blueprint — P1 — Repeated full-stack architectural indecision",
		text: `### P1 — Repeated full-stack architectural indecision

- **Who hurts:** Teams starting new SaaS products; tech leads who must keep multiple apps consistent; AI agents that otherwise invent incompatible patterns per session.
- **Pain today:** Angular ecosystems tempt teams toward NgRx, TanStack Query, Reactive Forms, Material, or SSR — each choice multiplies learning cost and fragments codebases. Django backends sprawl without a documented API contract. Every greenfield project spends weeks on auth, CORS, cookie strategy, and folder layout before shipping domain features.
- **How this repo answers:** Every major decision is pre-made and documented. The README explicitly rejects NgRx, NGXS, TanStack Query, Reactive Forms, Angular Material, SSR, and NgModules. Angular 21 native primitives ( , , Signal Forms, / ) are the only approved patterns. forbids proposing alternatives. Ten canonical skills in (symlinked from ) encode component, signal, form, HTTP, routing, API-first, and design-system rules. – provide human-readable guides mirroring the same constraints.
- **Out of scope:** Being a finished product — it is a scaffold. Multi-tenancy, real-time collaboration, OAuth social login, 2FA, email notifications, and RBAC beyond are explicitly deferred in examples.`,
		related: [],
		tags: ["kdx-ng-template","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kdx-ng-template",
	},
	{
		id: "kdx-ng-template-3-f16259b9",
		title: "kdx-ng-template — Angular 21 CSR + Django 5.2 DRF SaaS blueprint — P2 — Frontend/backend contract drift",
		text: `### P2 — Frontend/backend contract drift

- **Who hurts:** Full-stack developers; frontend engineers blocked on undocumented API responses; reviewers catching serializer ↔ TypeScript mismatches late.
- **Pain today:** DRF browsable API and ad-hoc docstrings diverge from what Angular services expect. Endpoints get coded before the contract is agreed, causing rework and brittle tests.
- **How this repo answers:** at repo root is the **single source of truth** for all HTTP communication. and the skill enforce: document in first, then implement DRF views and Angular services. maps user stories to sections rather than duplicating endpoint specs. adds DRF design rules. The workflow is: branch → update → backend model/serializer/viewset/URLs/tests → frontend service/component/routes/tests.
- **Out of scope:** Auto-generated OpenAPI client codegen is not wired; contract discipline is procedural via skills and docs, not CI-gated yet.`,
		related: [],
		tags: ["kdx-ng-template","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kdx-ng-template",
	},
	{
		id: "kdx-ng-template-4-2795c62f",
		title: "kdx-ng-template — Angular 21 CSR + Django 5.2 DRF SaaS blueprint — P3 — Slow time-to-first-feature on a new SaaS stack",
		text: `### P3 — Slow time-to-first-feature on a new SaaS stack

- **Who hurts:** Developers who need to build UI against real API responses on day one; QA needing login flows and test users immediately.
- **Pain today:** Backend and frontend teams wait on each other; empty databases block realistic development; local setup spans Node, Python, Postgres, and env files with unclear defaults.
- **How this repo answers:** brings up PostgreSQL 16 and the Django API with hot-reload Uvicorn. auto-runs migrations, creates a superuser from env vars, and seeds mock users via . Frontend proxies to the backend. Shipped features include login, dashboard (protected), auth guard/interceptor/service (signal-based), 404 page, lazy routes, cookie consent, legal pages, pricing showcase, and a full PrimeNG design-system showcase at . Developers log in against seeded data and extend as the reference DRF pattern.
- **Out of scope:** Production migration governance — README admits unreviewed migrations hitting production RDS is **not solved** and requires a future CI/CD gate with senior DevOps/backend review.`,
		related: [],
		tags: ["kdx-ng-template","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kdx-ng-template",
	},
	{
		id: "kdx-ng-template-5-93efb3ec",
		title: "kdx-ng-template — Angular 21 CSR + Django 5.2 DRF SaaS blueprint — 3. Product / idea",
		text: `## 3. Product / idea

kdx-ng-template is a **monorepo blueprint** with two deployable surfaces and one contract file: The mental model is **decisions over files**. Cloning gives you a working auth vertical slice plus conventions for every future feature. New domain work follows the app pattern: custom model → serializer → class-based views → URL includes → pytest coverage → Angular feature folder with lazy routes. Frontend organization ( ): - — guards ( , ), functional interceptors ( , ), with signal state, title strategy, selective preloading, global error handler. - — authenticated and public with PrimeNG Menubar. - — lazy feature areas ( , ). - — login card and login page. - — design-system gallery (colors, typography, forms, data tables, overlays, etc.). - — reusable widgets ( , , ). - — privacy and terms pages. Backend organization ( ): - — split settings ( , , ), ASGI, URL routing, security middleware ( , , ). - — custom model (UUID , email login, soft-delete via ), cookie JWT authentication, login/logout/refresh/me/account-delete/export endpoints, admin, management commands ( , ), comprehensive pytest suite. Auth uses **httpOnly cookies** (not headers). Angular sends ; the browser attaches and cookies. calls which hydrates from with refresh retry. Production target uses for cross-origin Amplify ↔ App Runner; local dev uses .`,
		related: [],
		tags: ["kdx-ng-template","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kdx-ng-template",
	},
	{
		id: "kodexarg-com-0-19d262d6",
		title: "kodexarg.com — personal liminal home site — kodexarg.com",
		text: `> **Problem thesis (required):** This repository is the kodexArg personal home site — a deliberately sparse, full-viewport canvas that ships almost no JavaScript by default, uses Svelte islands only where interactivity is justified, and deploys to Cloudflare Workers with static assets. It solves the need for a fast, agent-maintainable personal landing page with a terminal-style console, generative atmosphere, and links into sibling properties (CV, design system), while also hosting static design documents for the Subordinación y Valor (SyV) tabletop RPG character-creation system.`,
		related: [],
		tags: ["kodexarg.com","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kodexarg.com",
	},
	{
		id: "kodexarg-com-1-6c0e2d35",
		title: "kodexarg.com — personal liminal home site — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Personal liminal home: Astro static pages + Svelte 5 islands on Cloudflare Workers, bun-only toolchain, candlelit dark aesthetic. |
| Audience | kodexArg (owner), coding agents maintaining the site, visitors to the live home, and internal readers of SyV RPG design docs hosted as static pages. |`,
		related: [],
		tags: ["kodexarg.com","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kodexarg.com",
	},
	{
		id: "kodexarg-com-2-5de88e52",
		title: "kodexarg.com — personal liminal home site — P1 — Personal home without SPA bloat",
		text: `### P1 — Personal home without SPA bloat

- **Who hurts:** A solo operator who wants a distinctive personal presence on the web without shipping a heavy client bundle or maintaining a CMS.
- **Pain today:** Typical personal sites either look generic (template blogs) or require large JavaScript frameworks for small interactive touches. Rebuilds also tend to accumulate legacy patterns (Svelte 4, Pages-based deploys) that agents and humans must untangle later.
- **How this repo answers:** Astro 6 file-based routing keeps pages as zero-JS by default. Only (generative background) and (typeable console) hydrate via explicit directives. The home is a fixed canvas with no scroll — wordmark header, warm aurora atmosphere, bottom-left terminal with a seeded CV link and echo-only typing. ADR 0001 locks Svelte 5 runes and bans Svelte 4 patterns.
- **Out of scope:** Blog engine, CMS, authentication, user accounts, server-side business logic, or a general-purpose component library (that lives in the separate design repo).`,
		related: [],
		tags: ["kodexarg.com","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kodexarg.com",
	},
	{
		id: "kodexarg-com-3-21cefebf",
		title: "kodexarg.com — personal liminal home site — P2 — Deliberate Cloudflare Workers deploy model",
		text: `### P2 — Deliberate Cloudflare Workers deploy model

- **Who hurts:** Operators deploying static sites to Cloudflare who need a forward-looking platform choice and a CI-owned pipeline.
- **Pain today:** Cloudflare Pages is in maintenance mode relative to Workers-first static asset serving. Hand-maintained entries drift from what the Astro Cloudflare adapter generates at build time.
- **How this repo answers:** ADR 0002 commits to Workers with static assets via . Root stays minimal (no ) per ADR 0004; the adapter emits and a deploy redirect. Push to triggers Cloudflare Workers Builds CI, which auto-deploys worker with custom-domain routes configured in . A KV namespace binding is provisioned for future session support.
- **Out of scope:** Multi-environment staging matrices, D1/R2 data layers, or on-demand SSR (possible later but not current architecture).`,
		related: [],
		tags: ["kodexarg.com","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kodexarg.com",
	},
	{
		id: "kodexarg-com-4-8cd7cf63",
		title: "kodexarg.com — personal liminal home site — P3 — Design-system sync and RPG doc hosting",
		text: `### P3 — Design-system sync and RPG doc hosting

- **Who hurts:** An operator running multiple related web properties who must keep branding consistent and publish internal game-design specs alongside the public face.
- **Pain today:** Copy-pasting components between repos causes drift; RPG design docs scattered in notes are hard for agents and collaborators to reference.
- **How this repo answers:** is vendored from the repo (SSOT) with explicit agent instructions to propagate changes bidirectionally. Global CSS tokens in note lineage from the design system. Two scrollable static doc pages under publish SyV character-creation phases (GDDR-01) and API user stories — design specifications for a separate character-kit service, not live API code in this repo.
- **Out of scope:** Implementing the SyV Character Kit API, battle engine, or lore CMS — those are documented consumers/endpoints only.`,
		related: [],
		tags: ["kodexarg.com","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kodexarg.com",
	},
	{
		id: "kodexarg-com-5-887be183",
		title: "kodexarg.com — personal liminal home site — 3. Product / idea",
		text: `## 3. Product / idea

The mental model is **static-first personal site + selective islands + Workers edge hosting**. After clone and , serves the site in the real workerd runtime (Astro 6 behavior). prerenders pages to with client assets under . Deploy is either manual (build + wrangler) or automatic on push to via Workers Builds. The home ( ) composes: 1. ** layout** — HTML shell, meta, favicon, imports , mounts behind page content. 2. **Header wordmark** — in mode (no blinking cursor, selectable, so it does not block the terminal). 3. **Main terminal** — pinned bottom-left: seeds history with a CV link ( ), accepts typed input that echoes on Enter like a real console (not a command interpreter), respects . Removed product elements (per ): floating "door" links, physics, on the home — do not reintroduce without explicit product decision.`,
		related: [],
		tags: ["kodexarg.com","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kodexarg.com",
	},
	{
		id: "kodexbot-0-64dbf11b",
		title: "kodexBot — offline Hyprland voice dictation and command station — kodexBot",
		text: `## kodexBot

> **Problem thesis (required):** kodexBot exists so a single Hyprland desktop user can press one hard switch, speak naturally in Spanish or English, and have words typed at the cursor while spoken commands ("switch to workspace two", "press accept") are detected on the same audio stream and executed only through a human-edited whitelist — entirely on local open models within an 8 GB NVIDIA GPU budget, with no cloud fallback and no API keys anywhere in the loop.`,
		related: [],
		tags: ["kodexbot","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kodexBot",
	},
	{
		id: "kodexbot-1-896b4d62",
		title: "kodexBot — offline Hyprland voice dictation and command station — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Local, fully-offline voice-to-command and voice-to-text daemon for Hyprland: Super+D hard switch, orange listening / green dictating bar chip, faster-whisper dictation plus regex-and-LLM command routing through a whitelist router. |
| Audience | Primary operator (kodex) on Debian Sid with Hyprland, AGS bar, PipeWire, and an RTX-class 8 GB GPU; secondary audience is AI agents maintaining the repo via its harness (PRD, ADRs, BDDs, skills). |`,
		related: [],
		tags: ["kodexbot","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kodexBot",
	},
	{
		id: "kodexbot-2-43e04df9",
		title: "kodexBot — offline Hyprland voice dictation and command station — P1 — Offline voice control on a VRAM-constrained Hyprland desktop",
		text: `### P1 — Offline voice control on a VRAM-constrained Hyprland desktop

- **Who hurts:** A Hyprland power user who wants dictation and spoken compositor commands without sending audio or transcripts to cloud STT/LLM services, and whose GPU has only 8 GB VRAM shared between desktop compositing and ML models.
- **Pain today:** Cloud assistants require network, keys, and privacy tradeoffs. Generic voice tools do not integrate with Hyprland workspace focus, key injection, or AGS state indicators. Running large STT and interpreter models simultaneously on 8 GB VRAM causes OOM unless carefully budgeted.
- **How this repo answers:** A single Python daemon owns the microphone and a three-state FSM (off / listening / dictating). Lane A runs Silero VAD → faster-whisper large-v3-turbo on CUDA (with CPU fallback on OOM) and types at the cursor via wtype/ydotool. Lane B scans every utterance through a regex fast path (~46 µs) then an OpenAI-compatible local LLM for paraphrases; only whitelist-validated actions reach hyprctl or key macros. Models are pinned, downloaded once via , and documented for Turing sm_75 (no bf16, no TensorRT-LLM).
- **Out of scope:** Wake word / always-on assistant personality, cloud fallback, GNOME/X11 support, managing the LLM server process, or free-form shell generation from model output.`,
		related: [],
		tags: ["kodexbot","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kodexBot",
	},
	{
		id: "kodexbot-3-aa231c2b",
		title: "kodexBot — offline Hyprland voice dictation and command station — P2 — Unified dictation + commands without duplicate daemons",
		text: `### P2 — Unified dictation + commands without duplicate daemons

- **Who hurts:** The same desktop that previously ran two separate voice services (dictation and voice-live) with two state files, two AGS indicators, and conflicting Super+D binds.
- **Pain today:** Two long-lived audio processes compete for the mic; bar widgets lie or conflict; toggling "off" does not reliably release resources; operators cannot tell whether the system is dictating, listening-only, or absent.
- **How this repo answers:** One daemon ( ) with a hard switch (Super+D = toggle off/listening), mode toggle (Super+Shift+D = listening ↔ dictating), atomic JSON state SSOT in , and an AGS chip that polls every 150 ms. Off means no process, no state file, no chip — not a paused state. M5 cutover retired legacy dictate/voice-live binds and indicators on the target machine.
- **Out of scope:** Multi-user or multi-seat orchestration; D-Bus service exposure (Unix socket IPC is sufficient for one compositor).`,
		related: [],
		tags: ["kodexbot","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kodexBot",
	},
	{
		id: "kodexbot-4-1f2af7e1",
		title: "kodexBot — offline Hyprland voice dictation and command station — P3 — Safe command execution when speech mixes prose and intent",
		text: `### P3 — Safe command execution when speech mixes prose and intent

- **Who hurts:** Anyone dictating prose that might accidentally contain command-like phrases, or speaking mixed Spanish/English commands alongside text they want typed.
- **Pain today:** Naive voice-command systems execute whatever the LLM returns, including destructive or compositor-escaping actions. Regex-only systems miss paraphrases; LLM-only systems hallucinate executions.
- **How this repo answers:** Trigger-free model: every utterance closes on configurable silence (1.5 s default, no forced cut), enters the router. Regex matches the ≤10-word tail first; if no match, the interpreter LLM returns constrained JSON intent; the router validates against whitelist (workspace 1–10, five single keys, , bounded macros) before execution. Denied or unmatched utterances become dictation text. JSONL history logs every decision. M7 added a session stack ( on sqlite-vec) so «borra lo último» erases exact typed characters from memory, not blind BackSpace counts.
- **Out of scope:** Arbitrary shell commands, Super/Alt modifier keys in macros, or LLM-proposed actions outside the whitelist.`,
		related: [],
		tags: ["kodexbot","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kodexBot",
	},
	{
		id: "kodexbot-5-87328a05",
		title: "kodexBot — offline Hyprland voice dictation and command station — 3. Product / idea",
		text: `## 3. Product / idea

kodexBot is a **standalone Python system service with a compositor face**, not a plugin or skill. The mental model is a dual-lane pipeline behind a three-state FSM, always visible through an AGS bar chip when active. When the operator hits the hard switch, a daemon spawns, publishes state to a runtime JSON file, and begins capturing 16 kHz mono audio from PipeWire. Silero VAD opens a gate on speech and closes an utterance after sustained silence. Each utterance is transcribed by faster-whisper, pushed to the session stack, and routed: commands execute through hyprctl (Hyprland 0.55 Lua API) or wtype; remaining head text is typed only in dictating (green) mode. In listening (orange) mode, commands still run but nothing is typed. Toggling off tears down the process completely. The **harness** is as important as the code: is required context on every agent session; entries are binding law scanned by frontmatter before edits; hold LLM-arbitrated Gherkin contracts; exposes procedural agent recipes via symlink.`,
		related: [],
		tags: ["kodexbot","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "kodexBot",
	},
	{
		id: "mini-character-sheet-0-1788846c",
		title: "mini-character-sheet — Warhammer stat overlay on miniature photos — mini-character-sheet",
		text: `## mini-character-sheet

> **Problem thesis (required):** This repository is a **minimal Python image-compositing utility** that overlays a semi-transparent Warhammer Fantasy–style character stat table onto a miniature photograph. It exists so a player can resize a source portrait, draw a labeled grid of core stats (WS, BS, S, T, Ini, A, D, I, WP, Fel), center that overlay on the image, and export a single shareable PNG — without opening a full graphics editor. The scope is deliberately tiny: one script, hard-coded sample stats, and committed before/after images as proof of concept.`,
		related: [],
		tags: ["mini-character-sheet","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "mini-character-sheet",
	},
	{
		id: "mini-character-sheet-1-9ce6c3d0",
		title: "mini-character-sheet — Warhammer stat overlay on miniature photos — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Python + Pillow script that pastes a Warhammer stat row onto a resized miniature photo and saves the composite. |
| Audience | Internal hobby use — tabletop wargame players who want quick stat-on-picture exports; not a packaged library or public service. |`,
		related: [],
		tags: ["mini-character-sheet","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "mini-character-sheet",
	},
	{
		id: "mini-character-sheet-2-c38648bb",
		title: "mini-character-sheet — Warhammer stat overlay on miniature photos — P1 — Manual stat overlay on miniature photos is slow",
		text: `### P1 — Manual stat overlay on miniature photos is slow

- **Who hurts:** Wargame players who photograph painted models and want the character's numeric profile visible in the same image when posting to groups, campaign logs, or personal archives.
- **Pain today:** Adding a stat block in GIMP, Photoshop, or Canva for every miniature is repetitive: resize canvas, type headers, align cells, export. Spreadsheets and paper rosters are separate from the visual.
- **How this repo answers:** loads , resizes it to 360×760 pixels, programmatically draws a two-row table (header row + values) on a semi-transparent white RGBA layer (340×50, 50% opacity), centers that layer on the portrait, and writes . Stat abbreviations match classic Warhammer Fantasy profile lines: WS (Weapon Skill), BS (Ballistic Skill), S (Strength), T (Toughness), Ini (Initiative), A (Attacks), D (Damage — here labeled as a single column), I (Intelligence), WP (Wounds Profile or similar house usage), Fel (Fellowship).
- **Out of scope:** Interactive UI, CLI arguments, batch processing multiple minis, reading stats from JSON/CSV, game-system validation, or integration with army-builder tools.`,
		related: [],
		tags: ["mini-character-sheet","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "mini-character-sheet",
	},
	{
		id: "mini-character-sheet-3-dd571a30",
		title: "mini-character-sheet — Warhammer stat overlay on miniature photos — P2 — Reproducible before/after artifact for a fixed layout",
		text: `### P2 — Reproducible before/after artifact for a fixed layout

- **Who hurts:** Anyone iterating on overlay size, font, or placement who needs a committed reference image pair.
- **Pain today:** Ad-hoc scripts without sample inputs/outputs make it hard to see what changed between runs.
- **How this repo answers:** The tree includes (source portrait, 640×1280 JPEG), (360×760 composite result), and (220×30 RGBA PNG — likely an earlier or alternate table render reference). Running the script reproduces the compositing pipeline deterministically for the hard-coded stat array.
- **Out of scope:** Automated visual regression tests, CI, or versioned layout presets.`,
		related: [],
		tags: ["mini-character-sheet","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "mini-character-sheet",
	},
	{
		id: "mini-character-sheet-4-a43ffd5b",
		title: "mini-character-sheet — Warhammer stat overlay on miniature photos — 3. Product / idea",
		text: `## 3. Product / idea

The central idea is **"stats on picture"** (per GitHub repo description): treat a miniature photo as a canvas, generate a small tabular stat strip in code, and alpha-composite it centered on the image. The mental model is a one-shot batch script, not a framework. Pipeline in : 1. **Load and normalize input** — open with Pillow; resize to 360×760 (portrait aspect suited to phone-style mini photos). 2. **Build overlay** — create RGBA image 340×50 with white at 128 alpha; use to grid cells and center text per cell. 3. **Font** — ; expects Times New Roman (or equivalent) installed on the host OS, not vendored in the repo. 4. **Composite** — compute centered on the resized base image; with the overlay as mask. 5. **Export** — save . Hard-coded :

| WS | BS | S | T | Ini | A | D | I | WP | Fel | |----|----|---|----|-----|---|---|---|----|-----| | 51 | 42 | 32 | 41 | 24 | 23 | 45 | 24 | 15 | 24 | These are sample values for demonstration; there is no external data source.`,
		related: [],
		tags: ["mini-character-sheet","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "mini-character-sheet",
	},
	{
		id: "mini-character-sheet-5-b11fc43c",
		title: "mini-character-sheet — Warhammer stat overlay on miniature photos — 3.1 North-star use cases",
		text: `### 3.1 North-star use cases

1. **Single-mini export** — place beside the script, run , obtain with centered stat strip for sharing.
2. **Layout tweak** — edit cell dimensions ( , ), font size, or in and re-run to iterate on readability over a specific base image size.
3. **Reference check** — compare new against the committed artifact to validate Pillow/font behavior on a new machine.`,
		related: [],
		tags: ["mini-character-sheet","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "mini-character-sheet",
	},
	{
		id: "multimedia-handler-for-rpi-0-dfc94175",
		title: "multimedia-handler-for-rpi — Flask web console for Raspberry Pi multimedia signage video fleet — multimedia-handler-for-rpi",
		text: `## multimedia-handler-for-rpi

> **Problem thesis (required):** This repository is a small **local web console** for operators who run a fleet of Raspberry Pi–based multimedia signs. It solves the operational gap between “I have an image or clip idea” and “every designated player folder has the right MP4 loop, named consistently, at the right resolution.” The app converts uploaded still images into short MP4 videos with ffmpeg, copies the result into one or more per-device directories under a shared static tree, and provides a browser UI to browse what each device folder currently holds — with hooks for copy/delete rearrangement before players pick up changes on their periodic sync cycle (documented as roughly five minutes).`,
		related: [],
		tags: ["multimedia-handler-for-rpi","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "multimedia-handler-for-rpi",
	},
	{
		id: "multimedia-handler-for-rpi-1-33c7071d",
		title: "multimedia-handler-for-rpi — Flask web console for Raspberry Pi multimedia signage video fleet — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Flask operator UI that turns images into loopable MP4s and distributes them into per–Raspberry Pi video folders for a multimedia signage network. |
| Audience | Internal operators / technicians curating content for Raspberry Pi signage endpoints; not end viewers of the signs themselves. |`,
		related: [],
		tags: ["multimedia-handler-for-rpi","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "multimedia-handler-for-rpi",
	},
	{
		id: "multimedia-handler-for-rpi-2-a091e674",
		title: "multimedia-handler-for-rpi — Flask web console for Raspberry Pi multimedia signage video fleet — P1 — Fleet video staging without per-device SSH",
		text: `### P1 — Fleet video staging without per-device SSH

- **Who hurts:** Operators managing multiple Raspberry Pi multimedia players, each with its own local SSD and folder naming convention.
- **Pain today:** Without a central staging tool, distributing or rearranging clips means logging into individual devices or manually copying files into opaque folder trees; mistakes in naming or resolution break playback on signage players.
- **How this repo answers:** The app treats as the canonical staging area — one subdirectory per logical player. The **Converter** flow uploads an image, runs ffmpeg to produce an MP4 at a chosen resolution and duration, then distributes the output into every device folder selected via checkboxes. The **Videos** page scans those folders and renders a card grid per device so operators can see what is staged before players sync.
- **Out of scope:** Real-time push to devices; player-side sync implementation; authentication or multi-user audit trails; cloud hosting.`,
		related: [],
		tags: ["multimedia-handler-for-rpi","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "multimedia-handler-for-rpi",
	},
	{
		id: "multimedia-handler-for-rpi-3-9ef2802e",
		title: "multimedia-handler-for-rpi — Flask web console for Raspberry Pi multimedia signage video fleet — P2 — Still images are not signage-ready video loops",
		text: `### P2 — Still images are not signage-ready video loops

- **Who hurts:** Content authors who supply JPG/PNG posters but whose players only loop MP4 files.
- **Pain today:** Manually invoking ffmpeg with correct , duration ( ), and scale ( ) flags for each asset is error-prone and slow at fleet scale.
- **How this repo answers:** The WTForms form captures image file, optional output name, duration in seconds (0–180, default 15 in template), orientation preset ( , , , ), and target device folders. shells out a fixed ffmpeg recipe: loop input image, set duration and resolution, H.264 ( ), scale filter, overwrite output. Processed source and output move to a subfolder under the converter staging path.
- **Out of scope:** Non-image sources (existing video transcoding pipelines); advanced ffmpeg filters beyond the default scale; batch CLI automation outside the web UI.`,
		related: [],
		tags: ["multimedia-handler-for-rpi","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "multimedia-handler-for-rpi",
	},
	{
		id: "multimedia-handler-for-rpi-4-4a208e92",
		title: "multimedia-handler-for-rpi — Flask web console for Raspberry Pi multimedia signage video fleet — 3. Product / idea",
		text: `## 3. Product / idea

The mental model is **folder-sync signage**: a central machine (likely the operator’s workstation or a small server) exposes a Flask app. Device folders under mirror what each Raspberry Pi will pull to its private SSD on a timer. Operators use two primary workflows: 1. **Create & distribute** — upload still → ffmpeg MP4 → copy to N device folders. 2. **Inspect & rearrange** — browse all devices’ staged clips in a table; intended copy/delete actions let operators reorganize before the next player sync. The home page ( ) documents the five-minute sync latency expectation: new or deleted clips may not appear on physical signs until players re-read their folders. Architecture is intentionally monolithic and filesystem-backed — no database, no queue, no API beyond the Flask routes. State lives entirely in directory listings and file copies.`,
		related: [],
		tags: ["multimedia-handler-for-rpi","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "multimedia-handler-for-rpi",
	},
	{
		id: "multimedia-handler-for-rpi-5-df951e63",
		title: "multimedia-handler-for-rpi — Flask web console for Raspberry Pi multimedia signage video fleet — 3.1 North-star use cases",
		text: `### 3.1 North-star use cases

1. Operator uploads a promotional still, sets 15 seconds at 1920×1080, selects three RPi device folders, submits — ffmpeg runs, MP4 copies land in each folder, players sync within minutes.
2. Operator opens the Videos page to verify which clips are staged per device before a campaign goes live.
3. Operator uses the copy modal (partially wired) to duplicate a clip’s staging path reference toward another device folder.`,
		related: [],
		tags: ["multimedia-handler-for-rpi","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "multimedia-handler-for-rpi",
	},
	{
		id: "names-rand-0-67b2cbad",
		title: "Names.rand — fantasy and real-name desktop generator — Names.rand",
		text: `## Names.rand

> **Problem thesis (required):** Creative work — tabletop RPGs, fiction, game prototyping — constantly needs believable character names, both fantasy-race flavored and real-world locale flavored. Manual naming is slow, repetitive, and inconsistent; web generators are fragmented and often lack batch export. Names.rand is a **desktop GUI application** that procedurally composes names from curated syllable pools and word lists, supports eight fantasy races plus nine real-language name sets, generates up to 100 names per run, and exports results to plain text or CSV — packaged for Windows, Linux, and macOS.`,
		related: [],
		tags: ["names.rand","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "names.rand",
	},
	{
		id: "names-rand-1-ed7b597b",
		title: "Names.rand — fantasy and real-name desktop generator — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Cross-platform desktop app that generates fantasy-race and real-language personal names in bulk, with save-to-file export. |
| Audience | Game masters, fiction writers, indie game developers, and kodexArg maintainers who need quick offline name lists; end users who download pre-built executables. |`,
		related: [],
		tags: ["names.rand","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "names.rand",
	},
	{
		id: "names-rand-2-c2309368",
		title: "Names.rand — fantasy and real-name desktop generator — P1 — Fantasy-race name generation with lore-appropriate structure",
		text: `### P1 — Fantasy-race name generation with lore-appropriate structure

- **Who hurts:** Dungeon masters, fantasy authors, and game designers populating worlds with drow, elves, dwarves, demons, dragons, orcs, gnomes, and halflings.
- **Pain today:** Inventing names that *feel* right for each race is tedious. Copy-pasting from fan wikis is inconsistent and copyright-adjacent. Generic random-string generators produce nonsense.
- **How this repo answers:** implements race-specific composition algorithms. Drow and elf names combine syllable pools with dice-roll-driven patterns (apostrophe inserts, doubled syllables, last-name assembly). Dwarven names stitch prefix, sex-specific suffix, and suffix pools. Demons concatenate two syllable lists. Dragons, gnomes, and halflings use multi-segment name assembly with optional "earned" epithets from a shared corpus. Orc names draw from a flat word list. Each race's data lives under as JSON or TXT.
- **Out of scope:** Does not generate place names, ship names, or full character backstories. Does not validate names against official D&D trademark lists. Sex selection is disabled for races that do not use it (demons, dragons, orcs).`,
		related: [],
		tags: ["names.rand","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "names.rand",
	},
	{
		id: "names-rand-3-f900d730",
		title: "Names.rand — fantasy and real-name desktop generator — P2 — Real-language personal names for characters and fixtures",
		text: `### P2 — Real-language personal names for characters and fixtures

- **Who hurts:** Writers and developers who need plausible first+last names in Spanish, English, Portuguese, German, French, Italian, Russian, Muslim, or Chinese contexts.
- **Pain today:** Picking names from baby-name sites is one-at-a-time. Test data generators often use Anglo-only defaults. Russian feminine surname inflection is easy to get wrong.
- **How this repo answers:** in pairs random entries from first-name lists with surname lists. A special case adjusts Russian female surnames ending in , , or by appending . The UI exposes male/female selection for all real-language generators.
- **Out of scope:** Does not generate addresses, phone numbers, or full identities. Name lists are static files, not live census data. README mentions future expansion but Android and PWA targets are not implemented in the current tree.`,
		related: [],
		tags: ["names.rand","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "names.rand",
	},
	{
		id: "names-rand-4-d517a18e",
		title: "Names.rand — fantasy and real-name desktop generator — P3 — Offline, cross-platform desktop delivery",
		text: `### P3 — Offline, cross-platform desktop delivery

- **Who hurts:** Users who want a double-clickable tool without installing Python, and maintainers who need reproducible builds for three OS targets.
- **Pain today:** Python GUI apps are hard to distribute to non-technical users. Platform-specific packaging is boilerplate-heavy.
- **How this repo answers:** Flet provides a Flutter-backed UI from pure Python ( ). AppVeyor CI ( ) runs on Visual Studio 2019, macOS, and Ubuntu images, producing zip/tar.gz artifacts versioned at 0.2.0. manages a git tag for triggering builds. README documents Linux dependency for Flet 0.20+.
- **Out of scope:** No auto-update mechanism, no installer/signing pipeline beyond AppVeyor artifacts, no mobile builds yet.`,
		related: [],
		tags: ["names.rand","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "names.rand",
	},
	{
		id: "names-rand-5-d6b7f330",
		title: "Names.rand — fantasy and real-name desktop generator — 3. Product / idea",
		text: `## 3. Product / idea

The central idea is a **two-layer desktop app**: a Flet GUI shell ( ) and a procedural name engine ( ) backed by static corpora on disk. After launching (from source via or from a packaged executable), the user picks a category from a dropdown (fantasy races grouped separately from real languages), optionally selects sex, adjusts a slider for batch size, clicks Generate, and optionally saves the list. CSV export splits each full name into first and last columns.`,
		related: [],
		tags: ["names.rand","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "names.rand",
	},
	{
		id: "on-screen-dolar-0-5007f7cf",
		title: "on-screen-dolar — fullscreen TV exchange-rate marquee with Telegram price updates — on-screen-dolar",
		text: `## on-screen-dolar

> **Problem thesis (required):** on-screen-dolar exists to turn any connected display into a live Argentine exchange-rate board: a looping background video with a scrolling LED-style ticker showing dollar, blue dollar, euro, and Chilean peso quotes against the peso, updatable on demand from a Telegram chat so operators never touch the TV machine directly.`,
		related: [],
		tags: ["on-screen-dolar","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "on-screen-dolar",
	},
	{
		id: "on-screen-dolar-1-86ba6814",
		title: "on-screen-dolar — fullscreen TV exchange-rate marquee with Telegram price updates — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Python fullscreen video player that overlays a scrolling exchange-rate marquee fed by , with a Telegram bot to change quotes remotely. |
| Audience | Internal operators who manage a physical rate board (shop, office, or home TV); future contributors extending WhatsApp or a tkinter remote client per roadmap. |`,
		related: [],
		tags: ["on-screen-dolar","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "on-screen-dolar",
	},
	{
		id: "on-screen-dolar-2-57f546b6",
		title: "on-screen-dolar — fullscreen TV exchange-rate marquee with Telegram price updates — P1 — Static signage cannot keep pace with intraday FX quotes",
		text: `### P1 — Static signage cannot keep pace with intraday FX quotes

- **Who hurts:** Anyone running a physical or on-wall display of informal or official dollar/euro rates in Argentina, where quotes can shift multiple times per day.
- **Pain today:** Updating a TV image or slide deck requires manual graphic work or on-site keyboard access; there is no single source of truth between what is shown and what staff believe is current.
- **How this repo answers:** holds the canonical quote map ( , , , ). polls that file on every marquee frame via , composites scrolling text over a looping MP4 background, and renders fullscreen through OpenCV. When the JSON changes, the ticker text updates without restarting the video loop logic.
- **Out of scope:** Automated scraping of official or parallel-market rates; historical charts; multi-currency conversion calculators; cloud-hosted dashboards.`,
		related: [],
		tags: ["on-screen-dolar","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "on-screen-dolar",
	},
	{
		id: "on-screen-dolar-3-69a31069",
		title: "on-screen-dolar — fullscreen TV exchange-rate marquee with Telegram price updates — P2 — Remote price updates without sitting at the display PC",
		text: `### P2 — Remote price updates without sitting at the display PC

- **Who hurts:** The person who knows the new rate but is not at the machine hooked to the TV.
- **Pain today:** Walking to the display machine or using ad-hoc file shares to edit JSON is slow and error-prone during busy trading windows.
- **How this repo answers:** implements a Telegram listener. Authorized users send messages in the form (Spanish command prefix configurable in the dict). The bot validates currency keys against , writes the updated JSON, and replies with confirmation. The on-screen marquee picks up new values on its next read cycle.
- **Out of scope:** Multi-tenant bot hosting, rate approval workflows, audit trails beyond log files, WhatsApp integration (listed as future roadmap only).`,
		related: [],
		tags: ["on-screen-dolar","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "on-screen-dolar",
	},
	{
		id: "on-screen-dolar-4-9b9d8215",
		title: "on-screen-dolar — fullscreen TV exchange-rate marquee with Telegram price updates — P3 — Professional-looking TV output from simple Python tooling",
		text: `### P3 — Professional-looking TV output from simple Python tooling

- **Who hurts:** Operators who want a broadcast-style ticker (dimmed lower band, custom LED fonts, fullscreen) without a dedicated signage SaaS or video editor pipeline.
- **Pain today:** Plain text overlays look amateurish; achieving marquee motion and video underlay usually means After Effects or proprietary signage boxes.
- **How this repo answers:** blends a background MP4 ( , other ignored per except the example) with a Pillow-drawn RGBA marquee layer. tunes speed, font, band fade, and frame timing. Custom TTF fonts under (monosphere, LED board variants) give an electronic-ticker aesthetic. Escape key exits fullscreen.
- **Out of scope:** Logo overlays, news crawl integration (mentioned as future Scrapy idea in README), multi-monitor orchestration.`,
		related: [],
		tags: ["on-screen-dolar","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "on-screen-dolar",
	},
	{
		id: "on-screen-dolar-5-6e4d7122",
		title: "on-screen-dolar — fullscreen TV exchange-rate marquee with Telegram price updates — 3. Product / idea",
		text: `## 3. Product / idea

The repository is a **two-process Python signage system** with a shared JSON contract, not a web app. The mental model: 1. **Display lane** ( ): reads , renders a horizontal scrolling string of all key–value pairs, alpha-blends it onto video frames, shows fullscreen. 2. **Control lane** ( ): Telegram long-polling bot; authorized chat users issue price-change commands; bot rewrites . 3. **Orchestration stub** ( ): comments describe intent to run display and bot in separate threads, but the file currently only imports , , and without wiring — operators likely run modules independently today. Data flows in one direction: Telegram message → JSON file → marquee text reader. There is no database, queue, or HTTP API between them.`,
		related: [],
		tags: ["on-screen-dolar","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "on-screen-dolar",
	},
	{
		id: "pi-cam-0-3f61ed9a",
		title: "Pi-Cam — async Telegram bot for RTSP capture on Raspberry Pi — Pi-Cam",
		text: `## Pi-Cam

> **Problem thesis (required):** Pi-Cam exists to turn a Raspberry Pi 3+ and an Ethernet-connected IP camera into a lightweight, remotely operable surveillance assistant. Operators interact through Telegram commands to grab still frames or short MP4 clips from an RTSP stream, optionally start/stop background motion monitoring, and receive media back in-chat — all without building a custom mobile client or exposing a public web UI. The codebase also addresses the maintainability pain of monolithic bot scripts by refactoring toward a layered architecture with explicit command orchestration, service lifecycle management, FIFO media caching, and a unified notifier.`,
		related: [],
		tags: ["pi-cam","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "pi-cam",
	},
	{
		id: "pi-cam-1-795c0419",
		title: "Pi-Cam — async Telegram bot for RTSP capture on Raspberry Pi — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Async Telegram bot that captures photos and videos from an RTSP IP camera on a Raspberry Pi, with optional motion monitoring and multi-user concurrency. |
| Audience | Home operators / internal ALVs who want phone-based camera control; developers maintaining the Pi deployment; CI agents running the pytest suite with mocks (no real hardware required). |`,
		related: [],
		tags: ["pi-cam","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "pi-cam",
	},
	{
		id: "pi-cam-2-accffb33",
		title: "Pi-Cam — async Telegram bot for RTSP capture on Raspberry Pi — P1 — Remote camera access without a bespoke client",
		text: `### P1 — Remote camera access without a bespoke client

- **Who hurts:** Someone with an IP camera on a local network and a Raspberry Pi gateway who wants quick visual checks from a phone while away from the LAN UI.
- **Pain today:** Manufacturer apps are fragmented; browser RTSP viewers are awkward on mobile; writing one-off scripts ties capture logic directly to a chat handler and breaks under concurrent requests.
- **How this repo answers:** A long-polling Telegram bot exposes , , and commands. Each command spawns an independent async task, delegates capture to an RTSP service (OpenCV for frames, FFmpeg for timed MP4 segments), and returns the media file in the chat. Per-user error handling prevents one failed capture from blocking others.
- **Out of scope:** Cloud NVR hosting, multi-camera orchestration, PTZ control, live continuous streaming to Telegram, or a web dashboard.`,
		related: [],
		tags: ["pi-cam","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "pi-cam",
	},
	{
		id: "pi-cam-3-e50a5f34",
		title: "Pi-Cam — async Telegram bot for RTSP capture on Raspberry Pi — P2 — Resource-bounded edge hardware with ephemeral media",
		text: `### P2 — Resource-bounded edge hardware with ephemeral media

- **Who hurts:** Raspberry Pi 3+ deployments with limited storage and CPU where uncapped snapshot/video accumulation fills the SD card.
- **Pain today:** Naive capture scripts write files indefinitely; blocking I/O in the bot thread stalls other users.
- **How this repo answers:** enforces a FIFO cap (default 10 files) under a configurable directory. Capture and FFmpeg work run in thread-pool executors to keep the asyncio event loop responsive. System FFmpeg uses preset for short clips to reduce encode latency on weak hardware.
- **Out of scope:** Long-term archival, object storage upload, or transcoding pipelines.`,
		related: [],
		tags: ["pi-cam","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "pi-cam",
	},
	{
		id: "pi-cam-4-ab633de9",
		title: "Pi-Cam — async Telegram bot for RTSP capture on Raspberry Pi — P3 — Evolving from script soup to testable services",
		text: `### P3 — Evolving from script soup to testable services

- **Who hurts:** Maintainers of a growing Telegram + RTSP + motion-detection codebase where root-level modules became tightly coupled.
- **Pain today:** Direct imports between bot handlers and OpenCV calls make unit testing and feature addition (e.g., REST API, alternate input channels) costly.
- **How this repo answers:** A documented layered refactor ( ) introduces , , , and packages. centralizes command types ( , , , etc.), tracks , and coordinates and through a . Legacy root modules ( , , …) remain for gradual migration compatibility.
- **Out of scope:** Fully completed migration (some root duplicates still exist); hot configuration reload; REST/WebSocket interfaces (planned only in ).`,
		related: [],
		tags: ["pi-cam","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "pi-cam",
	},
	{
		id: "pi-cam-5-0434fbe2",
		title: "Pi-Cam — async Telegram bot for RTSP capture on Raspberry Pi — 3. Product / idea",
		text: `## 3. Product / idea

Pi-Cam is a single-process Python application ( ) that boots on a Raspberry Pi, loads validated environment configuration, wires infrastructure helpers (notifier, cache), instantiates domain services, and starts Telegram long-polling. The mental model is **Telegram as the control plane**, **CommandManager as the orchestrator**, **RTSP services as the data plane**, and **Notifier as the cross-cutting observability channel** (console + optional Telegram push for system events). On , the input layer acknowledges the user, asynchronously requests , receives a filesystem path, sends the JPEG via , and registers the file with the FIFO cache. Video commands differ only in duration (5 s or 20 s). and toggle paired services: RTSP capture readiness plus a frame-differencing motion loop that can emit Telegram warnings when motion exceeds a sensitivity threshold. surfaces per-service run state and cumulative counters (motion events, photos, videos). Hardware context from : Raspberry Pi 3+, optional 7-inch display, IP camera on Ethernet, Pi on Wi-Fi. RTSP credentials and LAN addressing live in operator (not committed); the README documents the expected variable shapes without this summary repeating live values.`,
		related: [],
		tags: ["pi-cam","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "pi-cam",
	},
	{
		id: "pihome-0-47c228f1",
		title: "PiHome — Django multimedia hub for Raspberry Pi — PiHome",
		text: `## PiHome

> **Problem thesis (required):** PiHome is a small Django web application intended to run on a Raspberry Pi and give household operators a browser-based way to manage multimedia files—upload them, attach metadata (name and sort order), persist records in MySQL, and list what is stored. It targets the constraint of a low-power Pi home server rather than a cloud media platform, with Spanish (Argentina) localization and Mendoza timezone defaults.`,
		related: [],
		tags: ["pihome","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "PiHome",
	},
	{
		id: "pihome-1-9bdc786d",
		title: "PiHome — Django multimedia hub for Raspberry Pi — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Django home multimedia manager for Raspberry Pi—upload, catalog, and list files through a simple Bootstrap-styled web UI backed by MySQL. |
| Audience | Home operator / developer running a Pi on the LAN; internal kodexArg maintainer reviving or referencing legacy Pi services. |`,
		related: [],
		tags: ["pihome","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "PiHome",
	},
	{
		id: "pihome-2-569cecc3",
		title: "PiHome — Django multimedia hub for Raspberry Pi — P1 — Pi-local multimedia without a cloud stack",
		text: `### P1 — Pi-local multimedia without a cloud stack

- **Who hurts:** Someone hosting photos, audio, or video on a Raspberry Pi who wants a minimal web front door instead of SSH and manual folder management.
- **Pain today:** Files land in arbitrary directories with no shared naming scheme, no sort order for playlists or slideshows, and no single page to see what is on the device.
- **How this repo answers:** The Django app defines an model (name, order, auto date, file field) and exposes routes for listing ( ), structured add ( ), and a scratch upload path ( ) that writes directly to filesystem storage without touching the database.
- **Out of scope:** Streaming transcoding, CDN delivery, multi-user permissions beyond Django admin, mobile apps, or cloud sync.`,
		related: [],
		tags: ["pihome","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "PiHome",
	},
	{
		id: "pihome-3-e0a28bd7",
		title: "PiHome — Django multimedia hub for Raspberry Pi — P2 — Repeatable Django project skeleton on Pi-class hardware",
		text: `### P2 — Repeatable Django project skeleton on Pi-class hardware

- **Who hurts:** A developer standing up another Pi-side Django service who wants a known project layout (settings, WSGI, one domain app, shell runners).
- **Pain today:** Each Pi experiment starts from with no opinionated media paths, locale, or MySQL wiring.
- **How this repo answers:** Ships a complete (if dated) Django 2.2 project with / , MySQL block, language and Mendoza timezone, Bootstrap 4 via , and helper shell scripts ( , ) for activating a venv and launching .
- **Out of scope:** Production hardening (the committed settings use debug mode and empty allowed hosts), container orchestration, or infrastructure-as-code.`,
		related: [],
		tags: ["pihome","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "PiHome",
	},
	{
		id: "pihome-4-7f6d187b",
		title: "PiHome — Django multimedia hub for Raspberry Pi — P3 — Quick filesystem-only upload for testing",
		text: `### P3 — Quick filesystem-only upload for testing

- **Who hurts:** Developer validating Pi storage or upload plumbing before wiring the ORM form flow.
- **Pain today:** Every test upload requires filling a model form and hitting MySQL.
- **How this repo answers:** accepts a POST with , saves via , prints the resulting URL to stdout, and renders a template—explicitly commented as temporary and database-free.
- **Out of scope:** Durable metadata for Subida uploads; they are not registered in .`,
		related: [],
		tags: ["pihome","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "PiHome",
	},
	{
		id: "pihome-5-fae5b91b",
		title: "PiHome — Django multimedia hub for Raspberry Pi — 3. Product / idea",
		text: `## 3. Product / idea

PiHome is a two-package Django monolith: the project package (settings, root URLconf, WSGI) and the application (models, views, templates, static CSS, admin registration). The mental model is “home page + three media workflows + Django admin,” all served from the Pi on the development server or behind a production WSGI stack not defined in-repo. Users land on a Bootstrap jumbotron home ( class-based ). From there they can add catalogued media ( with ModelForm), browse the database-backed list ( ), or use the experimental direct upload ( ). In debug mode, uploaded files are also exposed under via static file serving helpers in both root and app URLconfs. Persistence splits: structured records live in MySQL table backing ; raw Subida files go to default filesystem storage. File fields upload to date-based paths ( per migrations, with a slightly different path string in the live model—see open questions).`,
		related: [],
		tags: ["pihome","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "PiHome",
	},
	{
		id: "portal-tajamar-0-805c0793",
		title: "Portal Tajamar TV — Django company portal scaffold with AWS EB, S3, and email auth — Portal Tajamar TV",
		text: `## Portal Tajamar TV

> **Problem thesis (required):** is a **private starter repository** for **Portal Tajamar TV** — a Django web application meant to manage and present company information for the Tajamar TV organization. At its current maturity it delivers an authenticated dark-themed upload page (HTMX partial responses), email-verified user accounts via django-allauth, Django admin, and AWS-oriented deployment scaffolding (Elastic Beanstalk container commands, S3-backed static/media in non-debug modes, MySQL via RDS). A stub app hints at future self-service features but is not yet registered or implemented. The repo solves “empty Django + AWS portal bootstrap” more than a finished product portal.`,
		related: [],
		tags: ["portal-tajamar","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "portal-tajamar",
	},
	{
		id: "portal-tajamar-1-1c66b323",
		title: "Portal Tajamar TV — Django company portal scaffold with AWS EB, S3, and email auth — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Authenticated Django portal scaffold for Tajamar TV with file upload, email login, and AWS Elastic Beanstalk + S3 + MySQL deployment wiring. |
| Audience | Tajamar TV internal staff uploading or viewing company assets; developers deploying on AWS EB; Django operators managing users via admin. |`,
		related: [],
		tags: ["portal-tajamar","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "portal-tajamar",
	},
	{
		id: "portal-tajamar-2-2c01884e",
		title: "Portal Tajamar TV — Django company portal scaffold with AWS EB, S3, and email auth — P1 — No centralized company information portal",
		text: `### P1 — No centralized company information portal

- **Who hurts:** Tajamar TV staff and operators who need a single authenticated place to manage and present company-related files and information.
- **Pain today:** Company assets may live in scattered shares, email attachments, or unmanaged static hosting without access control or a consistent branded UI.
- **How this repo answers:** Provides a Django monolith with mandatory login ( on home), a Spanish ( ) dark-themed UI, navbar with auth links, and an HTMX-driven multipart upload form that stores files via Django’s default storage backend (local media in debug, S3 in staging/non-debug) and returns inline success/error partials showing the uploaded asset URL.
- **Out of scope:** Content management workflows (pages, news, video catalogs), public anonymous browsing, fine-grained permissions beyond Django auth groups, and the planned self-service module (app exists but is empty and not in ).`,
		related: [],
		tags: ["portal-tajamar","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "portal-tajamar",
	},
	{
		id: "portal-tajamar-3-3ebb2859",
		title: "Portal Tajamar TV — Django company portal scaffold with AWS EB, S3, and email auth — P2 — AWS deployment bootstrap for a Django portal",
		text: `### P2 — AWS deployment bootstrap for a Django portal

- **Who hurts:** Developers who must stand up a Django app on AWS with MySQL, S3 static/media, and EB deploy hooks without reinventing settings splits and container commands.
- **Pain today:** Manual EB configuration, migrate/collectstatic on deploy, and environment-specific storage backends are repetitive and error-prone when starting from a blank Django project.
- **How this repo answers:** Ships (pip install, migrate, collectstatic, conditional superuser bootstrap on leader instance) and (nginx proxy, WSGI path , MariaDB client libs, health check on ). Settings split across , , and with selecting the module via and . S3 bucket name is derived from via env var pattern . README documents as the deployment path.
- **Out of scope:** A dedicated settings module (README mentions production but only and modules exist in tree). CI/CD beyond EB CLI, infrastructure-as-code (no Terraform/CloudFormation in repo), and multi-region HA patterns.`,
		related: [],
		tags: ["portal-tajamar","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "portal-tajamar",
	},
	{
		id: "portal-tajamar-4-5724863e",
		title: "Portal Tajamar TV — Django company portal scaffold with AWS EB, S3, and email auth — 3. Product / idea",
		text: `## 3. Product / idea

The mental model is a **small authenticated portal monolith**: 1. **Auth layer** — django-allauth with email-as-username, mandatory email verification (including verification-by-code), session cookies with long TTL, logout-on-get enabled. 2. **Core app** — custom ( subclass, migration ), rendering upload UI, accepting with field. 3. **Presentation** — server-rendered templates with layout inheritance ( → / ), partials for navbar, success/error boxes, and a minimal allauth entrance layout override. 4. **Future zone** — Django app scaffold (empty models/views, not installed) reserved for self-service features per naming convention. Non-debug deployments serve static and media from S3 ( ); debug mode uses local and a directory.`,
		related: [],
		tags: ["portal-tajamar","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "portal-tajamar",
	},
	{
		id: "portal-tajamar-5-dabfbe2f",
		title: "Portal Tajamar TV — Django company portal scaffold with AWS EB, S3, and email auth — 3.1 North-star use cases",
		text: `### 3.1 North-star use cases

1. **Staff login** — User signs up or logs in via flows; email verification required before full access.
2. **Authenticated upload** — Logged-in user visits home ( ), selects a file, HTMX posts to , receives inline preview link on success.
3. **Operator deploy** — Developer sets , runs migrations locally or relies on EB container commands, deploys with , admin user bootstrapped on first leader deploy if absent.`,
		related: [],
		tags: ["portal-tajamar","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "portal-tajamar",
	},
	{
		id: "procesarocupacion-0-9b290883",
		title: "ProcesarOcupacion — IMAP harvester for casino device-occupation CSV reports — ProcesarOcupacion",
		text: `## ProcesarOcupacion

> **Problem thesis (required):** This repository automates retrieval of **casino device-occupation CSV files** that arrive as email attachments in a Mendoza Central monitoring mailbox. It exists so operators do not have to manually download, rename, and file daily occupancy reports and related session exports. The repo also retains a historical archive of downloaded CSV snapshots (late 2020 through early 2021) alongside the harvesting scripts.`,
		related: [],
		tags: ["procesarocupacion","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ProcesarOcupacion",
	},
	{
		id: "procesarocupacion-1-0a6e92f4",
		title: "ProcesarOcupacion — IMAP harvester for casino device-occupation CSV reports — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Python IMAP scripts that pull CSV occupation reports from a casino monitoring inbox, save attachments to disk, and move processed messages to a processed folder. |
| Audience | Internal casino / ALVS operators, monitoring staff, and anyone maintaining Mendoza Central occupancy reporting workflows. |`,
		related: [],
		tags: ["procesarocupacion","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ProcesarOcupacion",
	},
	{
		id: "procesarocupacion-2-7055589b",
		title: "ProcesarOcupacion — IMAP harvester for casino device-occupation CSV reports — P1 — Manual download of daily occupation CSV attachments",
		text: `### P1 — Manual download of daily occupation CSV attachments

- **Who hurts:** Monitoring staff and analysts who need per-device hourly occupancy percentages for the gaming floor.
- **Pain today:** Occupation reports are emailed automatically from upstream systems; someone must open the mailbox, identify CSV attachments, save them locally, and avoid re-processing the same messages.
- **How this repo answers:** connects to the Mendoza Central IMAP server, iterates inbox messages, writes every attachment to the working directory using its original filename, and moves fully processed messages to so they are not fetched again.
- **Out of scope:** Parsing, aggregating, visualizing, or loading CSV data into a database. No scheduling, alerting, or validation of CSV contents.`,
		related: [],
		tags: ["procesarocupacion","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ProcesarOcupacion",
	},
	{
		id: "procesarocupacion-3-52ac7c96",
		title: "ProcesarOcupacion — IMAP harvester for casino device-occupation CSV reports — P2 — Archiving session-level slot telemetry alongside occupancy",
		text: `### P2 — Archiving session-level slot telemetry alongside occupancy

- **Who hurts:** Operations teams comparing device occupancy trends with per-machine financial/session metrics (credits played, jackpots, ticket in/out).
- **Pain today:** Session exports ( ) and daily occupation files ( ) accumulate in email and are easy to lose or duplicate.
- **How this repo answers:** The committed CSV corpus in the repo root demonstrates the expected artifact shapes and date range; the IMAP harvester saves new attachments with their source filenames for later offline use.
- **Out of scope:** Merging occupation and session datasets, reconciling device IDs across file types, or real-time dashboards.`,
		related: [],
		tags: ["procesarocupacion","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ProcesarOcupacion",
	},
	{
		id: "procesarocupacion-4-c6bf78e1",
		title: "ProcesarOcupacion — IMAP harvester for casino device-occupation CSV reports — 3. Product / idea",
		text: `## 3. Product / idea

The repository is a **small, script-first data-ingestion utility** with no web UI, API, or packaging layer. The mental model is: *mailbox → filter CSV attachments → write files locally → mark email as processed*. Two Python entrypoints exist: 1. ** (functional path):** Uses the third-party library ( , ) for a concise fetch-and-move loop. This is the script that actually runs end-to-end. 2. ** (incomplete prototype):** Uses Python's standard and modules with a function that begins attachment walking but is syntactically incomplete (truncated expression) and never finishes the download logic. It appears to be an earlier or abandoned approach. The repo doubles as a **sample data vault**: twenty-six CSV files from November 2020 through January 2021 are checked in, giving consumers concrete examples of both file families without needing live mailbox access.`,
		related: [],
		tags: ["procesarocupacion","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ProcesarOcupacion",
	},
	{
		id: "procesarocupacion-5-0522c24e",
		title: "ProcesarOcupacion — IMAP harvester for casino device-occupation CSV reports — 3.1 North-star use cases",
		text: `### 3.1 North-star use cases

1. Operator runs on a schedule (cron or manual) to pull the latest daily attachment(s) from the monitoring inbox.
2. Analyst clones the repo (or copies saved CSVs) to study hourly occupancy columns ( … , ) per / .
3. Historical reviewer inspects rows for roulette machines: credits played/won, manual payouts, jackpots, ticket in/out, and occupancy percentage at snapshot time.`,
		related: [],
		tags: ["procesarocupacion","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ProcesarOcupacion",
	},
	{
		id: "pycreadorpj-0-49a27dcd",
		title: "PyCreadorPJ — Random character generator for Rápido y Fácil (Subordinación y Valor) — PyCreadorPJ",
		text: `## PyCreadorPJ

> **Problem thesis (required):** Tabletop GMs running the Spanish **Rápido y Fácil** system for the **Subordinación y Valor** post-apocalyptic module need fast, rule-faithful random characters (PNJs) with attributes, skills, inventory, initiative, defense, and culturally appropriate names. This private Flask web app automates that workflow from static JSON/CSV game data, renders printable character cards in the browser, and optionally surfaces bundled adventure lore from .`,
		related: [],
		tags: ["pycreadorpj","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "PyCreadorPJ",
	},
	{
		id: "pycreadorpj-1-8bff9016",
		title: "PyCreadorPJ — Random character generator for Rápido y Fácil (Subordinación y Valor) — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Web-based random PNJ generator for RyF's *Subordinación y Valor* dystopia, with save/load via pickle and a scenario lore browser. |
| Audience | Game masters and players of the RyF tabletop system; Spanish-speaking RPG groups; internal hobby tooling within the kodexArg org. |`,
		related: [],
		tags: ["pycreadorpj","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "PyCreadorPJ",
	},
	{
		id: "pycreadorpj-2-f2936454",
		title: "PyCreadorPJ — Random character generator for Rápido y Fácil (Subordinación y Valor) — P1 — Tedious NPC stat rolling at the table",
		text: `### P1 — Tedious NPC stat rolling at the table

- **Who hurts:** GMs preparing or running *Subordinación y Valor* sessions who need multiple NPCs with valid RyF stats, skills, and gear.
- **Pain today:** Rolling attributes per class weight tables, sampling skills from large nested JSON, matching inventory to skills, and computing initiative/defense by hand is repetitive and easy to get wrong mid-session.
- **How this repo answers:** implements the full randomization pipeline: class-weighted attributes scaled by a "poder" slider (1–10), skill sampling from , inventory keyed off possessed skills via , Spanish name generation from INE-frequency CSVs, and dice formulas in for initiative (1o3d10) and defense (Esquivar + 10). The route runs the pipeline and auto-saves to .
- **Out of scope:** Player character sheet PDF export, campaign management, multiplayer sync, or rules validation for editions other than this module's data files.`,
		related: [],
		tags: ["pycreadorpj","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "PyCreadorPJ",
	},
	{
		id: "pycreadorpj-3-faf3a234",
		title: "PyCreadorPJ — Random character generator for Rápido y Fácil (Subordinación y Valor) — P2 — Setting-specific content mixed with mechanics",
		text: `### P2 — Setting-specific content mixed with mechanics

- **Who hurts:** GMs who want generated characters to fit the *Subordinación y Valor* tone (Argentina 2178 dystopia) and need quick access to location/NPC lore during prep.
- **Pain today:** Character tools and adventure text often live in separate notebooks, wikis, or spreadsheets.
- **How this repo answers:** README states the build is tailored for *Subordinación y Valor*. stores structured scenario entries (locations, NPC descriptions, plot hooks) browsable via . Class portrait images under match RyF archetypes (Soldado, Médico, Cultista, etc.) for immediate visual identity.
- **Out of scope:** Full interactive map engine (the route only toggles a static map image include); VTT integration; live combat tracker.`,
		related: [],
		tags: ["pycreadorpj","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "PyCreadorPJ",
	},
	{
		id: "pycreadorpj-4-a7c2c7eb",
		title: "PyCreadorPJ — Random character generator for Rápido y Fácil (Subordinación y Valor) — P3 — Spanish-first naming and trait grammar",
		text: `### P3 — Spanish-first naming and trait grammar

- **Who hurts:** GMs who want procedurally generated Spanish names and gender-inflected trait text without hand-editing.
- **Pain today:** Generic name generators ignore Spanish frequency distributions and gendered adjective endings required by RyF trait lists.
- **How this repo answers:** filters INE-derived name CSVs by age/power, weighted by frequency. reads and applies gender-specific suffix rules (Mujer/Hombre/Indeterminado placeholder patterns with / markers). Apellidos sampled from .
- **Out of scope:** Localization to other languages; official INE API integration (static CSV snapshots only).`,
		related: [],
		tags: ["pycreadorpj","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "PyCreadorPJ",
	},
	{
		id: "pycreadorpj-5-685be3ad",
		title: "PyCreadorPJ — Random character generator for Rápido y Fácil (Subordinación y Valor) — 3. Product / idea",
		text: `## 3. Product / idea

PyCreadorPJ is a **single-process Flask application** with server-rendered Jinja2 templates and Bootstrap 5 styling. The mental model: 1. User opens the home page and chooses **Generar**, **Cargar**, or **Guardar** from the navbar dropdown. 2. On generate, a GET form submits class, optional subclass ("Multiclase"), gender, optional fixed name/age/bio, and a power slider. 3. The server builds a character dict (attributes, skills, inventory, money, traits stub, initiative, defense) and pickles it under . 4. renders card columns: portrait, attribute table, skill list (top skills emphasized), inventory, money. 5. Separate routes expose a static city map image and a lore browser fed by . Code identifiers, comments, and UI copy are predominantly **Spanish**, matching the source RPG system ("Rápido y Fácil"). The dependency manifest is named (typo for "requirements").`,
		related: [],
		tags: ["pycreadorpj","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "PyCreadorPJ",
	},
	{
		id: "pyfinanzaspersonales-0-035af0c3",
		title: "PyFinanzasPersonales — planned Python personal and family expense tracker (stub repository) — PyFinanzasPersonales",
		text: `## PyFinanzasPersonales

> **Problem thesis (required):** This private repository was created as a **placeholder for a Python application** to control personal and family expenses in an orderly way ( ). As of the shallow clone on , the tree contains only a one-line README, a standard Python , and a GPL-3.0 — **no source files, manifests, docs vaults, CI, or deploy configuration**. The pain it is meant to address is real (household money visibility and structured expense logging), but the repository has not progressed beyond initialization in March 2022. Treat this summary as documentation of **intent and repository shell**, not of a runnable product.`,
		related: [],
		tags: ["pyfinanzaspersonales","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "PyFinanzasPersonales",
	},
	{
		id: "pyfinanzaspersonales-1-bae94412",
		title: "PyFinanzasPersonales — planned Python personal and family expense tracker (stub repository) — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Aplicación para controlar gastos personales y familiares de manera ordenada — a reserved private repo name and license shell for a future Python expense tracker. |
| Audience | Intended end users: individuals and families managing household spending; intended developers: kodexArg maintainers who would implement the Python app. No agent harness or operator docs exist yet. |`,
		related: [],
		tags: ["pyfinanzaspersonales","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "PyFinanzasPersonales",
	},
	{
		id: "pyfinanzaspersonales-2-c9c1741e",
		title: "PyFinanzasPersonales — planned Python personal and family expense tracker (stub repository) — P1 — Disorderly personal and family expense tracking",
		text: `### P1 — Disorderly personal and family expense tracking

- **Who hurts:** Individuals and families who struggle to see where money goes across personal and shared household purchases.
- **Pain today:** Expenses often live in bank apps, paper receipts, informal notes, or one-off spreadsheets without a single structured view, making month-over-month comparison and family budgeting harder than necessary.
- **How this repo answers:** **Only at the level of stated intent** ( , GitHub description). The name and Spanish pitch imply a future application to record and organize gastos personales y familiares. No models, UI, import pipelines, or reporting code exist in the tree to deliver that capability yet. - **Out of scope (today):** Tax filing, investment portfolio management, multi-currency trading, business accounting, bank API integration, and any deployed service — none are present in the repository.`,
		related: [],
		tags: ["pyfinanzaspersonales","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "PyFinanzasPersonales",
	},
	{
		id: "pyfinanzaspersonales-3-1b4958fd",
		title: "PyFinanzasPersonales — planned Python personal and family expense tracker (stub repository) — P2 — Isolated project home for a Python finance utility",
		text: `### P2 — Isolated project home for a Python finance utility

- **Who hurts:** A maintainer who wants a clean, licensable Python project boundary rather than embedding personal-finance experiments inside larger kodexArg apps.
- **Pain today:** Without a dedicated repo, experiments risk polluting unrelated codebases or lacking a clear license and ignore rules for Python artifacts.
- **How this repo answers:** Provides a **private GitHub home** with GPL-3.0 licensing and a Python-oriented (virtualenvs, , Django , , test caches, packaging artifacts). This establishes conventions for a future Python stack but does not yet include , , or application entrypoints.
- **Out of scope:** Shared infrastructure with or other ALVS harness repos; no cross-repo links or submodule references were found.`,
		related: [],
		tags: ["pyfinanzaspersonales","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "PyFinanzasPersonales",
	},
	{
		id: "pyfinanzaspersonales-4-16c80361",
		title: "PyFinanzasPersonales — planned Python personal and family expense tracker (stub repository) — 3. Product / idea",
		text: `## 3. Product / idea

The **central idea** inferred from naming and README is a **Python-based personal finance helper**: users would log expenses, likely categorize them, and review spending patterns for themselves and their family unit. The mental model is a small desktop or web utility focused on **control ordenado** (orderly control), not enterprise ERP. Because no implementation exists, the following is **aspirational architecture** grounded in repository signals only: - **Language:** Python (strong signal from repo name prefix and Python-default sections for Django, Flask, pytest, pip, venv). - **License posture:** Copyleft GPL-3.0 — derivatives must remain open under compatible terms if distributed. - **Data locality:** anticipates local SQLite ( ) and secrets, suggesting a likely pattern of local-first storage and environment-based configuration — but no or ORM models exist to confirm Django vs Flask vs CLI.`,
		related: [],
		tags: ["pyfinanzaspersonales","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "PyFinanzasPersonales",
	},
	{
		id: "pyfinanzaspersonales-5-df52b360",
		title: "PyFinanzasPersonales — planned Python personal and family expense tracker (stub repository) — 3.1 North-star use cases (intended, not implemented)",
		text: `### 3.1 North-star use cases

(intended, not implemented)
1. **Record an expense** — user enters amount, date, category, and optional note for a personal or shared family purchase.
2. **Review by period** — user views monthly or weekly totals to understand spending habits.
3. **Family visibility** — multiple household members’ transactions roll up into a shared orderly view (implied by “familiares” in the pitch).`,
		related: [],
		tags: ["pyfinanzaspersonales","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "PyFinanzasPersonales",
	},
	{
		id: "pymceocup-0-27118cc1",
		title: "PyMceOcup — Casino Mendoza slot occupancy ETL — PyMceOcup",
		text: `## PyMceOcup

> **Problem thesis (required):** A small Python toolkit for **Casino Mendoza** (MCE) operations that automates two offline data chores: pulling daily occupancy CSV attachments from a corporate IMAP inbox, and consolidating many per-day CSV files into one Excel workbook ( ). The repository is a legacy, script-only ETL snapshot from mid-2021 with no web UI, no tests, and no dependency manifest.`,
		related: [],
		tags: ["pymceocup","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "PyMceOcup",
	},
	{
		id: "pymceocup-1-fdaf1e1c",
		title: "PyMceOcup — Casino Mendoza slot occupancy ETL — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Fetch slot occupancy CSVs from email and merge them into a single Excel report for Mendoza casino floor monitoring. |
| Audience | Internal casino operations / monitoring staff; whoever maintained the mailbox workflow circa 2021. |`,
		related: [],
		tags: ["pymceocup","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "PyMceOcup",
	},
	{
		id: "pymceocup-2-0d99432c",
		title: "PyMceOcup — Casino Mendoza slot occupancy ETL — P1 — Email-delivered CSVs require manual download",
		text: `### P1 — Email-delivered CSVs require manual download

- **Who hurts:** Monitoring operators responsible for daily slot-floor occupancy reports at Casino Mendoza.
- **Pain today:** Occupancy data arrives as CSV attachments in a shared IMAP inbox. Without automation, someone must open each message, save attachments locally, and track which messages were already processed.
- **How this repo answers:** connects to the Mendoza Central corporate mail server via IMAP ( ), iterates inbox messages, saves any attachment whose filename ends in , and moves fully processed messages to an folder. A one-second sleep between messages reduces server throttling risk.
- **Out of scope:** Parsing or validating CSV contents; scheduling (no cron/systemd); secure credential management (credentials are currently hardcoded in source — see §9).`,
		related: [],
		tags: ["pymceocup","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "PyMceOcup",
	},
	{
		id: "pymceocup-3-23d089f6",
		title: "PyMceOcup — Casino Mendoza slot occupancy ETL — P2 — Many daily occupation files need one consolidated report",
		text: `### P2 — Many daily occupation files need one consolidated report

- **Who hurts:** Analysts or supervisors who need cross-day, cross-device occupancy trends rather than isolated daily CSVs.
- **Pain today:** The directory accumulates hundreds of files in two naming conventions. The files are one row per device per day with hourly percentage columns — useless for spreadsheet pivoting until merged.
- **How this repo answers:** scans , filters filenames ending in , loads each with pandas, concatenates into a single DataFrame, and writes (sheet , two-decimal float formatting, empty-string NA replacement).
- **Out of scope:** Merging the alternate session reports (different schema, not handled by ); deduplication; incremental updates; database loading.`,
		related: [],
		tags: ["pymceocup","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "PyMceOcup",
	},
	{
		id: "pymceocup-4-ecfead53",
		title: "PyMceOcup — Casino Mendoza slot occupancy ETL — 3. Product / idea",
		text: `## 3. Product / idea

PyMceOcup is not a deployable service. It is a **two-script ETL pair** plus a large static dataset: 1. **Ingest path** — is the upstream fetcher: IMAP → local CSV files (written to the working directory, not automatically into ). 2. **Transform path** — is the downstream aggregator: → . 3. **Data lake** — holds ~306 committed CSV snapshots (167 session reports + 139 daily occupation files) spanning roughly March–August 2021, plus an ~8 MB pre-built . 4. **Placeholder** — exists but is empty (0 bytes); no Flask/Django/FastAPI application was implemented. The mental model is **mailbox → flat files → Excel workbook**, entirely batch-oriented and run on an operator workstation.`,
		related: [],
		tags: ["pymceocup","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "PyMceOcup",
	},
	{
		id: "pymceocup-5-a630ada6",
		title: "PyMceOcup — Casino Mendoza slot occupancy ETL — 3.1 North-star use cases",
		text: `### 3.1 North-star use cases

1. Operator runs after shift change to pull new occupancy CSV attachments and archive processed mail.
2. Analyst runs after CSVs are placed in to regenerate the master Excel occupancy sheet.
3. Supervisor opens (or individual CSVs) for floor utilization review.`,
		related: [],
		tags: ["pymceocup","github","private","low","summary"],
		visibility: "private",
		importance: "low",
		sourceRepo: "PyMceOcup",
	},
	{
		id: "pz-detective-profession-0-f5f5b114",
		title: "Detective Profession — Project Zomboid Build 41 character mod — Detective Profession",
		text: `## Detective Profession

> **Problem thesis (required):** This repository preserves a **private Build 41 snapshot** of a Project Zomboid mod that adds a **Detective** playable profession. It exists to give cautious players a balanced urban-exploration specialist: strong indoor foraging, elevated vision, and a unique **danger-detection** loop that warns about zombies in small rooms—especially when the player toggles the game's search mode—while capping surprise so threats are never fully telegraphed. The GitHub description marks it as superseded by the **TrueDetective** rebuild for Build 42; this tree is the archived B41 lineage kept for reference and Workshop continuity.`,
		related: [],
		tags: ["pz-detective-profession","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "pz-detective-profession",
	},
	{
		id: "pz-detective-profession-1-7356617f",
		title: "Detective Profession — Project Zomboid Build 41 character mod — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | A Project Zomboid mod that registers a Detective profession with urban foraging bonuses, fedora-and-trench-coat spawn gear, and door-adjacent zombie intuition voiced through randomized phrases. |
| Audience | Project Zomboid players on Build 41, mod authors studying profession/forage hooks, and maintainers tracing the predecessor to the TrueDetective B42 rebuild. |`,
		related: [],
		tags: ["pz-detective-profession","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "pz-detective-profession",
	},
	{
		id: "pz-detective-profession-2-c9b888a0",
		title: "Detective Profession — Project Zomboid Build 41 character mod — P1 — No cautious indoor specialist in vanilla professions",
		text: `### P1 — No cautious indoor specialist in vanilla professions

- **Who hurts:** Players who prefer slow, room-clearing survival over sprint-looting; anyone repeatedly ambushed by zombies behind interior doors.
- **Pain today:** Vanilla occupations reward combat or broad traits but none combine **small-room threat sensing** with **search-mode synergy** and urban foraging without becoming overpowered.
- **How this repo answers:** hooks and, on tile changes, probabilistically scans adjacent door edges. When a connected room (≤50 tiles) contains living instances, the player speaks a random alert phrase from . Search mode raises attempt frequency (66% roll vs 10% passive); enforces the small-room ceiling so large buildings never fully light up.
- **Out of scope:** Does not add new weapons, quests, NPC detectives, or a full investigation minigame. Does not replace the game's line-of-sight or hearing systems.`,
		related: [],
		tags: ["pz-detective-profession","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "pz-detective-profession",
	},
	{
		id: "pz-detective-profession-3-46fed0fe",
		title: "Detective Profession — Project Zomboid Build 41 character mod — P2 — Urban foraging lacks a versatile occupation",
		text: `### P2 — Urban foraging lacks a versatile occupation

- **Who hurts:** Looters in towns and strip malls who want forage bonuses without picking Park Ranger (outdoor-biased) or hyper-specialized traits from other mods.
- **Pain today:** Foraging specialization is fragmented; no single class offers high **Junk/Trash** yields plus broad category bonuses indoors.
- **How this repo answers:** registers with vision bonus 2.2 (above Veteran's 2.0 per README), 33% weather/darkness mitigation, and tuned table (e.g. Ammunition +50%, Trash/Junk +20%). Profession also grants XP boosts to Aiming (+1), Lightfoot (+1), and Sneak (+2).
- **Out of scope:** Does not out-specialize Park Ranger outdoors, Medic medical loot, or third-party trait mods; README explicitly positions Detective as versatile, not dominant in every category.`,
		related: [],
		tags: ["pz-detective-profession","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "pz-detective-profession",
	},
	{
		id: "pz-detective-profession-4-d9d030c9",
		title: "Detective Profession — Project Zomboid Build 41 character mod — P3 — Missing detective fantasy and diegetic warnings",
		text: `### P3 — Missing detective fantasy and diegetic warnings

- **Who hurts:** Role-players and immersion-focused players who want the character to *react* to danger narratively.
- **Pain today:** Threat awareness is mostly mechanical (sound, vision cone) without class-flavored feedback.
- **How this repo answers:** dynamically loads 30+ search-mode lines and 30+ zombie-alert lines from translation files ( , ). triggers a search phrase when the player enters search mode. English and Argentine Spanish locales are provided; workshop metadata notes AR translation availability.
- **Out of scope:** Voice acting, cutscenes, or persistent case files. Phrases are cosmetic RNG, not quest state.`,
		related: [],
		tags: ["pz-detective-profession","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "pz-detective-profession",
	},
	{
		id: "pz-detective-profession-5-df178725",
		title: "Detective Profession — Project Zomboid Build 41 character mod — 3. Product / idea",
		text: `## 3. Product / idea

The mod is a **single-occupation gameplay patch** for Project Zomboid. At game boot it registers profession via , attaches forage skill metadata, and on game start wires movement and search-mode listeners. The mental model is three coupled loops: 1. **Profession identity** — negative point cost (-6), detective icon textures, and spawn loadout (fedora 75%, long leather jacket, practical pants/shoes). 2. **Forage loop** — vanilla search/forage UI benefits from Detective's row whenever the player forages in urban contexts. 3. **Intuition loop** — each step to a new grid square may trigger door-adjacent room scans; success yields with thematic warnings. Distribution targets Steam Workshop (workshop ID in and ) and manual install under the player's Zomboid mods folder ( ).`,
		related: [],
		tags: ["pz-detective-profession","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "pz-detective-profession",
	},
	{
		id: "rpi-temp-0-b60372ca",
		title: "Raspberry Pi Temperature Monitor — Flask chart API over MySQL — rpi-temp",
		text: `## rpi-temp

> **Problem thesis (required):** This repository provides a minimal, containerized web application that reads the latest temperature and humidity samples from a MySQL table populated by Raspberry Pi sensors, filters obvious bad readings, and renders an interactive line chart in the browser. It exists to give operators a quick visual health check of environmental conditions—originally in a cannabis grow monitoring context (container names and UI branding reference "Weed Pi")—without standing up a heavier observability stack.`,
		related: [],
		tags: ["rpi-temp","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "rpi-temp",
	},
	{
		id: "rpi-temp-1-d602fa6f",
		title: "Raspberry Pi Temperature Monitor — Flask chart API over MySQL — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Dockerized Flask + nginx stack that charts the last 100 temperature/humidity rows from MySQL for Raspberry Pi sensor feeds. |
| Audience | Home-lab operators, grow-room monitors, and anyone maintaining edge Pi sensors that write into a shared MySQL table. |`,
		related: [],
		tags: ["rpi-temp","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "rpi-temp",
	},
	{
		id: "rpi-temp-2-7e396aa4",
		title: "Raspberry Pi Temperature Monitor — Flask chart API over MySQL — P1 — Edge sensor data needs a simple live chart",
		text: `### P1 — Edge sensor data needs a simple live chart

- **Who hurts:** Operators running Raspberry Pi nodes that log environmental readings into a central database but lack a turnkey visualization layer.
- **Pain today:** Raw rows in MySQL are not actionable at a glance; exporting to spreadsheets or wiring Grafana is heavier than needed for a single-room monitor.
- **How this repo answers:** A Flask app exposes , which pulls the 100 most recent rows from , drops humidity values above 110 (treated as sensor error), serializes to JSON, and a Chart.js front page plots temperature and humidity over time.
- **Out of scope:** Alerting, multi-tenant auth, long-term analytics, sensor ingestion (assumed to happen elsewhere into MySQL).`,
		related: [],
		tags: ["rpi-temp","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "rpi-temp",
	},
	{
		id: "rpi-temp-3-94cb04a4",
		title: "Raspberry Pi Temperature Monitor — Flask chart API over MySQL — P2 — Reproducible small-footprint deployment",
		text: `### P2 — Reproducible small-footprint deployment

- **Who hurts:** Someone who wants the API + chart on a Pi or small VM without manual Python virtualenv juggling.
- **Pain today:** Mixing dev Flask, production WSGI, and reverse-proxy config by hand is error-prone on constrained hardware.
- **How this repo answers:** defines two services— (Python 3.8 image, uWSGI via ) and (reverse proxy to uWSGI socket on port 8080)—with volume-mounted source for iterative dev.
- **Out of scope:** Kubernetes, Terraform, CI/CD pipelines, secrets management (credentials are currently inlined in source—see §9).`,
		related: [],
		tags: ["rpi-temp","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "rpi-temp",
	},
	{
		id: "rpi-temp-4-7968c2bc",
		title: "Raspberry Pi Temperature Monitor — Flask chart API over MySQL — P3 — Noisy humidity readings distort trends",
		text: `### P3 — Noisy humidity readings distort trends

- **Who hurts:** Anyone reading live humidity who would misinterpret spikes caused by sensor glitches.
- **Pain today:** Unfiltered time series show impossible values (e.g., humidity > 110%) that break chart scaling.
- **How this repo answers:** filters out rows where before JSON serialization.
- **Out of scope:** Broader data-quality pipelines, calibration, or per-device thresholds.`,
		related: [],
		tags: ["rpi-temp","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "rpi-temp",
	},
	{
		id: "rpi-temp-5-f65290c1",
		title: "Raspberry Pi Temperature Monitor — Flask chart API over MySQL — 3. Product / idea",
		text: `## 3. Product / idea

The mental model is a **read-mostly dashboard** sitting in front of an existing MySQL fact table. Raspberry Pi devices (implied by column name and project naming) write temperature ( ), humidity ( ), and timestamp ( ) rows into . This app never ingests sensors directly—it only queries and presents. User flow: 1. Browser hits → Jinja template loads Bootstrap, jQuery, Moment.js, and Chart.js from public CDNs. 2. Client-side JavaScript synchronously fetches (same origin, appended to current page URL). 3. JSON columns ( , , , ) are mapped into a dual-series line chart with time axis and y-axis suggested range 10–45 (°C-oriented scale). Production path: **nginx** terminates HTTP/HTTPS on ports 80/443 and es to the container on port 8080. The Flask Dockerfile CMD runs (4 processes, 2 threads, socket ). A separate exists for ad-hoc dev server on (not used in the Docker CMD).`,
		related: [],
		tags: ["rpi-temp","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "rpi-temp",
	},
	{
		id: "ryf-0-8f7004be",
		title: "Subordinación y Valor — TTRPG character companion web app — Subordinación y Valor (ryf)",
		text: `## Subordinación y Valor (ryf)

> **Problem thesis (required):** This repository is the companion web application for **Subordinación y Valor** (*SyV*), a Spanish-language post-apocalyptic tabletop RPG set in a walled, dictatorial Argentina circa 2178. It solves three intertwined pains: (1) presenting richly authored characters—portraits, RyF stats, public bios, and GM-only secrets—in a tactile card-deck UI rather than flat documents; (2) backing those characters with a REST API and MySQL store so the roster can grow beyond static seed data; and (3) embedding an adapted **Rápido y Fácil** (*RyF*) rules summary tailored to SyV's dark-contemporary flavor, occultism, and optional extended attributes.`,
		related: [],
		tags: ["ryf","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ryf",
	},
	{
		id: "ryf-1-d2632b00",
		title: "Subordinación y Valor — TTRPG character companion web app — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | A SvelteKit + Django stack that showcases SyV RPG characters as an interactive card carousel and serves them via a REST API, with in-app RyF rules documentation. |
| Audience | SyV players, game masters, and internal authors generating or curating characters for the setting; not a general-purpose RPG platform. |`,
		related: [],
		tags: ["ryf","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ryf",
	},
	{
		id: "ryf-2-0b0b89bb",
		title: "Subordinación y Valor — TTRPG character companion web app — P1 — Immersive character discovery for a narrative TTRPG",
		text: `### P1 — Immersive character discovery for a narrative TTRPG

- **Who hurts:** Players and GMs running *Subordinación y Valor* sessions who need quick, atmospheric access to pre-generated NPCs and PCs without breaking immersion.
- **Pain today:** Character sheets live as disconnected prose, JSON blobs, or AI-generated drafts with no unified visual presentation; secrets and public bios are hard to toggle cleanly at the table.
- **How this repo answers:** The SvelteKit frontend renders a horizontal **card deck** ( , ) with portrait art, RyF stat bars ( ), occupation/faction labels, and expandable biography/secret sections. Double-clicking a card stores the character in and navigates to a full detail view ( at ). Static seed data in demonstrates the intended UX while the API path matures.
- **Out of scope:** Full character creation wizard, combat tracker, dice roller, or live multiplayer session tooling.`,
		related: [],
		tags: ["ryf","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ryf",
	},
	{
		id: "ryf-3-400a0601",
		title: "Subordinación y Valor — TTRPG character companion web app — P2 — Persistent character roster via API",
		text: `### P2 — Persistent character roster via API

- **Who hurts:** Authors who generate many SyV characters (see prompt notes) and need a single source of truth beyond checked-in JSON.
- **Pain today:** Hand-editing JSON or markdown for every new character does not scale; portrait filenames, slugs, and nested stats are error-prone.
- **How this repo answers:** Django REST Framework exposes a with nested serialization. Characters carry slug, names, occupations (public and secret), faction, location, biography, , portrait filename, and a one-to-one model (physique, intellect, skill, perception, empathy — each validated 1–5). The route's fetches from the API at load time.
- **Out of scope:** User authentication for players, image upload pipeline (portraits are filename references to ), or admin-only GM portals beyond Django admin.`,
		related: [],
		tags: ["ryf","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ryf",
	},
	{
		id: "ryf-4-6c4a53d6",
		title: "Subordinación y Valor — TTRPG character companion web app — P3 — In-app RyF rules reference for SyV",
		text: `### P3 — In-app RyF rules reference for SyV

- **Who hurts:** GMs adapting the third-party *Rápido y Fácil* system to SyV's proscribed-tech, Lovecraft-leaning, clerical-power setting.
- **Pain today:** The external RyF v3.5 manual is generic; SyV-specific attribute extensions (Magia, Voluntad, Astucia, Erudición) and sanity/corruption hooks are scattered in author notes.
- **How this repo answers:** is rendered at through a component (markdown-it + dynamic raw import). The doc explains why RyF fits SyV, lists base and extended attributes, and references official RyF materials by title (links exist in source markdown but are not repeated here for RAG hygiene).
- **Out of scope:** Replacing the official RyF rulebook; full SRD parity or automated rules enforcement.`,
		related: [],
		tags: ["ryf","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ryf",
	},
	{
		id: "ryf-5-beb4db69",
		title: "Subordinación y Valor — TTRPG character companion web app — 3. Product / idea",
		text: `## 3. Product / idea

The mental model is a **two-tier web app**: a polished SvelteKit SPA-style frontend for players, and a containerized Django API + MySQL backend for data persistence, fronted by Nginx in production-shaped Docker Compose. Users land on a themed shell ( ) with olive/blood Tailwind palette, lazy-loaded background art, and a navbar branded **Subordinación y Valor**. Navigation popup links to home, generated characters, a placeholder "secret archives" route (still points home), and the rules page. The home route ( ) is currently a stub—most value lives under and . Character flow: list page loads API data → progressively renders cards with fly-in animation and horizontal scroll (mouse-wheel mapped to horizontal scroll) → single-click enlarges, double-click opens detail. Detail page reads from (not a second API fetch by slug), so navigation depends on prior deck interaction. A parallel directory holds earlier prototypes—duplicate , , Django-style migrations mirroring backend schema, and character route experiments—suggesting iterative development before consolidation into .`,
		related: [],
		tags: ["ryf","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ryf",
	},
	{
		id: "scrappermdzol-0-60ff6454",
		title: "ScrapperMDZOL — keyword-filtered Scrapy harvester for regional news — ScrapperMDZOL",
		text: `## ScrapperMDZOL

> **Problem thesis (required):** This repository is a small **Scrapy CLI application** that crawls a regional Mendoza news homepage, applies **comma-separated keyword filters** to headline text, follows matching article links, and exports structured JSON records (headline, relative link, epigraph, body). It exists to automate selective news monitoring—turning a noisy front-page feed into a filtered, machine-readable corpus—without building a full CMS integration or manual copy-paste workflow. A secondary experimental spider targets a US government historical reading-room index (unrelated domain) and appears to be a learning exercise bundled in the same project.`,
		related: [],
		tags: ["scrappermdzol","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ScrapperMDZOL",
	},
	{
		id: "scrappermdzol-1-bbacd9d6",
		title: "ScrapperMDZOL — keyword-filtered Scrapy harvester for regional news — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Scrapy spiders that keyword-filter regional news headlines and export full-article JSON for offline use. |
| Audience | Internal operators or developers who need filtered news snapshots; anyone extending XPath selectors if the target site's HTML changes. |`,
		related: [],
		tags: ["scrappermdzol","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ScrapperMDZOL",
	},
	{
		id: "scrappermdzol-2-5609a6a5",
		title: "ScrapperMDZOL — keyword-filtered Scrapy harvester for regional news — P1 — Selective news monitoring without manual homepage scanning",
		text: `### P1 — Selective news monitoring without manual homepage scanning

- **Who hurts:** Anyone tracking Mendoza regional news for specific topics (politics, economy, local events) who cannot afford to read every headline on the portal homepage.
- **Pain today:** The news homepage lists dozens of stories across sections; relevant items are buried among lifestyle and syndicated content. Manual refresh-and-scan is slow and inconsistent.
- **How this repo answers:** The spider loads the homepage, extracts all headline links via XPath, and accepts a runtime argument (comma-separated keywords). Only headlines whose text contains any filter substring (case-insensitive) trigger a follow-up request to the article page. Non-matching items are skipped at listing time.
- **Out of scope:** Real-time push notifications, scheduling/cron orchestration (not in repo), full-site archival, or semantic/NLP relevance ranking beyond simple substring match.`,
		related: [],
		tags: ["scrappermdzol","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ScrapperMDZOL",
	},
	{
		id: "scrappermdzol-3-13164164",
		title: "ScrapperMDZOL — keyword-filtered Scrapy harvester for regional news — P2 — Structured article extraction for downstream JSON consumers",
		text: `### P2 — Structured article extraction for downstream JSON consumers

- **Who hurts:** Pipelines that ingest news into archives, dashboards, or RAG corpora and need consistent fields—not raw HTML dumps.
- **Pain today:** Listing pages expose only titles and links; full text requires visiting each article and parsing non-trivial DOM structure (epigraph in a element, body paragraphs inside with mixed inline nodes).
- **How this repo answers:** After a filter match, fetches the article and populates four fields: (headline), (relative URL from listing), (cleaned single-line summary), and (concatenated paragraph text with newline normalization and non-breaking-space cleanup). Output is written via Scrapy's built-in JSON feed exporter to in the working directory.
- **Out of scope:** Image/media extraction, author/byline metadata, publish-date parsing, deduplication across runs, or database persistence.`,
		related: [],
		tags: ["scrappermdzol","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ScrapperMDZOL",
	},
	{
		id: "scrappermdzol-4-1989b807",
		title: "ScrapperMDZOL — keyword-filtered Scrapy harvester for regional news — P3 — Section noise reduction on a mixed-content homepage",
		text: `### P3 — Section noise reduction on a mixed-content homepage

- **Who hurts:** Operators who want hard-news filters but would otherwise follow lifestyle or syndicated links that share the same listing layout.
- **Pain today:** The homepage mixes lifestyle paths and third-party syndication prefixes with core news; a naive "follow all links" crawl wastes bandwidth and pollutes output.
- **How this repo answers:** in drops any listing link whose href starts with banned prefixes (lifestyle section path and an external syndication prefix) before filter evaluation.
- **Out of scope:** Dynamic section discovery, robots.txt section parsing, or per-section spider configuration files.`,
		related: [],
		tags: ["scrappermdzol","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ScrapperMDZOL",
	},
	{
		id: "scrappermdzol-5-3c159cdc",
		title: "ScrapperMDZOL — keyword-filtered Scrapy harvester for regional news — 3. Product / idea",
		text: `## 3. Product / idea

The mental model is **"filtered crawl → JSON file"**: run a single Scrapy command with keyword arguments, wait for the crawl to finish, and read . There is no web server, database, or deployment manifest—the entire product is the spider logic plus committed sample output. The project layout follows standard scaffolding under : 1. **Listing pass** ( spider ): XPath over homepage headline anchors; apply ban-list and keyword filters. 2. **Article pass** ( ): XPath extraction of epigraph and body; light string cleanup for paragraph boundaries. 3. **Export**: Per-spider set , , , and . Each spider truncates its feed file to empty at import time before crawling. A second spider ( ) is structurally similar but targets a completely different site (US government historical collections reading room). It walks collection index links and exports , , and to . It uses a custom string identifying itself as a learning crawl. This spider shares the project boilerplate but is not integrated with the Mendoza news workflow.`,
		related: [],
		tags: ["scrappermdzol","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "ScrapperMDZOL",
	},
	{
		id: "sdgd-0-e12899c2",
		title: "SDGD — Healthcare HR Capacity Planning & Scheduling — SDGD",
		text: `## SDGD

> **Problem thesis (required):** SDGD (Sistema de Dimensionamiento y Gestión de Dotación) exists to turn static hospital organigrams into an operational **capacity-planning system** that measures and closes the gap between **demand** (positions defining required hours and skills) and **offer** (employees with contract regimes, reductions, and assignments). It adds a **scheduling module** for cyclic monthly calendars in clinical services, **legal validation** aligned with Ley 9539 and Circular 4, and **immutable audit logging** — all on a server-rendered Astro app backed by Supabase PostgreSQL with Row Level Security.`,
		related: [],
		tags: ["sdgd","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "SDGD",
	},
	{
		id: "sdgd-1-8948f114",
		title: "SDGD — Healthcare HR Capacity Planning & Scheduling — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Web application for healthcare HR administrators to model organizational units, define staffing demand, assign employees, calculate hour coverage, and generate hospital shift schedules under Argentine public-health labor rules. |
| Audience | RRHH Admin (single superuser role in MVP); internal developers and AI coding agents (Antigravity, Claude Code) maintaining the codebase. |`,
		related: [],
		tags: ["sdgd","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "SDGD",
	},
	{
		id: "sdgd-2-2e4dd1e6",
		title: "SDGD — Healthcare HR Capacity Planning & Scheduling — P1 — Demand vs. offer blindness in hospital staffing",
		text: `### P1 — Demand vs. offer blindness in hospital staffing

- **Who hurts:** HR administrators, hospital operations planners, and clinical service chiefs who must ensure services are covered without over- or under-staffing.
- **Pain today:** Organigrams count people, not **hours and competencies**. Spreadsheets cannot reliably compute coverage after reductions (Circular 4, lactation, ministerial consignments, union leave), cross-grouping distribution for Régimen 38, or partial/vacant position states.
- **How this repo answers:** A PostgreSQL schema models **positions** (demand), **employees** (offer), and **assignments** (the cross). Generated columns (e.g. ) and a DDD hours engine ( , value objects, period strategies) compute real vs. required hours. UI pages ( , , , ) expose CRUD and visual assignment flows with impact preview.
- **Out of scope:** Full payroll processing, bidirectional integration with external SGA systems (only stable IDs for manual reconciliation), and multi-role workflows for department heads (planned post-MVP).`,
		related: [],
		tags: ["sdgd","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "SDGD",
	},
	{
		id: "sdgd-3-695916a1",
		title: "SDGD — Healthcare HR Capacity Planning & Scheduling — P2 — Illegal or inconsistent assignments under Ley 9539",
		text: `### P2 — Illegal or inconsistent assignments under Ley 9539

- **Who hurts:** HR compliance officers and administrators assigning staff across units, guard shifts, and mixed functions.
- **Pain today:** Rules like maximum assignments per person, UN vs. UT exclusivity, mandatory certifications (ACLS, PALS), and Circular 4 regime determination by majority hours are enforced inconsistently in manual processes.
- **How this repo answers:** and encode rules R-01 through R-04 as blocking errors and warnings. Assignment actions validate before write; scheduling adds for double-booking, rest violations, skill mismatch, and uncovered slots.
- **Out of scope:** Automated legal interpretation beyond configured rules; complex leave management (operator assumes availability).`,
		related: [],
		tags: ["sdgd","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "SDGD",
	},
	{
		id: "sdgd-4-fe0ed414",
		title: "SDGD — Healthcare HR Capacity Planning & Scheduling — P3 — Cyclic hospital scheduling without a governed calendar engine",
		text: `### P3 — Cyclic hospital scheduling without a governed calendar engine

- **Who hurts:** Anesthesiology, ICU, neonatology, and similar services that need monthly rotation grids with morning slots, guard shifts, and cyclic OR rotations.
- **Pain today:** Excel calendars break when rules change, rotations advance manually, and conflicts (consecutive shifts, hour caps) are caught too late.
- **How this repo answers:** Scheduling tables ( , , , , , ) plus domain services ( , , , ). UI at provides calendar, rules, and conflicts views; generation via Astro Actions and REST API routes.
- **Out of scope:** Full operating-room management module (documented as future ).`,
		related: [],
		tags: ["sdgd","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "SDGD",
	},
	{
		id: "sdgd-5-1c97fa40",
		title: "SDGD — Healthcare HR Capacity Planning & Scheduling — 3. Product / idea",
		text: `## 3. Product / idea

SDGD is an **SSR multi-page application** (Astro MPA, no React islands) where every page loads server-rendered HTML from Supabase queries and mutates state through **Astro Actions** (server-side, Zod-validated). The mental model is three intertwined domains: 1. **Structure** — hierarchical (12 OU types from ministry to unit) containing that express operational demand (required hours, level N1–N9, load type, scheduling metadata). 2. **Staffing** — with contract type ( , , , etc.), reductions, consignments, and home OU; linked to positions via . 3. **Scheduling** — per-OU monthly calendars built from JSON rule definitions, slot definitions, and rotation sequences, with conflict detection and Excel export. Business logic lives in using DDD patterns (value objects, aggregates, strategies, decorators). Persistence is **server-only** — no client-side business state stores. Security relies on Supabase RLS (deny-by-default, authenticated policies) and audit triggers writing to . Deployment target is **Vercel** with the official Astro Vercel adapter ( ). Local development uses Bun and optionally Supabase CLI ( , migrations under ).`,
		related: [],
		tags: ["sdgd","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "SDGD",
	},
	{
		id: "sociedad-rural-oeste-argentino-0-8e3edca0",
		title: "SROA — institutional website and moderated institutional blog — Sociedad Rural del Oeste Argentino (SROA)",
		text: `## Sociedad Rural del Oeste Argentino (SROA)

> **Problem thesis (required):** The Sociedad Rural del Oeste Argentino is a civil and business guild representing cattle producers and the meat value chain in Mendoza and the Cuyo region, yet it lacked a credible owned web presence to communicate identity, strategic plan, authorities, and sector positions. This repository delivers that presence as a dual-stack application: an Astro SSR public site plus institutional blog with Google-authenticated commenting, staff moderation, contributor publishing, and real-time comment propagation — backed by exhaustive specs, ADRs, and agent instructions so the institution can operate digitally without surrendering narrative control to third-party platforms.`,
		related: [],
		tags: ["sociedad-rural-oeste-argentino","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "sociedad-rural-oeste-argentino",
	},
	{
		id: "sociedad-rural-oeste-argentino-1-4f54ecc0",
		title: "SROA — institutional website and moderated institutional blog — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Official institutional website and moderated blog for the Sociedad Rural del Oeste Argentino — static/SSR pages, Django API, Google OAuth, contributor workflow, and AWS-hosted deployment. |
| Audience | SROA members and allied entities, interested producers evaluating membership, journalists, public officials, general public interested in regional livestock policy, SROA staff ( role) and invited contributors ( role), and AI agents working from and . |
The GitHub repository description positions the project as the institutional site plus blog for SROA. Phase 1 (specification) produced a full documentation vault under with PRD, model, endpoints, architecture, infra, and twelve numbered ADRs. Phase 2 (implementation) is active: deliverable version **v1.1.1** per (2026-05-28), including the horizontal full-viewport home wheel, SEO redirects, robots/sitemap, CI deploy hardening, and auth styling fixes. Canonical agent instructions live in ; is a symlink to that file. The directory is listed in and is not present in the shallow clone — agent SSOT is plus .`,
		related: [],
		tags: ["sociedad-rural-oeste-argentino","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "sociedad-rural-oeste-argentino",
	},
	{
		id: "sociedad-rural-oeste-argentino-2-1f69c77b",
		title: "SROA — institutional website and moderated institutional blog — P1 — No owned institutional digital presence",
		text: `### P1 — No owned institutional digital presence

- **Who hurts:** SROA leadership, Comisión Directiva, allied member entities, and external stakeholders (press, provincial/national officials) who need authoritative institutional information.
- **Pain today:** Without a dedicated site, positioning as a technical and guild reference for western Argentine livestock depends on person-to-person outreach; the 30-year strategic plan, authorities roster, member entities, and public positions lack a stable canonical channel ( objectives OB-01 through OB-03).
- **How this repo answers:** Public institutional sections (about, authorities, member entities, strategic plan) are modeled as entities and member cards, pre-rendered or SSR-served from Astro consuming Django catalog endpoints. Content is editable by via Django admin for low-frequency entities ( , , ) and via the Astro admin panel for high-volume editorial work ( , ).
- **Out of scope:** Full observatory/open-data portal, legal/fiscal repository, interactive member directory, and producer services portal — all explicitly deferred in PRD §5.2 roadmap.`,
		related: [],
		tags: ["sociedad-rural-oeste-argentino","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "sociedad-rural-oeste-argentino",
	},
	{
		id: "sociedad-rural-oeste-argentino-3-4dbe97c8",
		title: "SROA — institutional website and moderated institutional blog — P2 — Slow, non-owned channel for sector news and debate",
		text: `### P2 — Slow, non-owned channel for sector news and debate

- **Who hurts:** SROA communications staff, sector-facing contributors, and registered readers who want timely commentary on norms, prices, and institutional milestones.
- **Pain today:** Reactive communication through external media has short windows; there is no owned blog with governed public conversation under SROA moderation policy ( OB-05, OB-06).
- **How this repo answers:** entities power the blog and time-bounded posts (flagged via + ). Registered Google-authenticated users comment with mandatory editorial reactions (six-emoticon set). Comments publish immediately; and post-author roles can hide or delete per PRD §9. WebSocket islands push and events live ( §7, §4). Anti-spam in MVP is Google-verified accounts only (ADR-005).
- **Out of scope:** Nested comment threads, public JWT APIs, email notification of comments (in-app notifications only), and reverting hidden content without a new ADR.`,
		related: [],
		tags: ["sociedad-rural-oeste-argentino","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "sociedad-rural-oeste-argentino",
	},
	{
		id: "sociedad-rural-oeste-argentino-4-faaf6b83",
		title: "SROA — institutional website and moderated institutional blog — P3 — Membership recruitment and censused audience building",
		text: `### P3 — Membership recruitment and censused audience building

- **Who hurts:** Prospective members evaluating adhesion, SROA staff tracking institutional outreach, and future marketing operators who need a first-party contact base ( OB-04, OB-07 — high priority).
- **Pain today:** Interested producers cannot self-serve information and contact flows; every Google login creates potential audience data but without a system there is no structured user census or contributor onboarding.
- **How this repo answers:** Public "Sumate" form posts to (email to Comisión Directiva, no persistence). Google OAuth via Cognito creates atomically on first signup ( signal). invite contributors by email; lazy token validation elevates role on first login. Profile exposes comment history including moderated items. KPIs K-01 through K-03 (comment volume, reaction distribution, visit analytics) are defined in PRD §4 for future measurement.
- **Out of scope:** Paid membership billing, CRM integration, newsletter campaigns (audience DB is foundational but campaign tooling is not in MVP).`,
		related: [],
		tags: ["sociedad-rural-oeste-argentino","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "sociedad-rural-oeste-argentino",
	},
	{
		id: "sociedad-rural-oeste-argentino-5-198ffb5e",
		title: "SROA — institutional website and moderated institutional blog — 3. Product / idea",
		text: `## 3. Product / idea

The system is a **two-application product** on a **single public hostname**, split by path at the load balancer: Astro serves all non-API pages (SSR for authenticated routes; build-time limitation led to SSR-only mode per comments), while Django serves , , OAuth account routes, and WebSockets. The mental model is **backend-first business logic** (ADR-007): Astro renders and proxies; Django owns validation, authorization, Markdown-to-HTML rendering for bodies, email triggers, and realtime fan-out. Public visitors browse institutional content, blog posts, and active events. Registered users comment with reactions. Contributors draft/publish posts and moderate comments on their own posts. Staff moderate all content, manage invitations, and configure editorial reactions/pages in Django admin. The home page (v1.0.0+) is a horizontal "wheel" of full-viewport scenes (hero → events → blog → join CTA) with keyboard, wheel, swipe, and caret navigation — a signature UX differentiator documented in and . Authentication never stores tokens in the frontend: session cookies issued by Django/allauth after Cognito-brokered Google OAuth. Astro middleware calls server-side before rendering protected routes. Mutations flow as HTML form POST → Astro SSR route → server-to-server DRF with session cookie — not browser mutations (ADR-008 exception: WebSocket island is the only`,
		related: [],
		tags: ["sociedad-rural-oeste-argentino","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "sociedad-rural-oeste-argentino",
	},
	{
		id: "syv-character-kit-0-007899d9",
		title: "SyV Character Kit — PRD, canonical sheets, and character mocks — SyV Character Kit",
		text: `## SyV Character Kit

> **Problem thesis (required):** This private repository is **documentation, not an application**. It is the authoritative design kit for *Subordinación y Valor* (SyV) character sheets, tag catalogs, squad fixtures, procedural creation rules, and a stack-agnostic HTTP API contract. Any team building a battle engine, lore site, scenario generator, or narrative pipeline can implement against these specs without inheriting a particular language, framework, database, or deployment target. The kit solves the fragmentation of character/squad design across the SyV ecosystem by centralizing schemas, mocks, game-design decision records (GDDRs), and editorial policy in one rolling-release document tree.`,
		related: [],
		tags: ["syv-character-kit","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "syv-character-kit",
	},
	{
		id: "syv-character-kit-1-e3129752",
		title: "SyV Character Kit — PRD, canonical sheets, and character mocks — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | SyV — Character Kit: PRD, canonical character sheet, tag catalog, squad mocks, and battle-motor design for squad-vs-squad combat in a dieselpunk Patagonian war setting (year 2178). |
| Audience | Game designers, narrative writers, API implementers, battle-motor developers, QA pipelines, and AI agents curating SyV canon; not end players directly. |`,
		related: [],
		tags: ["syv-character-kit","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "syv-character-kit",
	},
	{
		id: "syv-character-kit-2-c8331497",
		title: "SyV Character Kit — PRD, canonical sheets, and character mocks — P1 — No portable, stack-agnostic character contract for SyV",
		text: `### P1 — No portable, stack-agnostic character contract for SyV

- **Who hurts:** Teams building battle engines, lore galleries, scenario generators, and narrative tooling across the SyV ecosystem.
- **Pain today:** Each consumer invented its own character shape, tag vocabulary, and persistence rules. Stats, ranks, equipment, and squad membership diverged silently between repos. Integrations required ad-hoc translation layers and broke when one side renamed a field.
- **How this repo answers:** Publishes synchronized contracts in , , , and — character sheet schema ( ), tag system ( ), squad schema ( ), attribute vocabulary ( ), and 28 mapped user stories ( ). The HTTP surface is specified but not implemented here; implementers choose their own stack.
- **Out of scope:** Running API server, database, authentication, UI, or deployment. Those belong to downstream application repos.`,
		related: [],
		tags: ["syv-character-kit","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "syv-character-kit",
	},
	{
		id: "syv-character-kit-3-14f06c01",
		title: "SyV Character Kit — PRD, canonical sheets, and character mocks — P2 — Temporal character state and squad tactics without a shared lifecycle model",
		text: `### P2 — Temporal character state and squad tactics without a shared lifecycle model

- **Who hurts:** Writers and systems that must track fighters who change over time (promotions, injuries, equipment capture, squad transfers) while also running squad-level combat with derived aggregates (force, cohesion, morale, movement).
- **Pain today:** Flat character records cannot express append-only milestones, ephemeral vs canonized lifecycles, opaque 8-character slugs separate from display names, or volatile combat state ( ) that lives on the squad mirror rather than the character sheet.
- **How this repo answers:** Defines six structural blocks plus flat , milestone-driven mutability, deterministic stats-by-rank at creation, seed-reproducible ephemerals, canonization freeze of prose, squad entity with embedded members and derived fields, and GDDR-02 initiative grid rules. Provides 22+ immutable mock characters and 2 squad fixtures as living templates.
- **Out of scope:** Full battle resolution (GDDR-02 still in active design), hito reversal, arbitrary canon editing outside milestones, generating full squads in one API call.`,
		related: [],
		tags: ["syv-character-kit","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "syv-character-kit",
	},
	{
		id: "syv-character-kit-4-33039557",
		title: "SyV Character Kit — PRD, canonical sheets, and character mocks — P3 — Curated canon and agent-safe editorial workflow",
		text: `### P3 — Curated canon and agent-safe editorial workflow

- **Who hurts:** AI agents and human editors maintaining tags, mocks, and lore fidelity without corrupting irreplacable narrative prose or inventing non-canonical terminology.
- **Pain today:** Schema changes orphan fixtures; Obsidian graph needs conflict with portable YAML; agents duplicate changelog/version noise into living contracts; lore leaks from non-canonical sibling repos.
- **How this repo answers:** enforces rolling-release docs (no version stamps in PRD), strict API↔MODEL sync, mock migration scripts on schema change, lore read-only pointer to the main SyV universe docs vault, Obsidian-specific skills ( , , ), and frontmatter convention to avoid Obsidian's reserved field.
- **Out of scope:** Writing or modifying the external SyV universe lore repo; validating tags at schema level (custom tags are accepted by design).`,
		related: [],
		tags: ["syv-character-kit","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "syv-character-kit",
	},
	{
		id: "syv-character-kit-5-4c5b82b8",
		title: "SyV Character Kit — PRD, canonical sheets, and character mocks — 3. Product / idea",
		text: `## 3. Product / idea

The central idea is a **documentation product** that fully specifies how SyV characters and squads exist, are created, evolve, and fight — without shipping runtime code. Cloning this repo gives a designer or implementer: 1. **Schemas** — field-by-field character sheet, tag catalog entry, and squad models with YAML templates. 2. **Contracts** — HTTP routes and persistence entities kept in strict sync. 3. **Game design** — GDDR-01 mandatory creation flow (phases 1–3 defined; phase 4 pending) and GDDR-02 squad-vs-squad battle motor (initiative subsystem substantially drafted). 4. **Data** — ~156 tag catalog notes under , 24 character mock notes under (22 core squad fighters plus NPC examples), 2 squad fixtures under , and name pools under . 5. **Tooling hints** — Python scripts for validation, name sampling, slug migration, and initiative simulation; Obsidian Bases for tabular views. Mental model: **tags are first-class**. Almost everything discrete (skills, traits, perks, equipment, health, mental state, faction, rank, squad membership) is a dot-notation tag in a multiset ( , ). Structural blocks hold identity, three base attributes ( , , ), frozen biography prose, append-only history, ally/nemesis links with prose, and metadata. Squads are first-class entities with members, history, and computed tactical aggregates; combat-volatile state attaches to squad`,
		related: [],
		tags: ["syv-character-kit","github","private","high","summary"],
		visibility: "private",
		importance: "high",
		sourceRepo: "syv-character-kit",
	},
	{
		id: "syv-game-system-0-22ef913a",
		title: "syv-game-system — platform-agnostic rules vault for Subordinación y Valor — syv-game-system",
		text: `## syv-game-system

> **Problem thesis (required):** This repository is the **platform-agnostic design vault** for *Subordinación y Valor* (SyV), a simultaneous-turn (WEGO) tactical wargame set in a militarized alternate Patagonia. It exists so that rules, mechanics, lore, and abstract data models live in one Obsidian-structured knowledge base that any future implementation — physical tabletop, PC, or mobile — can consume without rewriting design from scratch. The vault deliberately separates human-readable reglamento from machine-oriented JSON schemas, documents a deterministic combat resolver ("Fricción") distinct from a planned Gemini-powered narrative layer, and enforces agent editing conventions so AI-assisted design work stays consistent and non-contradictory.`,
		related: [],
		tags: ["syv-game-system","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "syv-game-system",
	},
	{
		id: "syv-game-system-1-4b7c03da",
		title: "syv-game-system — platform-agnostic rules vault for Subordinación y Valor — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Platform-agnostic Obsidian vault of WEGO wargame rules, JSON schemas, mathematical foundations, and Patagonian lore for *Subordinación y Valor*. |
| Audience | Game designers and rule authors; AI agents acting as "Diseñador de Sistemas de Juego y Arquitecto Conceptual" per ; future engine implementers who need schemas and reglamento as SSOT. |`,
		related: [],
		tags: ["syv-game-system","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "syv-game-system",
	},
	{
		id: "syv-game-system-2-8c7f8f14",
		title: "syv-game-system — platform-agnostic rules vault for Subordinación y Valor — P1 — Platform lock-in before any implementation exists",
		text: `### P1 — Platform lock-in before any implementation exists

- **Who hurts:** Anyone who wants to prototype SyV on tabletop, then port to digital, without maintaining parallel rule documents or reverse-engineering informal notes.
- **Pain today:** Game design notes often live in ad-hoc docs, wikis, or engine-specific prototypes. Rules drift; data shapes are implied rather than specified; physical and digital versions diverge.
- **How this repo answers:** The README and state explicit **platform agnosticism**: logic is expressed only in Markdown, JSON Schema, Mermaid, and diagrams — never production code in Python, Rust, C#, etc. The directory defines abstract contracts for , , , , and that any runtime can validate against. The reglamento tree is the human SSOT; schemas are the machine SSOT.
- **Out of scope:** Any runnable game client, server, database, or CI pipeline. The single Python script in is a throwaway ASCII hex visualizer, not part of the design deliverable.`,
		related: [],
		tags: ["syv-game-system","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "syv-game-system",
	},
	{
		id: "syv-game-system-3-7d20c2d9",
		title: "syv-game-system — platform-agnostic rules vault for Subordinación y Valor — P2 — Deterministic combat vs. immersive narrative",
		text: `### P2 — Deterministic combat vs. immersive narrative

- **Who hurts:** Players and designers who want tactically fair, replayable combat logs but also rich "Cronista del Frente" battle reports instead of raw dice tables.
- **Pain today:** Mixing narrative generation into combat math makes outcomes hard to audit, balance, or replay; pure numbers bore players.
- **How this repo answers:** The **Motor de Resolución «Fricción»** is specified as a deterministic/entropic resolver that simulates up to six one-hour combat rounds per six-hour turn, producing a structured log conforming to . A separate documented pipeline ( ) sends that JSON to the **Gemini API** with system instructions for trench-realism tone, faction jargon, and activation of per-soldier H.I.T.O.S. aspects (Concepto, Perk, Complicación). Math lives in ; story lives in the IA chapter — never merged in this repo's source tree.
- **Out of scope:** Actual Gemini API integration code, API keys, or a deployed narrative service. Only the contract and prompt shape are documented.`,
		related: [],
		tags: ["syv-game-system","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "syv-game-system",
	},
	{
		id: "syv-game-system-4-5df19e2c",
		title: "syv-game-system — platform-agnostic rules vault for Subordinación y Valor — P3 — Rule consistency under combinatorial complexity",
		text: `### P3 — Rule consistency under combinatorial complexity

- **Who hurts:** Designers and AI agents extending a system with WEGO orders, tag pipelines, squad aggregation, hex movement, initiative tracks, and five lore factions.
- **Pain today:** WEGO games with individual soldiers inside squad tokens, tag-based modifiers, and simultaneous secret orders produce edge cases (collisions, desorganizado states, FAP crew requirements) that contradict across documents without a governed vault structure.
- **How this repo answers:** is the Map of Content with integrated glossary and faction synonym table. defines tags as a **non-transactional document database** with a deterministic pre-roll pipeline (flat modifiers → multipliers → health effects → context). imposes red lines: no implementation code, mechanical symmetry for Blue/Red in MVP, YAML frontmatter on every reglamento/lore note, and mandatory index updates for new notes. Mathematical probability tables in the architecture pill ground dice design ( median, favorable min, unfavorable max).
- **Out of scope:** Automated rule validation, linter, or playtest harness. Status across files is predominantly (draft).`,
		related: [],
		tags: ["syv-game-system","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "syv-game-system",
	},
	{
		id: "syv-game-system-5-d891049f",
		title: "syv-game-system — platform-agnostic rules vault for Subordinación y Valor — 3. Product / idea",
		text: `## 3. Product / idea

SyV is a **hex-grid WEGO wargame** where two players (MVP: symmetric Confederación Azul vs. Ejército Rojo) command **escuadras** (squad tokens) on a map where **1 hex = 1 km**. A full in-fiction day spans four six-hour strategic turns (Mañana, Tarde, Noche, Madrugada). Each turn has three phases: 1. **Fase I · Mando** — simultaneous secret order assignment from a limited pool tied to leadership stats. 2. **Fase II · Combate** — orders revealed; movement by initiative; collisions trigger individual combat resolved hour-by-hour (up to 6 hours) by «Fricción». 3. **Fase III · Reabastecimiento** — logistics, recovery (e.g. 1d4 restoration), supply checks. Individual **unidades** (soldiers) have FIS/TAC/MEN attributes, H.I.T.O.S. aspect phrases, tags, weapons, and health — but only **escuadras** occupy hexes. Combat uses **3d10 roll-under** with median (standard), min (favorable), or max (desfavorable) selection; triple-zero is heroic crit with automatic in-match XP; triple-nine is catastrophic fumble. The repository is structured as an **Obsidian vault** ( config present) with three top-level zones: - ** ** — numbered rule chapters from introduction through initiative, dice, combat, and future plans. - ** ** — JSON schemas plus mathematical "píldoras" for designers and implementers. - ** ** — factions, default map, and named characters (narrative only; must not`,
		related: [],
		tags: ["syv-game-system","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "syv-game-system",
	},
	{
		id: "syv-godot-0-b3ca5651",
		title: "Subordinación y Valor — WEGO hex strategy (Godot 4.4 + FastAPI) — Subordinación y Valor (SyV-Godot)",
		text: `## Subordinación y Valor (SyV-Godot)

> **Problem thesis (required):** This repository is the **playable implementation workspace** for *Subordinación y Valor* (SyV), a 1v1 simultaneous-turn (WEGO) tactical strategy game on a hexagonal board. It exists to prove the core loop — secret order planning, simultaneous resolution, and state sync — with a **Godot 4.4 thin client** (rendering and input only) backed by an **authoritative server** that owns rules, validation, and deterministic combat. The target architecture is FastAPI + Redis + PostgreSQL behind Traefik; at summary time the tree is in **transitional MVP**: game logic and ENet RPCs run inside Godot headless server scripts, while the Python backend is scaffolded with health endpoints and dependency wiring but not yet the full game API described in the PRD.`,
		related: [],
		tags: ["syv-godot","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "syv-godot",
	},
	{
		id: "syv-godot-1-93ad3e0e",
		title: "Subordinación y Valor — WEGO hex strategy (Godot 4.4 + FastAPI) — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Turn-based WEGO hex strategy with simultaneous secret orders, authoritative server resolution, and a Godot client that carries zero rule logic. |
| Audience | Game developers on the SyV team; AI agents using skills for Godot, FastAPI, and Docker setup; future players on PC (Steam/Linux target per PRD). Design lore and platform-agnostic rules live in sibling repos ( , ). |`,
		related: [],
		tags: ["syv-godot","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "syv-godot",
	},
	{
		id: "syv-godot-2-414ee65f",
		title: "Subordinación y Valor — WEGO hex strategy (Godot 4.4 + FastAPI) — P1 — Authoritative WEGO without trusting the client",
		text: `### P1 — Authoritative WEGO without trusting the client

- **Who hurts:** Multiplayer strategy developers building simultaneous-turn games where both players plan in secret and orders resolve at once — any client-side rule logic is exploitable.
- **Pain today:** Thin-client architectures often stall at prototype because transport, order schemas, phase machines, and conflict resolution are intertwined in UI code. WEGO specifically requires hiding opponent orders during planning, then applying all committed orders in one deterministic pass.
- **How this repo answers:** The PRD ( ) defines a five-phase server state machine — LOBBY → PLANNING → PROCESSING → OUTCOME → END — with validating and applying moves. Godot scripts already implement this loop in and : orders queue during PLANNING, both players commit, PROCESSING runs resolver logic, OUTCOME broadcasts new state. exposes RPCs ( , , , ) so clients only send intents and receive scoped state. The long-term plan moves this logic into FastAPI with Redis cache and PostgreSQL persistence; already lists SQLAlchemy, asyncpg, redis, python-jose, and websockets for that migration.
- **Out of scope:** Full SyV rule depth from the design vault (squad hierarchies, tag pipelines, radio interception, fog-of-war scoping). Attack orders return "not implemented yet" in . Victory conditions and turn counter are stubbed ( hardcoded in state`,
		related: [],
		tags: ["syv-godot","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "syv-godot",
	},
	{
		id: "syv-godot-3-748d0b67",
		title: "Subordinación y Valor — WEGO hex strategy (Godot 4.4 + FastAPI) — P2 — Repeatable local dev for Godot + backend services",
		text: `### P2 — Repeatable local dev for Godot + backend services

- **Who hurts:** Solo or small-team developers who must run Godot, a Python API, Redis, PostgreSQL, and a reverse proxy together every session.
- **Pain today:** Manual container orchestration, missing health checks, and "did I start the server?" friction block iteration on a game that needs both GUI and headless processes.
- **How this repo answers:** defines , , , and with healthchecks and Traefik routing for . wraps , , , , . verifies Docker, uv, Godot; copies → ; builds containers. (via ) is a smart launcher: starts Docker if needed, waits for healthy services, launches Godot, optionally tears down on exit. Shell wrappers and delegate to Python for single source of truth.
- **Out of scope:** Production deployment, CI/CD pipelines (no workflows in tree), Steam packaging, or cloud hosting. Dev secrets in compose use placeholder values only.`,
		related: [],
		tags: ["syv-godot","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "syv-godot",
	},
	{
		id: "syv-godot-4-5f48a58b",
		title: "Subordinación y Valor — WEGO hex strategy (Godot 4.4 + FastAPI) — P3 — Hex grid and order primitives as tested building blocks",
		text: `### P3 — Hex grid and order primitives as tested building blocks

- **Who hurts:** Implementers who need correct axial/cubic hex math and serializable order models before building board UI and combat.
- **Pain today:** Hex coordinate bugs silently break movement validation; order dictionaries from RPCs need tolerant parsing across editor, hot-seat, and future HTTP clients.
- **How this repo answers:** implements axial ↔ cubic conversion, distance, neighbors, flat-top pixel mapping, and rounding. is a headless MainLoop self-test. , , , and define Resource-based domain types (unit types Infantry/Officer/Captain, order types MOVE/ATTACK/DEPLOY/DEFEND/CANCEL, map keyed by Vector2i). parses heterogeneous (strings, arrays, dicts, Vector2i) from RPC payloads. simulates two-player connect → order → commit → resolution without a live network.
- **Out of scope:** Full map generation, terrain modifiers, pathfinding beyond single-step moves, or gdUnit4 integration (mentioned in PRD as future; current Godot tests are lightweight scripts).`,
		related: [],
		tags: ["syv-godot","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "syv-godot",
	},
	{
		id: "syv-godot-5-3693f25f",
		title: "Subordinación y Valor — WEGO hex strategy (Godot 4.4 + FastAPI) — 3. Product / idea",
		text: `## 3. Product / idea

SyV-Godot is a **1v1 WEGO hex tactics game** branded *Subordinación y Valor* ( config name). Players issue secret orders during a planning phase; when both commit, the server resolves all orders simultaneously and pushes the new battlefield state. The MVP supports **hot-seat** play on one machine: the client manages player handoff locally while the server treats connections uniformly ( §9). The **target mental model** (from README and PRD): **Current implementation split:** - **Godot client path:** detects / / headless mode. Client loads , connects via ENet to port 7777. bridges UI actions to RPCs. - **Godot server path:** hosts . Can run headless with or spawn as child process (export builds only; editor warns to run server manually). - **Python backend path:** exposes FastAPI with CORS for Godot, lifespan logging, and health routes only. Package layout reserves , , , , but modules are empty stubs. The game ships Kenney CC0 assets under , , , and for MVP visuals.`,
		related: [],
		tags: ["syv-godot","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "syv-godot",
	},
	{
		id: "syv-mcp-tools-0-63bf285c",
		title: "SyV MCP Tools — Markdown metadata validation server for Subordinación y Valor — SyV MCP Tools",
		text: `## SyV MCP Tools

> **Problem thesis (required):** The Subordinación y Valor (SyV) project maintains a large Markdown documentation vault with strict Spanish YAML frontmatter conventions. Human editors and AI agents routinely introduce metadata drift — wrong field order, English keys, missing required fields, malformed list blocks. This repository provides an MCP server that exposes **validate** and **extract** tools so agents can check files against the SyV metadata guide before committing changes, plus auxiliary maintenance scripts for index generation and tag cleanup.`,
		related: [],
		tags: ["syv-mcp-tools","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "syv-mcp-tools",
	},
	{
		id: "syv-mcp-tools-1-f87684de",
		title: "SyV MCP Tools — Markdown metadata validation server for Subordinación y Valor — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | MCP server with tools for validating and extracting YAML frontmatter metadata from SyV Markdown files. |
| Audience | SyV project collaborators, AI coding agents (Cursor, Claude Desktop, Grok) connected via MCP, and maintainers of the parent SyV lore repository. |`,
		related: [],
		tags: ["syv-mcp-tools","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "syv-mcp-tools",
	},
	{
		id: "syv-mcp-tools-2-8a35e6fc",
		title: "SyV MCP Tools — Markdown metadata validation server for Subordinación y Valor — P1 — Enforcing SyV Markdown metadata schema at edit time",
		text: `### P1 — Enforcing SyV Markdown metadata schema at edit time

- **Who hurts:** SyV writers, lore editors, and AI agents generating or refactoring Markdown files across the six top-level content zones ( through ).
- **Pain today:** The SyV metadata guide ( in the parent repo) defines precise rules — Spanish field names, strict field ordering, vertical list syntax for / / , conditional personaje fields — but nothing prevents non-compliant frontmatter from landing in the vault. Manual review is slow and inconsistent.
- **How this repo answers:** The MCP tool runs a deterministic validator ( ) that checks file existence, YAML frontmatter presence, key casing, field order, required fields ( , , ), list formatting, and personaje-specific conditional rules. Returns structured JSON with (bool) and (error detail on failure).
- **Out of scope:** Does not validate Markdown body content, internal links, spoiler policy in prose, or render/publish pipelines. Does not modify files — read-only validation.`,
		related: [],
		tags: ["syv-mcp-tools","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "syv-mcp-tools",
	},
	{
		id: "syv-mcp-tools-3-bda84ca6",
		title: "SyV MCP Tools — Markdown metadata validation server for Subordinación y Valor — P2 — Machine-readable metadata extraction for agents",
		text: `### P2 — Machine-readable metadata extraction for agents

- **Who hurts:** AI agents that need to read SyV document metadata (title, folder, tags, region, character factions) to make routing or summarization decisions without parsing YAML themselves.
- **Pain today:** Each agent session would need to re-implement frontmatter parsing, list handling, and validation logic — error-prone and wasteful of context tokens.
- **How this repo answers:** The MCP tool validates first, then parses frontmatter into a JSON dictionary with properly typed list fields. Agents call one tool and receive structured metadata or a clear error.
- **Out of scope:** Does not query a database or search index; operates on a single file path at a time. No batch operations via MCP (though CLI supports single-file mode).`,
		related: [],
		tags: ["syv-mcp-tools","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "syv-mcp-tools",
	},
	{
		id: "syv-mcp-tools-4-f7f311d1",
		title: "SyV MCP Tools — Markdown metadata validation server for Subordinación y Valor — P3 — Corpus maintenance utilities alongside the MCP server",
		text: `### P3 — Corpus maintenance utilities alongside the MCP server

- **Who hurts:** SyV maintainers performing structural housekeeping — rebuilding the vault index, removing deprecated frontmatter keys.
- **Pain today:** These one-shot tasks don't belong in the main lore repo but need to live somewhere versioned and discoverable.
- **How this repo answers:** Ships (walks SyV zone directories and writes ), (strips deprecated lines from all Markdown files), and (prepends timestamped lines to for debugging MCP traffic).
- **Out of scope:** Not integrated into MCP tool surface; run manually from CLI. expects to run from within the parent SyV repo tree (uses two levels up from script location).`,
		related: [],
		tags: ["syv-mcp-tools","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "syv-mcp-tools",
	},
	{
		id: "syv-mcp-tools-5-a2bdc338",
		title: "SyV MCP Tools — Markdown metadata validation server for Subordinación y Valor — 3. Product / idea",
		text: `## 3. Product / idea

The central idea is a **thin MCP adapter** over a pure-Python metadata validation library: The validator encodes the SyV metadata contract as code: ten ordered fields ( → ), three list-type fields requiring vertical syntax, prohibition of English keys ( , , ), and personaje detection logic (presence of or triggers both being required). This is the same ruleset documented in the parent project's metadata guide, but executable.`,
		related: [],
		tags: ["syv-mcp-tools","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "syv-mcp-tools",
	},
	{
		id: "welp-app-0-75e9cfbb",
		title: "Welp App — internal purchase and payment workflow — Welp App",
		text: `## Welp App

> **Problem thesis (required):** Welp App is an internal management system whose core product is **Welp Payflow** — a role-based, server-rendered workflow for purchase and payment requests ("tickets") that move through authorization, budgeting, dual manager/director sign-off, payment processing, shipping, and closure. It exists because ad-hoc email or spreadsheet processes cannot enforce organizational boundaries (UDN, sector), preserve an auditable message history, attach budgets securely, or surface "needs attention" work queues per role. The stack deliberately favors Django + HTMX over a SPA so operators get fast, accessible pages with near-zero client JavaScript.`,
		related: [],
		tags: ["welp-app","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "welp-app",
	},
	{
		id: "welp-app-1-2deea424",
		title: "Welp App — internal purchase and payment workflow — 1. Identity",
		text: `## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Internal Django monolith for purchase/payment tickets with a data-defined status machine, granular roles per business unit and sector, and a server-first HTMX UI. |
| Audience | Internal operators at Grupo ALVS — end users opening requests, supervisors/managers/directors authorizing, technicians attaching budgets, purchase managers processing payments; developers and AI agents maintaining the codebase. |`,
		related: [],
		tags: ["welp-app","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "welp-app",
	},
	{
		id: "welp-app-2-16cee076",
		title: "Welp App — internal purchase and payment workflow — P1 — Uncontrolled purchase/payment request flow",
		text: `### P1 — Uncontrolled purchase/payment request flow

- **Who hurts:** End users, supervisors, managers, directors, technicians, and purchase managers across multiple business units (UDNs) and sectors who must coordinate buying and paying for goods/services.
- **Pain today:** Without a centralized system, requests scatter across informal channels; approvals are hard to trace; budgets and invoices lack a single attachment store; nobody has a reliable queue of "what needs my action now."
- **How this repo answers:** models tickets ( , , ) tied to , , and . Status transitions are declared in ( ) as a finite state machine with labels, allowed transitions, responsible roles, Mermaid diagram styling, and UI affordances (comment boxes, attachment uploads, amount inputs). Each transition creates rows forming an auditable timeline. filters visibility and powers a "needs attention" view based on role-specific status lists.
- **Out of scope:** General ERP, inventory, vendor master data, accounting ledger posting, or external supplier portals. DRF is installed but no REST API surface is wired; the product is browser HTML, not a public API.`,
		related: [],
		tags: ["welp-app","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "welp-app",
	},
	{
		id: "welp-app-3-052122d0",
		title: "Welp App — internal purchase and payment workflow — P2 — Multi-tenant organizational scoping without a separate database per unit",
		text: `### P2 — Multi-tenant organizational scoping without a separate database per unit

- **Who hurts:** Staff who must only see tickets for their UDN/sector; security reviewers ensuring cross-tenant isolation.
- **Pain today:** Shared tools often leak data when queries fetch by primary key alone; role matrices sprawl across views.
- **How this repo answers:** links users to with permissions derived from on save. centralizes authorization (superuser → staff → role checks). scopes list/detail queries. Templates hide actions via server-side checks — no client-side permission logic.
- **Out of scope:** Perfect isolation today — documented **IDOR debt** remains on and (see ); authenticated users can still read some tickets/attachments by ID until fixed.`,
		related: [],
		tags: ["welp-app","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "welp-app",
	},
	{
		id: "welp-app-4-f345b845",
		title: "Welp App — internal purchase and payment workflow — P3 — Maintainable internal UI for Argentine currency context",
		text: `### P3 — Maintainable internal UI for Argentine currency context

- **Who hurts:** Users entering amounts in USD or ARS; finance staff needing official exchange rates without blocking page renders.
- **Pain today:** Live FX calls on every page slow ticket lists; toggling display currency requires heavy JS frameworks.
- **How this repo answers:** Amounts stored in USD ( ); optional per-ticket . Official ARS rate fetched from DolarAPI, cached three hours ( ), refreshed via HTMX background endpoint with for reactive UI updates. Currency preference stored in a cookie; minimal JS confined to where HTMX cannot suffice.
- **Out of scope:** Treasury hedging, multi-currency beyond USD/ARS, or guaranteed real-time FX during API outages (falls back to last cache or "no rate").`,
		related: [],
		tags: ["welp-app","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "welp-app",
	},
	{
		id: "welp-app-5-6e25156b",
		title: "Welp App — internal purchase and payment workflow — 3. Product / idea",
		text: `## 3. Product / idea

Welp App is a **server-first Django monolith**. The browser talks HTTP and HTMX to Gunicorn/Django; Django renders HTML templates with inclusion-tag components ( , ). Interactivity is layered: native HTML5 first, then HTMX partial swaps, then Alpine.js only as last resort, then small Vite-bundled JS modules for attachments and currency. The mental model: Root URL redirects to . Users log in via ; enforces authentication on all non-exempt paths. Payflow home offers navigation to create tickets, list/filter tickets, and view detail pages with Mermaid workflow diagrams per ticket.`,
		related: [],
		tags: ["welp-app","github","private","normal","summary"],
		visibility: "private",
		importance: "normal",
		sourceRepo: "welp-app",
	}
];

export const GH_PRIVATE_CHUNKS_ES = defineChunks("gh-private", "es", DEFS);
