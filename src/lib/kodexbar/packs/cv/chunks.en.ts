import { defineChunks, type ChunkDef } from '../defineChunks';

/**
 * English corpus for the `cv` pack.
 *
 * Extracted from the English one-page CV (`cv.kodexarg.com`, `index.astro`).
 * Deliberately thinner than the Spanish set: the long-form `/full/` CV exists
 * only in Spanish, so the detailed skill breakdowns and the QA/method essay
 * have no English source. Reaching parity is a content task, not an
 * architectural one — see adr-10 "Consequences".
 *
 * Chunk ids intentionally mirror the Spanish ones where the subject matches,
 * so `related` edges stay meaningful across languages.
 */
const DEFS: ChunkDef[] = [
	// =======================================================================
	// KodexBar — identity and purpose
	//
	// "What is this?", "what is its function?" and "what is it for?" arrive
	// short and abstract. This chunk gives them a target of their own:
	// `proj-home-kodexbar` describes the stack, and its centroid sits in
	// "vectorize / workers ai / astro", far from a question about purpose. All
	// three phrasings are in the title and the body deliberately — `tags` are
	// not embedded (see index-corpus.ts).
	// =======================================================================
	{
		id: 'kodexbar-funcion',
		title: 'What KodexBar is, what its function is and what it is for',
		text: `KodexBar is this assistant: the query bar on the kodexArg home page, and the one
			answering right now. It has a single function, and Gabriel Cavedal designed it that way: to
			make reaching him easy. That is what it is for. Someone arriving with a consulting enquiry,
			an architecture review or a work proposal has nothing to hunt for — they ask, KodexBar
			answers, and the way to reach him comes with the answer. Email is the direct route; LinkedIn,
			Telegram and the full CV are there too. Everything else it can tell you about his career,
			projects and skills serves that one purpose: getting the conversation started.`,
		related: ['email', 'linkedin', 'telegram', 'cv', 'contacto', 'disponibilidad'],
		tags: ['what is this', 'what are you', 'who are you', 'what is your function', 'what is its function', 'what is it for', 'what does it do', 'function', 'purpose', 'kodexbar', 'this assistant', 'this bar', 'this site', 'contact']
	},

	// =======================================================================
	// Profile and contact
	// =======================================================================
	{
		id: 'perfil',
		title: 'Professional profile',
		text: `Gabriel Cavedal is an infrastructure and software architect and a multi-company
			technical lead with over 20 years of experience. He designs systems end to end, from the
			physical layer and networking up through cloud architecture and product, and leads the teams
			that operate them. His current practice is spec-driven development with fleets of AI agents
			under BDD/TDD discipline. He is a Django and Django REST Framework expert and runs production
			platforms on AWS and Cloudflare. He presents professionally as an AI Solutions Architect and
			Fractional CTO, and is based in Mendoza, Argentina.`,
		related: ['cv', 'linkedin'],
		tags: ['profile', 'who is', 'bio', 'gabriel cavedal', 'kodexarg', 'architect', 'fractional cto', 'ai solutions architect', 'about him', 'background']
	},
	{
		id: 'contacto',
		title: 'How to reach him',
		text: `Email is the preferred channel for reaching Gabriel Cavedal: consulting enquiries,
			architecture reviews and freelance work all go there. He is also on LinkedIn, on Telegram as
			@KodexArg, and on GitHub as kodexArg. He lives and works from Mendoza, Argentina, remotely.
			The exact address travels in the contact link.`,
		related: ['email', 'linkedin', 'telegram', 'github'],
		tags: ['contact', 'email', 'mail', 'reach', 'get in touch', 'linkedin', 'telegram', 'where does he live', 'mendoza', 'argentina', 'location']
	},
	{
		id: 'disponibilidad',
		title: 'Availability and consulting',
		text: `Gabriel is available for remote consulting. The engagements he is interested in are
			architecture reviews and third-party project reviews, AI adoption scouting for organisations,
			and automation quick wins. He works remote-first. The way to start a conversation is to
			email him.`,
		related: ['email', 'cv'],
		tags: ['available', 'availability', 'freelance', 'consulting', 'hire', 'hire him', 'work', 'remote', 'quick wins', 'engagement']
	},
	{
		id: 'idiomas',
		title: 'Languages',
		text: `Gabriel Cavedal is a native Spanish speaker. His English is at professional working
			proficiency: excellent reading, B2 conversation.`,
		tags: ['languages', 'english', 'spanish', 'english level', 'bilingual']
	},
	{
		id: 'educacion',
		title: 'Education and certification',
		text: `Gabriel attended technical school at ENET N°1 «Ing. Pablo Nogués» in Mendoza. He began
			Electromechanical Engineering at UNSL in San Luis and Graphic Design in Villa Mercedes, both
			left incomplete. He maintains continuous certification through Platzi across AI, backend,
			cloud and DevOps. His technical education is largely self-taught and grounded in practice.`,
		related: ['platzi'],
		tags: ['education', 'studies', 'degree', 'university', 'training', 'certification', 'platzi', 'courses', 'self-taught']
	},

	// =======================================================================
	// Experience
	// =======================================================================
	{
		id: 'exp-alvs',
		title: 'Technical Lead at Grupo ALVS (2016 — present)',
		text: `Since 2016 Gabriel has been Technical Lead for IT and Infrastructure at Grupo ALVS in
			Mendoza, Argentina. He leads the group's IT team across all business units. He designed and
			operates its AWS cloud platform — DEV and PROD VPCs, ECS Fargate, RDS PostgreSQL, Cognito and
			Secrets Manager, all defined with CloudFormation and deployed through GitHub Actions with
			OIDC — which runs the production helpdesk, payment workflows, institutional sites and IoT
			telemetry over a multi-site VPN backbone. He also drives AI adoption group-wide: multi-agent
			orchestration with MCP servers, automated workflows and hands-on staff training.`,
		related: ['cv', 'skill-cloud-devops', 'proj-alvs-cloud'],
		tags: ['experience', 'current job', 'employment', 'alvs', 'grupo alvs', 'technical lead', 'where does he work', 'aws', 'infrastructure']
	},
	{
		id: 'exp-casino-mendoza',
		title: 'Head of Organization and Systems, Casino de Mendoza (2005 — 2016)',
		text: `From 2005 to 2016 Gabriel was Head of Organization and Systems at Mendoza Central
			Entretenimiento, the Casino de Mendoza. He designed the casino's networks and floorplan end to
			end and built the RHEL server clusters that ran the entire operation: gaming systems with 700
			networked slot machines, BI dashboards and machine-learning analytics. Eleven years of
			continuous operation with zero downtime.`,
		related: ['cv', 'skill-linux'],
		tags: ['experience', 'casino', 'head of systems', 'rhel', 'linux', 'clusters', 'slot machines', 'work history']
	},
	{
		id: 'exp-casino-bsas',
		title: 'Slot Systems Technician, Casino Buenos Aires (2002 — 2005)',
		text: `From 2002 to 2005 Gabriel worked as a slot systems technician at Casino Buenos Aires,
			handling gaming hardware, networks and systems support. It is his first documented technical
			role and the starting point of his career.`,
		related: ['cv'],
		tags: ['experience', 'casino buenos aires', 'technician', 'first job', 'early career', 'work history']
	},

	// =======================================================================
	// Skills
	// =======================================================================
	{
		id: 'skill-backend',
		title: 'Backend: Python, Django, DRF, PostgreSQL',
		text: `Backend is Gabriel's strongest specialty. He works with Python, Django 5, Django REST
			Framework, FastAPI and PostgreSQL, building complete Django applications — helpdesk systems,
			payment workflows, B2B portals — and using DRF for SaaS products and IoT telemetry. He
			considers himself a Django and DRF expert.`,
		related: ['welpdesk', 'dj-indoor-monitor', 'astro-drf-aws', 'dj-apprunner-template', 'proj-welp', 'proj-coveris-aws'],
		tags: ['backend', 'python', 'django', 'drf', 'django rest framework', 'fastapi', 'postgresql', 'postgres', 'sql', 'database', 'api']
	},
	{
		id: 'skill-cloud-devops',
		title: 'Cloud and DevOps: AWS, Cloudflare, IaC, CI/CD',
		text: `Gabriel designs and operates production cloud infrastructure. On AWS he works with ECS
			Fargate, Amplify, App Runner, Lambda, RDS, S3, CloudFront and Cognito, defining infrastructure
			as code with CloudFormation and wiring CI/CD through GitHub Actions with OIDC and no static
			credentials. On Cloudflare he uses Pages, Workers, D1 and R2. AWS is his primary platform and
			carries Grupo ALVS's entire operation.`,
		related: ['dj-apprunner-template', 'astro-drf-aws', 'n8n-apprunner', 'lambda-update-route53', 'cf-ng-eurotrip2026', 'proj-alvs-cloud', 'proj-coveris-aws', 'exp-alvs'],
		tags: ['aws', 'cloud', 'devops', 'cloudflare', 'fargate', 'ecs', 'lambda', 'rds', 's3', 'cognito', 'apprunner', 'amplify', 'cloudformation', 'iac', 'ci/cd', 'github actions', 'oidc', 'docker', 'workers']
	},
	{
		id: 'skill-infra-iot',
		title: 'Infrastructure, networking and IoT',
		text: `Gabriel came up through the physical layer and still works there: networking, IPsec VPN
			and remote access, MikroTik, and fleets of Raspberry Pi and ESP32 devices running telemetry in
			production, plus AI-assisted video surveillance. It is the foundation everything else sits
			on — few people who design cloud architecture can also wire the network.`,
		related: ['dj-indoor-monitor', 'rpi-door-access-rfid', 'kdx-pi-signage', 'kdx-pi-cam', 'camera-alert-to-telegram', 'raspberry-pi-temperature-to-telegram', 'proj-kcbd'],
		tags: ['networking', 'infrastructure', 'iot', 'vpn', 'ipsec', 'mikrotik', 'raspberry pi', 'esp32', 'sensors', 'telemetry', 'surveillance', 'cameras']
	},
	{
		id: 'skill-linux',
		title: 'Linux and systems administration',
		text: `Gabriel has administered Linux for two decades, on Debian and RHEL, including a decade
			of production RHEL clustering and high availability. He currently runs self-hosted agentic
			systems on his own infrastructure.`,
		related: ['blocky', 'exp-casino-mendoza', 'proj-casino-mendoza'],
		tags: ['linux', 'sysadmin', 'debian', 'rhel', 'red hat', 'servers', 'cluster', 'high availability', 'self-hosted']
	},
	{
		id: 'skill-fullstack',
		title: 'Full stack and frontend',
		text: `On the frontend Gabriel works with Angular, Astro, Svelte and HTMX, and designs REST
			APIs contract-first. He deploys through AWS Amplify, Fargate, ECS/ECR and Cloudflare Pages.
			He is not a pure frontend specialist — he arrives at the frontend from architecture and picks
			the stack the system needs.`,
		related: ['template-angular-21-csr-primeng', 'astro-drf-aws', 'cf-ng-eurotrip2026', 'astro-cv', 'syv-design-system', 'proj-sroa'],
		tags: ['frontend', 'full stack', 'angular', 'astro', 'svelte', 'htmx', 'rest', 'api', 'contract-first', 'ui']
	},
	{
		id: 'skill-ia-agentes',
		title: 'AI, agents and MCP',
		text: `This is Gabriel's current focus: multi-agent orchestration, MCP servers and clients
			(several public on GitHub), Claude Code, n8n and RAG. He builds autonomous issue-triage agents
			and subagent hierarchies organised by effort level. He leads AI adoption at Grupo ALVS,
			including hands-on staff training.`,
		related: ['engram', 'openclaw', 'odysseus', 'python-telegram-bot-mcp', 'proj-mcp-tools', 'proj-coveris-metodo'],
		tags: ['ai', 'artificial intelligence', 'agents', 'agentic', 'mcp', 'model context protocol', 'claude', 'claude code', 'llm', 'rag', 'multi-agent', 'orchestration', 'n8n', 'prompt engineering']
	},
	{
		id: 'skill-qa-metodo',
		title: 'QA and method: spec-driven development',
		text: `Gabriel's method is spec-driven development: specifications and ADRs as the single
			source of truth, contract-first APIs with test-verified coverage, BDD/TDD discipline, and
			docs-as-code. His argument is that when agents write most of the code, quality moves to the
			specifications, the contracts and the review. He applies the same process as an external
			reviewer of third-party projects: architecture audits, code review and technical debt
			assessment.`,
		related: ['qa-reports', 'docs', 'proj-coveris-metodo'],
		tags: ['qa', 'quality', 'testing', 'tests', 'tdd', 'bdd', 'spec-driven', 'specifications', 'adr', 'contract-first', 'code review', 'audit', 'technical debt', 'method', 'docs-as-code']
	},
	{
		id: 'skill-liderazgo',
		title: 'Leadership and business',
		text: `Gabriel leads multidisciplinary, multi-company IT teams and works routinely with
			non-technical domain experts — clinicians, management, operations — translating their rules
			into systems. He handles solutions architecture, business process automation, vendor and
			budget management, and BI for decision-making.`,
		related: ['exp-alvs', 'proj-coveris-dominio'],
		tags: ['leadership', 'teams', 'management', 'business', 'solutions architecture', 'fractional cto', 'process automation', 'vendor management', 'budget', 'bi']
	},

	// =======================================================================
	// Projects
	// =======================================================================
	{
		id: 'proj-coveris-aws',
		title: 'Coveris — AWS architecture',
		text: `Coveris is a hospital capacity planning SaaS and the project where Gabriel demonstrates
			the most depth on AWS. The MVP runs on AWS Amplify, ECS Fargate and RDS, with Cognito for
			authentication, over an Angular 21 and Django/DRF stack. The architectural design is entirely
			his. The repository is private, so there is no public link.`,
		related: ['skill-cloud-devops', 'skill-backend', 'proj-coveris-metodo', 'proj-coveris-dominio'],
		tags: ['coveris', 'aws', 'saas', 'healthcare', 'hospital', 'capacity planning', 'fargate', 'amplify', 'rds', 'cognito', 'angular', 'django', 'private project']
	},
	{
		id: 'proj-coveris-metodo',
		title: 'Coveris — method, ADRs and multi-agent QA',
		text: `Coveris is the fullest demonstration of Gabriel's method: more than 25 ADRs, a
			contract-first API with test-verified coverage, and a multi-agent AI pipeline in an
			Opus/Sonnet/Haiku hierarchy auditing the specifications themselves as well as the code.`,
		related: ['skill-qa-metodo', 'skill-ia-agentes', 'proj-coveris-aws', 'proj-coveris-dominio'],
		tags: ['coveris', 'adr', 'specs', 'spec-driven', 'qa', 'tests', 'contract-first', 'multi-agent', 'audit', 'method']
	},
	{
		id: 'proj-coveris-dominio',
		title: 'Coveris — working with clinical domain experts',
		text: `On Coveris the business logic came from physicians, not from Gabriel. He worked directly
			with clinical professionals translating their domain rules into verifiable, traceable
			specifications, with automated QA validating every contract against those rules. He describes
			it as the pattern he wants to repeat: someone else's expert domain, his architecture and
			quality.`,
		related: ['skill-liderazgo', 'skill-qa-metodo', 'proj-coveris-aws'],
		tags: ['coveris', 'domain', 'physicians', 'clinical', 'healthcare', 'business rules', 'domain experts', 'differentiator']
	},
	{
		id: 'proj-alvs-cloud',
		title: 'Grupo ALVS cloud platform',
		text: `Gabriel designed and operates Grupo ALVS's unified AWS infrastructure: DEV and PROD
			VPCs, ECS Fargate, RDS PostgreSQL, ALB, Cognito and Secrets Manager, defined with
			CloudFormation with CI/CD through GitHub OIDC. Living documentation in mkdocs Material is the
			platform's single source of truth. The repositories are private.`,
		related: ['skill-cloud-devops', 'exp-alvs'],
		tags: ['alvs', 'grupo alvs', 'aws', 'platform', 'infrastructure', 'cloudformation', 'vpc', 'fargate', 'rds', 'cognito', 'oidc', 'mkdocs', 'private']
	},
	{
		id: 'proj-mcp-tools',
		title: 'MCP tooling and autonomous agents',
		text: `Gabriel maintains public and private MCP servers — persistent terminal, Telegram Bot
			API, a content validation pipeline — along with autonomous issue-triage and issue-fixing
			agents and a private multi-agent orchestration control plane with an effort-tiered subagent
			hierarchy. Some of it is public in the kodexArg GitHub organization; the orchestration control
			plane is private.`,
		related: ['python-telegram-bot-mcp', 'engram', 'openclaw', 'github', 'skill-ia-agentes'],
		tags: ['mcp', 'agents', 'agentic', 'mcp servers', 'telegram', 'triage', 'issues', 'orchestration', 'multi-agent', 'anthropic', 'claude code', 'n8n', 'automation']
	},
	{
		id: 'proj-welp',
		title: 'Welp — helpdesk and payment workflows',
		text: `Welp is a ticketing and purchase-to-payment workflow system built with Django 5, HTMX
			and AWS App Runner, running in production at Grupo ALVS. It covers ticket lifecycle tracking,
			SLA management and multi-org isolation. The source is public as the welpdesk repository; the
			production instance is internal to the group.`,
		related: ['welpdesk', 'skill-backend', 'exp-alvs'],
		tags: ['welp', 'welpdesk', 'helpdesk', 'tickets', 'ticketing', 'support', 'sla', 'payments', 'purchase to payment', 'django', 'htmx', 'app runner', 'multi-tenant']
	},
	{
		id: 'proj-kcbd',
		title: 'KCBD — cultivation lab and IoT',
		text: `Gabriel co-built the sensor network for the KCBD indoor cultivation lab. Raspberry Pi
			nodes measure temperature, humidity, moisture, light and CO2 and stream telemetry into a
			Django REST Framework API backed by TimescaleDB, with an Angular frontend. The telemetry runs
			in production on AWS. The code is published as dj-indoor-monitor.`,
		related: ['dj-indoor-monitor', 'skill-infra-iot', 'skill-backend'],
		tags: ['kcbd', 'indoor', 'crop', 'lab', 'iot', 'sensors', 'raspberry pi', 'timescaledb', 'telemetry', 'temperature', 'humidity', 'django', 'drf']
	},
	{
		id: 'proj-sroa',
		title: 'SROA — Sociedad Rural del Oeste Argentino',
		text: `Institutional site and blog for the Sociedad Rural del Oeste Argentino: a spec-driven
			full-stack build with Astro SSR, Svelte 5 islands and an async Django backend, deployed on ECS
			Fargate over Grupo ALVS's AWS platform. It is in production; the repository is private.`,
		related: ['skill-fullstack', 'skill-cloud-devops'],
		tags: ['sroa', 'institutional site', 'blog', 'astro', 'ssr', 'svelte', 'django', 'fargate', 'seo', 'private']
	},
	{
		id: 'proj-casino-mendoza',
		title: 'Casino de Mendoza — RHEL clusters and 700 slot machines',
		text: `For a decade Gabriel built and ran self-built Linux RHEL clusters behind 700 networked
			slot machines at the Casino de Mendoza, on Oracle VM, with zero downtime. He also designed the
			casino's networks and floorplan and the BI and machine-learning analytics running on that
			infrastructure. It is his strongest mission-critical infrastructure credential.`,
		related: ['skill-linux', 'exp-casino-mendoza'],
		tags: ['casino', 'rhel', 'linux', 'cluster', 'high availability', 'zero downtime', 'slot machines', 'oracle vm', 'bi', 'machine learning', 'mission critical']
	},
	{
		id: 'proj-eurotrip',
		title: 'Eurotrip 2026 — travel app on Cloudflare',
		text: `Eurotrip 2026 is a personal travel companion built with Angular 21 and running entirely
			on Cloudflare — Pages, D1 and R2 — with interactive maps, budget calculation and schedule
			management. It is live and the code is open. It is his reference project for full-Cloudflare
			work.`,
		related: ['eurotrip-live', 'cf-ng-eurotrip2026', 'skill-cloud-devops', 'skill-fullstack'],
		tags: ['eurotrip', 'travel', 'planner', 'itinerary', 'budget', 'angular', 'cloudflare', 'pages', 'd1', 'r2', 'maps']
	},
	{
		id: 'proj-engram',
		title: 'Engram — persistent memory for agents',
		text: `Engram is an agent-agnostic persistent memory system for AI coding agents, written in Go
			as a high-performance binary using SQLite with FTS5 full-text search, and exposing an MCP
			server, an HTTP API, a CLI and an interactive TUI. It addresses the context-window problem:
			long-term memory outside the model.`,
		related: ['engram', 'skill-ia-agentes'],
		tags: ['engram', 'memory', 'agents', 'go', 'golang', 'sqlite', 'fts5', 'mcp', 'tui', 'cli', 'context window', 'long term memory']
	},
	{
		id: 'proj-openclaw',
		title: 'OpenClaw — personal AI assistant',
		text: `OpenClaw is a cross-platform personal AI assistant framework designed to run locally or
			self-hosted on any OS, with modular plugin channels, local tool invocation and autonomous task
			execution.`,
		related: ['openclaw', 'skill-ia-agentes'],
		tags: ['openclaw', 'assistant', 'personal ai', 'self-hosted', 'local', 'plugins', 'autonomous', 'local agent']
	},
	{
		id: 'proj-odysseus',
		title: 'Odysseus — self-hosted AI workspace',
		text: `Odysseus is a self-hosted AI workspace for orchestrating multi-agent collaboration, LLM
			workflow automation, document processing and local AI model management.`,
		related: ['odysseus', 'skill-ia-agentes'],
		tags: ['odysseus', 'workspace', 'self-hosted', 'multi-agent', 'llm', 'workflows', 'documents', 'local models']
	},
	{
		id: 'proj-home-kodexbar',
		title: 'kodexArg Home and KodexBar',
		text: `The kodexArg home page is the front door to the ecosystem, and KodexBar is the
			assistant behind it: vector retrieval over Cloudflare Vectorize with embeddings and generation
			on Cloudflare Workers AI, built with Astro 7 and Svelte 5 islands. It answers questions about
			Gabriel Cavedal and hands out links to the public projects. It is this very system.`,
		related: ['syv-design-system', 'skill-ia-agentes', 'skill-fullstack', 'kodexbar-funcion'],
		tags: ['home', 'kodexbar', 'kodexarg', 'this site', 'this page', 'who are you', 'what are you', 'vectorize', 'workers ai', 'rag', 'astro', 'svelte', 'cloudflare']
	},
	{
		id: 'proj-cv-site',
		title: 'The CV site',
		text: `Gabriel Cavedal's interactive résumé is the place to read his full CV: a one-page
			version in Spanish and English plus an extended version carrying more detail. It is built with
			Astro and Svelte, and separately from the site there is a repository holding its source code.`,
		related: ['cv', 'astro-cv', 'skill-fullstack'],
		tags: ['cv', 'resume', 'curriculum', 'cv site', 'astro', 'svelte']
	},
	{
		id: 'proj-design-system',
		title: 'SyV Design System',
		text: `The SyV Design System (Subordinación y Valor) is the official design system for kodexArg
			platforms, defining design tokens, the presentation orange palette, dark console aesthetics,
			Pip-Boy input mechanics and accessible component rules. It is what gives this site its look.`,
		related: ['syv-design-system', 'skill-fullstack'],
		tags: ['syv', 'design system', 'design', 'palette', 'colors', 'presentation orange', 'tokens', 'pipboy', 'components', 'accessibility']
	},

	// =======================================================================
	// kodexArg — the organization
	// =======================================================================
	{
		id: 'kodexarg-org',
		title: 'What kodexArg is',
		text: `kodexArg is Gabriel Cavedal's personal brand and organization. It covers his own
			domain and its subdomains, and the GitHub organization of the same name, where he
			publishes open-source repositories: developer tools, AI agent frameworks, IoT automation
			scripts, cloud infrastructure templates and application source code.`,
		related: ['cv', 'github'],
		tags: ['kodexarg', 'organization', 'brand', 'github', 'open source', 'repositories', 'what is kodexarg', 'ecosystem']
	},
	{
		id: 'repos-templates',
		title: 'Cloud infrastructure templates',
		text: `Gabriel publishes ready-to-use deployment templates: Astro 7 with Django 6 DRF on AWS
			ECS Fargate, Django on AWS App Runner, self-hosted n8n on App Runner, an AWS Lambda that
			updates Route53 DNS records from EC2 events, and an Angular 21 starter with PrimeNG, Tailwind
			v4 and Vitest. They are the reusable distillate of the infrastructure he runs in production.`,
		related: ['astro-drf-aws', 'dj-apprunner-template', 'n8n-apprunner', 'lambda-update-route53', 'template-angular-21-csr-primeng', 'skill-cloud-devops'],
		tags: ['templates', 'boilerplate', 'starter', 'infrastructure', 'aws', 'fargate', 'apprunner', 'lambda', 'route53', 'n8n', 'angular', 'astro', 'django']
	},
	{
		id: 'repos-iot',
		title: 'IoT and Raspberry Pi repositories',
		text: `The kodexArg IoT family includes dj-indoor-monitor for indoor crop telemetry,
			kdx-pi-signage and its version 2 for autonomous digital signage on Raspberry Pi, an RC522 RFID
			door access control system, a DHT22/DHT11 sensor daemon sending temperature and humidity
			alerts to Telegram, a camera motion-detection pipeline with Telegram alerts, and kdx-pi-cam
			for MJPEG streaming. All are public.`,
		related: ['dj-indoor-monitor', 'kdx-pi-signage', 'kdx-pi-signage-2', 'rpi-door-access-rfid', 'raspberry-pi-temperature-to-telegram', 'camera-alert-to-telegram', 'kdx-pi-cam', 'skill-infra-iot'],
		tags: ['iot', 'raspberry pi', 'sensors', 'signage', 'rfid', 'door access', 'cameras', 'telegram', 'alerts', 'streaming', 'mjpeg', 'esp32']
	},
	{
		id: 'repos-tools',
		title: 'Tools and assorted projects',
		text: `The public kodexArg repositories also include a local-network DNS ad-blocker written in
			Go, a deterministic cowsay renderer packaged as an agent skill, a Linux cursor theme in
			Claude's coral, a QA audit report portal, a sticker album app, a data engineering handbook, a
			ComfyUI diffusion GUI and an AI training deck built with Astro.`,
		related: ['blocky', 'cowsay', 'klaude-cursors', 'qa-reports', 'figus', 'data-engineer-handbook', 'comfyui-1', 'alvs-capacitacion', 'github'],
		tags: ['tools', 'dns', 'adblocker', 'blocky', 'cowsay', 'cursors', 'linux', 'qa', 'reports', 'stickers', 'data engineering', 'comfyui', 'training', 'misc']
	}
];

export const CV_CHUNKS_EN = defineChunks('cv', 'en', DEFS);
