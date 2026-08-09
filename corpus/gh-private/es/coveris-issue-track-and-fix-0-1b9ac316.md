---
id: coveris-issue-track-and-fix-0-1b9ac316
title: "Coveris Issue Track and Fix — autonomous GitHub issue triage and repair agents — Coveris Issue Track and Fix"
visibility: private
importance: high
source_repo: "coveris-issue-track-and-fix"
related: []
tags: ["coveris-issue-track-and-fix", "github", "private", "high", "summary"]
---
## Coveris Issue Track and Fix

> **Problem thesis (required):** This private repository hosts a two-stage autonomous agent pipeline for the Coveris product line. A **Tracker** agent investigates live GitHub issues against the cotton-coveris-mvp application workspace, produces structured triage intelligence (difficulty, severity, root-cause addendum), and a deterministic **Router** decides whether to defer, skip, or invoke a **Fixer** agent. The Fixer reads code (read-only locally), applies changes exclusively via GitHub API tools (branch, commit, pull request), and escalates unresolvable issues by commenting and labeling them . The repo also ships an Obsidian documentation vault, Antigravity SDK reference docs, and a library of agent skills for Angular and Django work.
