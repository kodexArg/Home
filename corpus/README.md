# KodexCorpus

Markdown authoring SSOT for KodexBar knowledge packs ([ADR 13](../docs/adr-13-repo-layout.md)).

```
bun run corpus:compile   # → src/kodexbar/packs/
bun run index:corpus     # → Vectorize (needs bun run dev)
```

Chunk bodies must not contain URL, domain, or email literals. Use `related` for destination ids.
Identity age uses the placeholder `{{AGE_YEARS}}` (resolved at compile time from birth date 1978-4-4).
