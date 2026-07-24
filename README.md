# Home - Kodex Homepage

Astro & Svelte project deployed to Cloudflare Pages (`https://home.kodexarg.com`).

## CLI Tooling & Deployment Guidelines

- **Use Wrangler for Cloudflare CLI operations**:
  - Do NOT use the `cloudflare` npm CLI package (`npx cloudflare`). It is the API SDK CLI and throws command errors when invoked without specific SDK subcommands.
  - Development & deployment CLI tooling uses `wrangler` (`npx wrangler` or `npm run dev`/`npm run build`).

- **Development Commands**:
  - Start local dev server: `npm run dev` (`astro dev`)
  - Build project: `npm run build` (`astro build`)
  - Preview build: `npm run preview` (`astro preview`)
  - Deploy via Wrangler (manual): `npm run deploy` (`wrangler deploy`)

- **Automated Deployment**:
  - Primary target deployment is automated via **GitHub Actions** (`.github/workflows/deploy.yml`) on push to `main`.
