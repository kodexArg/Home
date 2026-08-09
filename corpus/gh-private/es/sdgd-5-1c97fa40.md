---
id: sdgd-5-1c97fa40
title: "SDGD — Healthcare HR Capacity Planning & Scheduling — 3. Product / idea"
visibility: private
importance: high
source_repo: "SDGD"
related: []
tags: ["sdgd", "github", "private", "high", "summary"]
---

## 3. Product / idea SDGD is an **SSR multi-page application** (Astro MPA, no React islands) where every page loads server-rendered HTML from Supabase queries and mutates state through **Astro Actions** (server-side, Zod-validated). The mental model is three intertwined domains: 1. **Structure** — hierarchical organizational_units (12 OU types from ministry to unit) containing positions that express operational demand (required hours, level N1–N9, load type, scheduling metadata). 2. **Staffing** — employees with contract type (REGIMEN_27, REGIMEN_38, PRESTADOR, etc.), reductions, consignments, and home OU; linked to positions via assignments. 3. **Scheduling** — per-OU monthly calendars built from JSON rule definitions, slot definitions, and rotation sequences, with conflict detection and Excel export. Business logic lives in src/lib/domain/ using DDD patterns (value objects, aggregates, strategies, decorators). Persistence is **server-only** — no client-side business state stores. Security relies on Supabase RLS (deny-by-default, authenticated policies) and audit triggers writing to audit_logs. Deployment target is **Vercel** with the official Astro Vercel adapter (output: 'server'). Local development uses Bun and optionally Supabase CLI (supabase/config.toml, migrations under supabase/migrations/).
