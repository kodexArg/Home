import type { FabricationProneClaim } from './claimExtraction';

export interface RetrievedContextChunk {
	id: string;
	pack: string;
	title: string;
	text: string;
}

export interface UngroundedClaim extends FabricationProneClaim {
	reason: string;
}

function escapeForRegExp(literal: string): string {
	return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function contextContainsWholeWord(contextText: string, token: string): boolean {
	const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${escapeForRegExp(token)}(?![\\p{L}\\p{N}])`, 'iu');
	return pattern.test(contextText);
}

export function buildRetrievedContextText(chunks: readonly RetrievedContextChunk[]): string {
	return chunks.map((chunk) => `${chunk.title}\n${chunk.text}`).join('\n\n');
}

export function findUngroundedClaims(
	claims: readonly FabricationProneClaim[],
	retrievedChunks: readonly RetrievedContextChunk[]
): UngroundedClaim[] {
	const contextText = buildRetrievedContextText(retrievedChunks);
	const ungrounded: UngroundedClaim[] = [];

	for (const claim of claims) {
		if (!contextContainsWholeWord(contextText, claim.token)) {
			ungrounded.push({
				...claim,
				reason: retrievedChunks.length === 0
					? 'no chunks were retrieved for this question'
					: 'token absent from every retrieved chunk'
			});
		}
	}

	return ungrounded;
}
