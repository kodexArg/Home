---
id: sdgd-4-fe0ed414
title: "SDGD — Healthcare HR Capacity Planning & Scheduling — P3 — Cyclic hospital scheduling without a governed calendar engine"
visibility: private
importance: high
source_repo: "SDGD"
related: []
tags: ["sdgd", "github", "private", "high", "summary"]
---

### P3 — Cyclic hospital scheduling without a governed calendar engine - **Who hurts:** Anesthesiology, ICU, neonatology, and similar services that need monthly rotation grids with morning slots, guard shifts, and cyclic OR rotations. - **Pain today:** Excel calendars break when rules change, rotations advance manually, and conflicts (consecutive shifts, hour caps) are caught too late. - **How this repo answers:** Scheduling tables (scheduling_slots, scheduling_rules, schedule_periods, schedule_entries, schedule_conflicts, rotation_sequences) plus domain services (RuleMatcher, RotationService, ScheduleGenerator, ExcelExporter). UI at src/pages/scheduling/ provides calendar, rules, and conflicts views; generation via Astro Actions and REST API routes. - **Out of scope:** Full operating-room management module (documented as future Future_Module_OR_Management.md).
