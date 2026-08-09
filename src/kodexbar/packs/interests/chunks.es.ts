import { defineChunks, type ChunkDef } from '../defineChunks';

const DEFS: ChunkDef[] = [
	{
		id: "escenarios-infra-creativa",
		title: "Crear escenarios de trabajo, infraestructuras sólidas, cloud SaaS u on-premise, soluciones creativas y seguras, flujos agénticos, templates scaffolding",
		text: `A Gabriel le gusta crear escenarios de trabajo para nuevas soluciones. Arranca con infraestructuras sólidas — cloud para SaaS u on-premise como primer eslabón — pensadas en la seguridad y con plasticidad suficiente para generar soluciones de manera creativa.

Lleva esos escenarios a entornos amigables para que desarrolladores cercanos al cliente conecten la infraestructura con soluciones modernas y seguras para los usuarios, altamente creativas y 100% integradas con herramientas agénticas actuales.

Busca automatizar hasta eliminar el triage, el mantenimiento y el backup rutinarios, pasando a sistemas de alertas resilientes a sus propios fallos, pensados para ser atendidos por humanos y por agentes autónomos.

El entregable habitual que le interesa, luego del diseño de arquitectura de nuevos proyectos, son templates o scaffolding, herramientas integradas y flujos de trabajo claros que ponderen la creatividad sobre todo.`,
		related: [],
		tags: ["escenarios de trabajo","infraestructura","cloud","saas","on-premise","on-prem","seguridad","plasticidad","soluciones creativas","desarrolladores","herramientas modernas","agénticas","agentes","automatizar","triage","mantenimiento","backup","alertas","alertas resilientes","arquitectura","templates","scaffolding","flujos de trabajo","creatividad","que le gusta construir","oficio"],
		visibility: "public",
		importance: "high",
	},
	{
		id: "intereses-alcance",
		title: "Qué intereses personales se pueden preguntar, hobbies, gustos, qué le gusta fuera del laburo",
		text: `¿Qué intereses personales tiene Gabriel? ¿Cuáles son sus hobbies?

¿Qué le gusta fuera del laburo? KodexBar lleva un pack de notas sueltas sobre intereses personales, autorizado por él para publicación.

Las notas se agregan de a una: gustos, aficiones y contexto de vida que no son trayectoria profesional ni datos civiles (nombre legal, nacimiento). Si todavía no hay una nota concreta para lo que preguntás, se puede decir con naturalidad que ese detalle aún no está en el corpus y ofrecer lo que sí esté recuperado.`,
		related: [],
		tags: ["intereses","hobbies","gustos","aficiones","que le gusta","fuera del laburo","vida personal","notas sueltas","tiempo libre"],
		visibility: "public",
		importance: "high",
	}
];

export const INTERESTS_CHUNKS_ES = defineChunks("interests", "es", DEFS);
