#!/usr/bin/env bun
/**
 * Builds per-repo agent prompt files for the github-repo-swarm.
 * Does not launch agents — the parent chat dispatches Task subagents.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dir, '..', '..');
const PROMPT_TEMPLATE = readFileSync(join(ROOT, 'prompts', 'github-repo-summary.AGENT.md'), 'utf8');
const REPOS = JSON.parse(readFileSync(join(import.meta.dir, 'repos.json'), 'utf8')) as Array<{
	name: string;
	isPrivate: boolean;
	description: string;
	default_branch: string;
}>;

const outDir = join(import.meta.dir, 'prompts-out');
mkdirSync(outDir, { recursive: true });

const manifest: Array<{
	name: string;
	visibility: 'public' | 'private';
	outputPath: string;
	promptPath: string;
}> = [];

for (const repo of REPOS) {
	const visibility = repo.isPrivate ? 'private' : 'public';
	const outRoot = repo.isPrivate ? 'github-private-repos' : 'github-public-repos';
	const outputPath = join(ROOT, outRoot, `${repo.name}.md`);
	const prompt = PROMPT_TEMPLATE.replaceAll('{{REPO_NAME}}', repo.name)
		.replaceAll('{{VISIBILITY}}', visibility)
		.replaceAll('{{DEFAULT_BRANCH}}', repo.default_branch || 'main')
		.replaceAll('{{DESCRIPTION}}', repo.description || '(none)')
		.replaceAll('{{OUTPUT_PATH}}', outputPath);

	const promptPath = join(outDir, `${repo.name}.md`);
	writeFileSync(promptPath, prompt);
	manifest.push({ name: repo.name, visibility, outputPath, promptPath });
}

writeFileSync(join(import.meta.dir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`wrote ${manifest.length} prompts → ${outDir}`);
console.log(`public=${manifest.filter((m) => m.visibility === 'public').length}`);
console.log(`private=${manifest.filter((m) => m.visibility === 'private').length}`);
