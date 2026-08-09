import { defineChunks, type ChunkDef } from '../defineChunks';

const DEFS: ChunkDef[] = [
	{
		id: "intereses-alcance",
		title: "What personal interests can I ask about, hobbies, tastes, what he likes outside work",
		text: `What personal interests does Gabriel have? What are his hobbies? What does he like outside work? KodexBar keeps a pack of loose personal-interest notes he authorized for publication. Notes are added one at a time: tastes, hobbies, and life context that are neither career narrative nor civil identity facts (legal name, birth). If there is not yet a concrete note for what you asked, it is fine to say naturally that detail is not in the corpus yet and offer whatever was retrieved.`,
		related: [],
		tags: ["interests","hobbies","tastes","what he likes","outside work","personal life","loose notes","free time"],
		visibility: "public",
		importance: "high",
	}
];

export const INTERESTS_CHUNKS_EN = defineChunks("interests", "en", DEFS);
