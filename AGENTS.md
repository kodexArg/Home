# Instructions & Directives

- Target deployment: Cloudflare at `https://home.kodexarg.com` via GitHub Actions (not manual wrangler CLI).
- Package Manager & Tooling: Use `bun` (`bun install`, `bun run build`, `bun test`). Do NOT use `npm` or `npx`.
- CLI Tooling: Use `bunx wrangler` for Cloudflare CLI tasks. Do NOT use the `cloudflare` npm package CLI.
- Canonical GitHub repository: **`kodexArg/Home`** (capital `H`, capital `A`). Use only that casing in remotes, links, Cursor Cloud environment name + `repos`, and docs. Never register or keep a parallel `kodexarg/home` identity — GitHub URLs are case-insensitive, but Cursor Cloud environment matching is not.
- Always use `codebase-memory-mcp` to explore the codebase from the **repository root** (local clone is typically `/home/kodex/kodexArg/Home`; Cloud Agents use `/workspace`). Do not hardcode either path in new docs or tooling.
- Language I/O is host-owned (`sense-rewrite` + `asd-ste100`). Do not restate hook policy here. Spanish input is fine; answer in English unless `/kdx-es` is active.

## Cursor Cloud specific instructions

- Runtime/package manager is **Bun** (installed under `~/.bun/bin`, also symlinked to `/usr/local/bin/bun`; Node is present but unused). Standard commands live in `package.json` and `README.md` (`bun run dev` serves `http://localhost:4321`).
- `bun test` (suite in `tests/`) runs fully offline and is the only offline verification. There is no separate lint step; `astro check` is intentionally not wired up (`@astrojs/check` is not a dependency), so don't add it just to lint. `bun run build` compiles fine but then fails at the Cloudflare remote-proxy step without credentials (see next point).
- Running or building the app needs **live Cloudflare credentials**. `wrangler.jsonc` declares the `AI` and `VECTOR_INDEX` bindings as `remote: true`, so `bun run dev` and `bun run build` open a remote proxy session against the real Workers AI + Vectorize `kodexbar-corpus` index at startup and hard-fail without valid `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (even a dummy token fails). This is deliberate — there is no offline emulation for Vectorize (see `README.md` and `docs/adr-04-database.md`). The token must reach Workers AI, the `kodexbar-corpus` Vectorize index, and the `SESSION` KV namespace for the KodexBar `/api/ask` flow.
- Cloud Agents personal environment must be named **`kodexArg/Home`**, with `repos` = `github.com/kodexArg/Home` only. If the dashboard still shows `kodexarg/home` (or a lowercase `repos` entry), rename/fix it — do not create a second environment.
