import { GROUNDING_FIXTURE, type GroundingFixtureQuestion } from './fixture';
import { extractFabricationProneClaims } from './claimExtraction';
import { findUngroundedClaims, type RetrievedContextChunk, type UngroundedClaim } from './groundingCheck';

const DEV_SERVER_BASE_URL = process.env.KODEXBAR_DEV_URL ?? 'http://localhost:4321';
const ASK_ENDPOINT = `${DEV_SERVER_BASE_URL}/api/ask`;
const RETRIEVE_ENDPOINT = `${DEV_SERVER_BASE_URL}/api/admin/retrieve`;

interface AskResponseBody {
	text: string;
	matched: boolean;
	score?: number;
}

interface RetrieveResponseBody {
	ok: boolean;
	passed: boolean;
	topScore: number | null;
	chunks: RetrievedContextChunk[];
	error?: string;
}

interface QuestionOutcome {
	question: GroundingFixtureQuestion;
	answerText: string;
	answerMatched: boolean;
	retrievedChunkIds: string[];
	claimsChecked: number;
	ungroundedClaims: UngroundedClaim[];
}

async function askLivePipeline(question: GroundingFixtureQuestion): Promise<AskResponseBody> {
	const response = await fetch(ASK_ENDPOINT, {
		method: 'POST',
		headers: { Origin: DEV_SERVER_BASE_URL, 'Content-Type': 'application/json' },
		body: JSON.stringify({
			query: question.query,
			language: question.language,
			conversation: `grounding-eval-${question.id}`
		})
	});

	if (!response.ok) {
		throw new Error(`POST /api/ask returned HTTP ${response.status} for "${question.query}"`);
	}

	return (await response.json()) as AskResponseBody;
}

async function retrieveChunksForQuestion(
	question: GroundingFixtureQuestion
): Promise<RetrieveResponseBody> {
	const response = await fetch(RETRIEVE_ENDPOINT, {
		method: 'POST',
		headers: { Origin: DEV_SERVER_BASE_URL, 'Content-Type': 'application/json' },
		body: JSON.stringify({ query: question.query, language: question.language })
	});

	if (response.status === 404) {
		throw new Error(
			'/api/admin/retrieve returned 404 — it is gated to development builds only. Run against `bun run dev`.'
		);
	}

	if (!response.ok) {
		throw new Error(`POST /api/admin/retrieve returned HTTP ${response.status} for "${question.query}"`);
	}

	return (await response.json()) as RetrieveResponseBody;
}

async function evaluateQuestion(question: GroundingFixtureQuestion): Promise<QuestionOutcome> {
	const [answer, retrieval] = await Promise.all([
		askLivePipeline(question),
		retrieveChunksForQuestion(question)
	]);

	if (!answer.matched) {
		return {
			question,
			answerText: answer.text,
			answerMatched: false,
			retrievedChunkIds: retrieval.chunks.map((chunk) => chunk.id),
			claimsChecked: 0,
			ungroundedClaims: []
		};
	}

	const claims = extractFabricationProneClaims(answer.text, question.language);
	const ungroundedClaims = findUngroundedClaims(claims, retrieval.chunks);

	return {
		question,
		answerText: answer.text,
		answerMatched: true,
		retrievedChunkIds: retrieval.chunks.map((chunk) => chunk.id),
		claimsChecked: claims.length,
		ungroundedClaims
	};
}

function printOutcome(outcome: QuestionOutcome): void {
	console.log(`\n[${outcome.question.id}] (${outcome.question.language}) "${outcome.question.query}"`);
	console.log(`  answer: ${outcome.answerText}`);
	console.log(`  retrieved chunks: ${outcome.retrievedChunkIds.join(', ') || '(none)'}`);

	if (!outcome.answerMatched) {
		console.log('  skipped: the retrieval gate declined this question, nothing to ground-check.');
		return;
	}

	console.log(`  claims extracted: ${outcome.claimsChecked}`);

	if (outcome.ungroundedClaims.length === 0) {
		console.log('  grounding: clean — every extracted claim traces back to a retrieved chunk.');
		return;
	}

	console.log(`  grounding: ${outcome.ungroundedClaims.length} UNGROUNDED CLAIM(S)`);
	for (const claim of outcome.ungroundedClaims) {
		console.log(`    - [${claim.type}] "${claim.token}" — ${claim.reason}`);
	}
}

async function main(): Promise<void> {
	const devServerReachable = await fetch(DEV_SERVER_BASE_URL, { method: 'GET' })
		.then(() => true)
		.catch(() => false);

	if (!devServerReachable) {
		console.error(`No dev server at ${DEV_SERVER_BASE_URL}. Start it first with: bun run dev`);
		process.exit(1);
	}

	console.log(`Grounding eval against ${DEV_SERVER_BASE_URL}, ${GROUNDING_FIXTURE.length} questions.\n`);

	const outcomes: QuestionOutcome[] = [];
	for (const question of GROUNDING_FIXTURE) {
		try {
			const outcome = await evaluateQuestion(question);
			outcomes.push(outcome);
			printOutcome(outcome);
		} catch (err) {
			console.error(`\n[${question.id}] request failed: ${err instanceof Error ? err.message : String(err)}`);
			process.exit(1);
		}
	}

	const checkedOutcomes = outcomes.filter((outcome) => outcome.answerMatched);
	const totalClaimsChecked = checkedOutcomes.reduce((sum, outcome) => sum + outcome.claimsChecked, 0);
	const totalUngroundedClaims = checkedOutcomes.reduce(
		(sum, outcome) => sum + outcome.ungroundedClaims.length,
		0
	);
	const questionsWithUngroundedClaims = checkedOutcomes.filter(
		(outcome) => outcome.ungroundedClaims.length > 0
	).length;

	console.log('\n--- summary ---');
	console.log(`questions in fixture:        ${GROUNDING_FIXTURE.length}`);
	console.log(`answers gate-declined:       ${outcomes.length - checkedOutcomes.length}`);
	console.log(`claims checked:              ${totalClaimsChecked}`);
	console.log(`ungrounded claims found:     ${totalUngroundedClaims}`);
	console.log(`questions with an ungrounded claim: ${questionsWithUngroundedClaims}/${checkedOutcomes.length}`);
}

await main();
