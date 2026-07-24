/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/cloudflare" />

interface VectorizeMatch {
	id: string;
	score: number;
	metadata?: Record<string, unknown>;
}

interface VectorizeIndex {
	query(vector: number[], options?: { topK?: number; returnMetadata?: boolean | string }): Promise<{ matches: VectorizeMatch[] }>;
	insert(vectors: Array<{ id: string; values: number[]; metadata?: Record<string, unknown> }>): Promise<unknown>;
	upsert(vectors: Array<{ id: string; values: number[]; metadata?: Record<string, unknown> }>): Promise<unknown>;
}

interface Env {
	AI?: {
		run(model: string, inputs: Record<string, unknown>): Promise<{ data: number[][] }>;
	};
	VECTOR_INDEX?: VectorizeIndex;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
	interface Locals {
		runtime?: Runtime;
	}
}
