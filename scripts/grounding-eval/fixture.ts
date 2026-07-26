export interface GroundingFixtureQuestion {
	id: string;
	language: 'es' | 'en';
	query: string;
}

export const GROUNDING_FIXTURE: GroundingFixtureQuestion[] = [
	{ id: 'es-aws-experience', language: 'es', query: '¿Qué experiencia tiene con AWS?' },
	{ id: 'es-alvs-start-year', language: 'es', query: '¿En qué año empezó a trabajar en Grupo ALVS?' },
	{ id: 'es-casino-mendoza', language: 'es', query: '¿Qué hizo en el Casino de Mendoza?' },
	{ id: 'es-current-projects', language: 'es', query: '¿Cuáles son sus proyectos actuales?' },
	{ id: 'es-backend-stack', language: 'es', query: '¿Qué tecnologías usa para el backend?' },
	{ id: 'es-education', language: 'es', query: '¿Dónde estudió Gabriel?' },
	{ id: 'es-coveris', language: 'es', query: '¿Qué es Coveris?' },
	{ id: 'es-contact', language: 'es', query: '¿Cómo puedo contactarlo?' },
	{ id: 'es-ai-agents', language: 'es', query: '¿Qué hace con IA y agentes?' },
	{ id: 'es-iot-projects', language: 'es', query: '¿Qué proyectos de IoT tiene?' },
	{ id: 'es-availability', language: 'es', query: '¿Está disponible para trabajar?' },
	{ id: 'es-languages', language: 'es', query: '¿Qué idiomas habla?' },
	{ id: 'en-aws-experience', language: 'en', query: 'What experience does he have with AWS?' },
	{ id: 'en-alvs-start-year', language: 'en', query: 'What year did he start working at Grupo ALVS?' },
	{ id: 'en-casino-mendoza', language: 'en', query: 'What did he do at Casino de Mendoza?' },
	{ id: 'en-current-projects', language: 'en', query: 'What are his current projects?' },
	{ id: 'en-backend-stack', language: 'en', query: 'What backend technologies does he use?' },
	{ id: 'en-education', language: 'en', query: 'Where did Gabriel study?' },
	{ id: 'en-coveris', language: 'en', query: 'What is Coveris?' },
	{ id: 'en-contact', language: 'en', query: 'How can I contact him?' },
	{ id: 'en-ai-agents', language: 'en', query: 'What does he do with AI and agents?' },
	{ id: 'en-iot-projects', language: 'en', query: 'What IoT projects does he have?' },
	{ id: 'en-availability', language: 'en', query: 'Is he available for work?' },
	{ id: 'en-languages', language: 'en', query: 'What languages does he speak?' }
];
