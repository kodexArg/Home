import { defineChunks, type ChunkDef } from '../defineChunks';

const DEFS: ChunkDef[] = [
	{
		id: "escenarios-infra-creativa",
		title: "Creating work scenarios, solid infrastructure, SaaS cloud or on-prem, creative secure solutions, agentic workflows, scaffolding templates",
		text: `Gabriel likes creating work scenarios for new solutions. He starts with solid infrastructure — cloud for SaaS or on-premise as the first link — designed for security and with enough plasticity to let teams invent creative solutions.

He then shapes those scenarios into friendly environments so developers close to the client can connect that infrastructure to modern, secure products for end users: highly creative, and fully integrated with current agentic tools.

He wants to automate until routine triage, maintenance, and backup disappear, replaced by alert systems that stay resilient to their own failures and that humans and autonomous agents can both attend.

After architecture design on new projects, the usual deliverable he cares about is templates or scaffolding, integrated tooling, and clear workflows that put creativity first.`,
		related: [],
		tags: ["work scenarios","infrastructure","cloud","saas","on-premise","on-prem","security","plasticity","creative solutions","developers","modern tools","agentic","agents","automation","triage","maintenance","backup","alerts","resilient alerts","architecture","templates","scaffolding","workflows","creativity","what he likes building","craft"],
		visibility: "public",
		importance: "high",
	},
	{
		id: "intereses-alcance",
		title: "What personal interests can I ask about, hobbies, tastes, what he likes outside work",
		text: `What personal interests does Gabriel have? What are his hobbies?

What does he like outside work? KodexBar keeps a pack of loose personal-interest notes he authorized for publication.

Notes are added one at a time: tastes, hobbies, and life context that are neither career narrative nor civil identity facts (legal name, birth). If there is not yet a concrete note for what you asked, it is fine to say naturally that detail is not in the corpus yet and offer whatever was retrieved.`,
		related: [],
		tags: ["interests","hobbies","tastes","what he likes","outside work","personal life","loose notes","free time"],
		visibility: "public",
		importance: "high",
	}
];

export const INTERESTS_CHUNKS_EN = defineChunks("interests", "en", DEFS);
