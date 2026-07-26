/**
 * bun run index:corpus
 *
 * Rebuilds the Vectorize index from the registered knowledge packs by calling
 * the dev-only endpoint at /api/admin/index-corpus.
 *
 * Why a running dev server instead of a standalone script: `env.AI` and
 * `env.VECTOR_INDEX` are Worker bindings and do not exist in a plain Bun
 * process. Driving them from `astro dev` (which binds to the real remote
 * index) keeps indexing token-free — see the endpoint's header comment.
 *
 * Usage:
 *   1. bun run dev
 *   2. bun run index:corpus
 */

const BASE = process.env.KODEXBAR_DEV_URL ?? 'http://localhost:4321';
const ENDPOINT = `${BASE}/api/admin/index-corpus`;

const reachable = await fetch(BASE, { method: 'GET' })
	.then(() => true)
	.catch(() => false);

if (!reachable) {
	console.error(`✗ No dev server at ${BASE}.`);
	console.error('  Start it first with:  bun run dev');
	process.exit(1);
}

console.log(`→ Indexing corpus via ${ENDPOINT}`);

const response = await fetch(ENDPOINT, {
	method: 'POST',
	// Astro's CSRF protection rejects any non-GET whose Origin does not match
	// the host, and fetch() from Bun sends none. Without this the endpoint
	// answers 403 before the route ever runs.
	headers: { Origin: BASE, 'Content-Type': 'application/json' }
});

if (response.status === 404) {
	console.error('✗ Endpoint returned 404 — it is gated to development builds only.');
	process.exit(1);
}

const result = (await response.json().catch(() => null)) as
	| { ok: boolean; upserted?: number; dimensions?: number; model?: string; elapsedMs?: number; error?: string; note?: string }
	| null;

if (!response.ok || !result?.ok) {
	console.error(`✗ Indexing failed (HTTP ${response.status}): ${result?.error ?? 'unknown error'}`);
	if (result?.upserted) console.error(`  ${result.upserted} chunks were written before the failure.`);
	process.exit(1);
}

console.log(`✓ ${result.upserted} chunks indexed in ${result.elapsedMs}ms`);
console.log(`  model:      ${result.model}`);
console.log(`  dimensions: ${result.dimensions}`);
console.log(`  ${result.note ?? ''}`);
console.log('');
console.log('  If the index was created with a different dimension count, recreate it:');
console.log(`    bunx wrangler vectorize create <name> --dimensions=${result.dimensions} --metric=cosine`);
console.log('    bunx wrangler vectorize create-metadata-index <name> --property-name=lang --type=string');
