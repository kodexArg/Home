/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/cloudflare" />

interface VectorizeMatch {
	id: string;
	score: number;
	metadata?: Record<string, unknown>;
}

interface VectorizeQueryOptions {
	topK?: number;
	returnMetadata?: boolean | string;
	filter?: Record<string, unknown>;
}

interface VectorizeVector {
	id: string;
	values: number[];
	metadata?: Record<string, unknown>;
}

interface VectorizeIndex {
	query(vector: number[], options?: VectorizeQueryOptions): Promise<{ matches: VectorizeMatch[] }>;
	insert(vectors: VectorizeVector[]): Promise<unknown>;
	upsert(vectors: VectorizeVector[]): Promise<unknown>;
}

interface AiEmbeddingResult {
	data: number[][];
}

interface AiTextResult {
	response?: string;
}

interface Env {
	AI?: {
		run(model: string, inputs: Record<string, unknown>): Promise<AiEmbeddingResult & AiTextResult>;
	};
	VECTOR_INDEX?: VectorizeIndex;
	SESSION?: KVNamespace;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
	interface Locals {
		runtime?: Runtime;
	}
}
