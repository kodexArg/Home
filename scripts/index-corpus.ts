const DEV_SERVER_BASE_URL = process.env.KODEXBAR_DEV_URL ?? 'http://localhost:4321';
const INDEX_CORPUS_ENDPOINT = `${DEV_SERVER_BASE_URL}/api/admin/index-corpus`;

const devServerReachable = await fetch(DEV_SERVER_BASE_URL, { method: 'GET' })
	.then(() => true)
	.catch(() => false);

if (!devServerReachable) {
	console.error(`✗ No dev server at ${DEV_SERVER_BASE_URL}.`);
	console.error('  Start it first with:  bun run dev');
	process.exit(1);
}

console.log(`→ Indexing corpus via ${INDEX_CORPUS_ENDPOINT}`);

const response = await fetch(INDEX_CORPUS_ENDPOINT, {
	method: 'POST',
	headers: { Origin: DEV_SERVER_BASE_URL, 'Content-Type': 'application/json' }
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
