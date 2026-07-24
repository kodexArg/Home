import type { RouteDestination } from './types';

export const KODEX_DESTINATIONS: RouteDestination[] = [
  // =========================================================================
  // 1. LIVE WEB APPLICATIONS & CORE ECOSYSTEM SERVICES
  // =========================================================================
  {
    id: 'home',
    name: 'kodexArg Home - Intent Router',
    url: 'https://home.kodexarg.com',
    description: 'Minimalist front door and intelligent closed-action intent router for the kodexArg ecosystem. Built with Astro 7, Svelte 5 islands, Cloudflare Workers AI (@cf/baai/bge-small-en-v1.5), and Cloudflare Vectorize vector search.',
    keywords: [
      'home', 'inicio', 'portal', 'router', 'console', 'terminal', 'intent router',
      'kodex', 'kodexarg', 'front door', 'pipboy', 'syv', 'vector search', 'cloudflare vectorize'
    ]
  },
  {
    id: 'cv',
    name: 'Currículum / CV - Gabriel Cavedal',
    url: 'https://cv.kodexarg.com',
    description: 'Interactive professional resume, career history, tech stack skills, past roles, background, education, and portfolio projects of Gabriel Cavedal (kodexArg). Built with Astro and Svelte.',
    keywords: [
      'cv', 'curriculum', 'currículum', 'resume', 'hoja de vida', 'experiencia',
      'trayectoria', 'perfil', 'trabajo', 'habilidades', 'background', 'experience',
      'gabriel cavedal', 'cavedal', 'laboral', 'bio', 'biografia', 'profile'
    ]
  },
  {
    id: 'docs',
    name: 'Documentación General - kodexArg Docs',
    url: 'https://docs.kodexarg.com',
    description: 'Central public documentation portal, technical specifications, Architecture Decision Records (ADRs), API references, user manuals, and developer guidelines for the kodexArg ecosystem.',
    keywords: [
      'docs', 'doc', 'documentacion', 'documentación', 'guia', 'guías', 'manual',
      'wiki', 'api', 'especificaciones', 'arquitectura', 'adr', 'referencia',
      'documentation', 'guides', 'tech specs'
    ]
  },
  {
    id: 'payflow',
    name: 'Payflow - Financial Gateway',
    url: 'https://payflow.kodexarg.com',
    description: 'Production financial gateway and payment routing service for kodexArg ecosystem (alvs-financial-gateway). Features resilient multi-provider payment orchestration, closed intent validation, secure transaction auditing, and checkout pipelines.',
    keywords: [
      'payflow', 'financial gateway', 'pasarela de pagos', 'pagos', 'payments',
      'finanzas', 'transacciones', 'gateway', 'alvs-financial-gateway', 'tarjetas',
      'cobros', 'billing', 'checkout', 'money'
    ]
  },
  {
    id: 'welpdesk',
    name: 'Welpdesk - Support Ticketing System',
    url: 'https://helpdesk.kodexarg.com',
    description: 'Configurable multi-tenant help-desk and customer support ticketing platform (welpdesk). Built with Django 5, HTMX, Tailwind CSS, and Docker. Provides ticket lifecycle tracking, SLA management, multi-org isolation, and customer support workflows.',
    keywords: [
      'welpdesk', 'helpdesk', 'support', 'soporte', 'tickets', 'ticketing',
      'mesas de ayuda', 'atencion al cliente', 'django', 'htmx', 'incidencias',
      'issues', 'customer support', 'help desk'
    ]
  },
  {
    id: 'kcbd-monitor',
    name: 'KCBD Indoor Crop IoT Monitor',
    url: 'https://kcbd.kodexarg.com',
    description: 'Real-time IoT environmental telemetry monitoring and dashboard for indoor crop facilities (dj-indoor-monitor). Connects Raspberry Pi sensor nodes (temperature, humidity, moisture, light, CO2) to a Django DRF REST API backed by TimescaleDB.',
    keywords: [
      'kcbd', 'kcbd-monitor', 'indoor crop', 'cultivo indoor', 'monitoreo indoor',
      'iot', 'sensors', 'sensores', 'timescaledb', 'raspberry pi', 'temperatura',
      'humedad', 'telemetria', 'telemetry', 'dj-indoor-monitor', 'crop monitoring'
    ]
  },
  {
    id: 'syv-design-system',
    name: 'SyV Design System (Subordinación y Valor)',
    url: 'https://design.kodexarg.com',
    description: 'Official design system for kodexArg platforms featuring Subordinación y Valor (SyV) tokens, presentation orange (#D97757 / #E85D04) accents, dark console aesthetics, Pip-Boy input mechanics, and accessible UI component rules.',
    keywords: [
      'syv', 'syv-design-system', 'design system', 'diseño', 'diseno', 'paleta',
      'componentes', 'estilos', 'css', 'theme', 'pipboy', 'presentation orange',
      'ui tokens', 'design tokens', 'frontend guidelines'
    ]
  },
  {
    id: 'github',
    name: 'Organización GitHub - kodexArg',
    url: 'https://github.com/kodexarg',
    description: 'Official GitHub organization hosting open-source repositories, developer tools, AI agent frameworks, IoT automation scripts, cloud infrastructure templates, and application source code.',
    keywords: [
      'github', 'repo', 'repos', 'repositorio', 'repositorios', 'código', 'codigo',
      'source', 'proyectos', 'git', 'open source', 'fuente', 'organization', 'kodexarg github'
    ]
  },

  // =========================================================================
  // 2. PUBLIC REPOSITORIES - AI, AGENTS & MCP SERVERS
  // =========================================================================
  {
    id: 'engram',
    name: 'Engram - Agent Memory System',
    url: 'https://github.com/kodexArg/engram',
    description: 'Agent-agnostic persistent memory system for AI coding agents. Built as a high-performance Go binary utilizing SQLite + FTS5 full-text search, Model Context Protocol (MCP) server integration, HTTP API, CLI interface, and interactive TUI.',
    keywords: [
      'engram', 'memory', 'memoria', 'fts5', 'sqlite', 'mcp', 'go', 'golang',
      'agent memory', 'persistent memory', 'context window', 'long term memory', 'tui', 'mcp server'
    ]
  },
  {
    id: 'openclaw',
    name: 'OpenClaw - Personal AI Assistant',
    url: 'https://github.com/kodexArg/openclaw',
    description: 'Cross-platform personal AI assistant framework designed to run locally or self-hosted on any OS. Features modular plugin channels, local tool invocation, and autonomous task execution ("the lobster way").',
    keywords: [
      'openclaw', 'assistant', 'asistente', 'lobster', 'ai assistant', 'personal ai',
      'local agent', 'autonomous assistant', 'openclaw agent'
    ]
  },
  {
    id: 'odysseus',
    name: 'Odysseus - Self-Hosted AI Workspace',
    url: 'https://github.com/kodexArg/odysseus',
    description: 'Self-hosted AI workspace environment for orchestrating multi-agent collaboration, LLM workflow automation, document processing, and local AI model management.',
    keywords: [
      'odysseus', 'workspace', 'self-hosted', 'ai workspace', 'odiseo', 'llm workspace',
      'agent workspace', 'local llm dashboard'
    ]
  },
  {
    id: 'python-telegram-bot-mcp',
    name: 'Python Telegram Bot MCP Server',
    url: 'https://github.com/kodexArg/python-telegram-bot-mcp',
    description: 'Model Context Protocol (MCP) server that exposes python-telegram-bot methods as standardized MCP tools, enabling AI agents to programmatically send messages, manage chats, inspect updates, and trigger Telegram automation via 1:1 API mappings.',
    keywords: [
      'python-telegram-bot-mcp', 'telegram bot', 'mcp telegram', 'telegram api',
      'mcp tools', 'telegram bridge', 'mcp server', 'bot api'
    ]
  },

  // =========================================================================
  // 3. PUBLIC REPOSITORIES - IOT, EMBEDDED & HARDWARE AUTOMATION
  // =========================================================================
  {
    id: 'dj-indoor-monitor',
    name: 'dj-indoor-monitor (Backend Repo)',
    url: 'https://github.com/kodexArg/dj-indoor-monitor',
    description: 'Django + Django REST Framework API and telemetry dashboard for indoor-crop IoT sensor monitoring (Raspberry Pi -> TimescaleDB), fully containerized with Docker.',
    keywords: [
      'dj-indoor-monitor', 'indoor', 'crop', 'iot', 'sensors', 'sensores',
      'timescaledb', 'raspberry pi', 'monitoreo', 'django drf'
    ]
  },
  {
    id: 'kdx-pi-signage',
    name: 'kdx-pi-signage - Digital Signage Looper',
    url: 'https://github.com/kodexArg/kdx-pi-signage',
    description: 'Autonomous digital-signage video looper for Raspberry Pi 3 A+ using VLC background engine, systemd watchdog service, auto-media scanning, and self-recovery routines.',
    keywords: [
      'kdx-pi-signage', 'signage', 'marquesina', 'vlc', 'video looper',
      'digital signage', 'raspberry pi', 'rpi3', 'carteleria digital', 'pantalla'
    ]
  },
  {
    id: 'kdx-pi-signage-2',
    name: 'kdx-pi-signage-2 - Digital Signage v2',
    url: 'https://github.com/kodexArg/kdx-pi-signage-2',
    description: 'Second-generation autonomous digital-signage controller for Raspberry Pi hardware, featuring multi-screen coordination, remote media sync, and enhanced playback reliability.',
    keywords: [
      'kdx-pi-signage-2', 'signage 2', 'video looper 2', 'digital signage v2',
      'rpi signage', 'carteleria v2'
    ]
  },
  {
    id: 'rpi-door-access-rfid',
    name: 'Raspberry Pi RFID Door Access System',
    url: 'https://github.com/kodexArg/rpi-door-access-rfid',
    description: 'Hardware access control and electronic door lock management system using Raspberry Pi, RC522 RFID card reader, relay switches, and local authorization database.',
    keywords: [
      'rpi-door-access-rfid', 'rfid', 'door access', 'control de acceso',
      'raspberry pi door', 'puerta', 'cerradura electronica', 'tarjeta rfid', 'badge access'
    ]
  },
  {
    id: 'raspberry-pi-temperature-to-telegram',
    name: 'Raspberry Pi Temp & Humidity Telegram Bot',
    url: 'https://github.com/kodexArg/raspberry-pi-temperature-to-telegram',
    description: 'IoT environmental sensor daemon for Raspberry Pi connected to DHT22/DHT11 sensors, delivering instant threshold alerts and periodic temperature/humidity reports to Telegram.',
    keywords: [
      'raspberry-pi-temperature-to-telegram', 'temperatura', 'humedad', 'telegram',
      'rpi sensor', 'dht22', 'dht11', 'alertas temperatura', 'sensor de ambiente'
    ]
  },
  {
    id: 'camera-alert-to-telegram',
    name: 'Camera Motion Alert to Telegram',
    url: 'https://github.com/kodexArg/camera-alert-to-telegram',
    description: 'Security camera motion detection pipeline that captures snapshots and video clips on motion events and streams real-time alerts directly to a Telegram channel.',
    keywords: [
      'camera-alert-to-telegram', 'camera', 'camara', 'alerta', 'telegram alert',
      'motion detection', 'seguridad', 'camara de seguridad', 'deteccion de movimiento'
    ]
  },
  {
    id: 'kdx-pi-cam',
    name: 'kdx-pi-cam - RPi Camera Streaming',
    url: 'https://github.com/kodexArg/kdx-pi-cam',
    description: 'Raspberry Pi camera video streaming and image capture tool for low-latency MJPEG video feeds and automated frame captures.',
    keywords: [
      'kdx-pi-cam', 'pi cam', 'camara rpi', 'mjpeg stream', 'raspberry pi camera',
      'video stream', 'camerastream'
    ]
  },

  // =========================================================================
  // 4. PUBLIC REPOSITORIES - TEMPLATES & CLOUD INFRASTRUCTURE
  // =========================================================================
  {
    id: 'template-angular-21-csr-primeng',
    name: 'Angular 21 + PrimeNG 21 Starter Template',
    url: 'https://github.com/kodexArg/template-angular-21-csr-primeng',
    description: 'Angular 21 Client-Side Rendered (CSR) starter boilerplate with PrimeNG 21 UI components, Tailwind CSS v4, Vitest testing suite, and pre-loaded Claude Code agent skills.',
    keywords: [
      'template-angular-21-csr-primeng', 'angular', 'angular 21', 'primeng',
      'tailwind v4', 'vitest', 'starter', 'frontend template', 'csr template', 'boilerplate'
    ]
  },
  {
    id: 'astro-drf-aws',
    name: 'Astro 7 + Django 6 DRF AWS Fargate Template',
    url: 'https://github.com/kodexArg/astro-drf-aws',
    description: 'Full-stack cloud deployment template featuring Astro 7 SSR + Svelte frontend paired with Django 6 + DRF backend, deployed as dual container services on AWS ECS Fargate.',
    keywords: [
      'astro-drf-aws', 'fargate', 'aws', 'django drf', 'svelte', 'template',
      'ecs fargate', 'astro ssr', 'fullstack template', 'aws ECS'
    ]
  },
  {
    id: 'dj-apprunner-template',
    name: 'Django AWS AppRunner Template',
    url: 'https://github.com/kodexArg/dj-apprunner-template',
    description: 'Turnkey deployment boilerplate for running containerized Django web applications on AWS AppRunner with automated CI/CD and PostgreSQL database setup.',
    keywords: [
      'dj-apprunner-template', 'apprunner', 'aws apprunner', 'django template',
      'container deployment', 'aws django', 'serverless container'
    ]
  },
  {
    id: 'n8n-apprunner',
    name: 'n8n Automation Service on AWS AppRunner',
    url: 'https://github.com/kodexArg/n8n-apprunner',
    description: 'Infrastructure template for deploying self-hosted n8n workflow automation platform on AWS AppRunner with persistent PostgreSQL storage.',
    keywords: [
      'n8n-apprunner', 'n8n', 'automation', 'workflow', 'n8n deployment',
      'aws apprunner n8n', 'workflow engine', 'low code'
    ]
  },
  {
    id: 'lambda-update-route53',
    name: 'AWS Lambda Dynamic Route53 DNS Updater',
    url: 'https://github.com/kodexArg/lambda-update-route53',
    description: 'AWS Lambda serverless function that listens to EC2 instance state events and automatically updates AWS Route53 DNS A-records with instance IP addresses.',
    keywords: [
      'lambda-update-route53', 'route53', 'ec2', 'aws lambda', 'dns update',
      'dynamic dns', 'route53 updater', 'auto dns'
    ]
  },

  // =========================================================================
  // 5. PUBLIC REPOSITORIES - DEVELOPER TOOLS & SPECIALIZED PROJECTS
  // =========================================================================
  {
    id: 'blocky',
    name: 'Blocky - Local Network DNS Ad-Blocker',
    url: 'https://github.com/kodexArg/blocky',
    description: 'Fast, lightweight DNS proxy and local network ad-blocker written in Go. Supports DNS-over-HTTPS (DoH), gRPC interfaces, custom blocklists, and local hostname resolution.',
    keywords: [
      'blocky', 'dns', 'adblocker', 'proxy', 'network', 'pi-hole alternative',
      'dns filter', 'bloqueador de publicidad', 'dns resolver'
    ]
  },
  {
    id: 'cf-ng-eurotrip2026',
    name: 'Eurotrip 2026 Planner (Angular 21)',
    url: 'https://github.com/kodexArg/cf-ng-eurotrip2026',
    description: 'Trip planning and itinerary tracking web application built with Angular 21 for Eurotrip 2026, featuring interactive maps, budget calculation, and schedule management.',
    keywords: [
      'cf-ng-eurotrip2026', 'eurotrip', 'planner', 'viajes', 'angular 21',
      'itinerary', 'travel app', 'presupuesto viaje'
    ]
  },
  {
    id: 'comfyui-1',
    name: 'ComfyUI Graph-Based Diffusion GUI',
    url: 'https://github.com/kodexArg/comfyui-1',
    description: 'Modular Stable Diffusion GUI, API backend, and node graph execution pipeline for procedural AI image generation, ControlNet workflows, and image synthesis.',
    keywords: [
      'comfyui-1', 'comfyui', 'diffusion', 'nodes', 'gui', 'image gen',
      'stable diffusion', 'generacion de imagenes', 'ai art'
    ]
  },
  {
    id: 'cowsay',
    name: 'Cowsay Agent Skill',
    url: 'https://github.com/kodexArg/cowsay',
    description: 'Deterministic cowsay ASCII renderer and AI agent skill implemented in pure Python 3 standard library, packaged with standardized SKILL.md agent instructions.',
    keywords: [
      'cowsay', 'skill', 'cowsay agent', 'ascii art', 'python cowsay', 'agent skill'
    ]
  },
  {
    id: 'data-engineer-handbook',
    name: 'Data Engineering Handbook',
    url: 'https://github.com/kodexArg/data-engineer-handbook',
    description: 'Curated technical reference, study guide, and roadmap covering data engineering concepts, SQL optimization, Apache Spark, Kafka, Airflow, and ETL data pipelines.',
    keywords: [
      'data-engineer-handbook', 'data engineering', 'handbook', 'datos',
      'ingenieria de datos', 'etl', 'data pipeline', 'spark', 'sql'
    ]
  },
  {
    id: 'klaude-cursors',
    name: 'Klaude Cursors - Linux Desktop Theme',
    url: 'https://github.com/kodexArg/klaude-cursors',
    description: 'Modern rounded cursor theme for Linux desktop environments based on Bibata, styled with Anthropic Claude coral accent (#D97757).',
    keywords: [
      'klaude-cursors', 'cursors', 'bibata', 'claude theme', 'coral',
      'cursor theme', 'linux theme', 'mouse pointer'
    ]
  },
  {
    id: 'qa-reports',
    name: 'QA Audit Reports Portal',
    url: 'https://github.com/kodexArg/qa-reports',
    description: 'Centralized static portal hosting standalone HTML quality assurance audit reports, automated test execution results, and software testing metrics.',
    keywords: [
      'qa-reports', 'qa', 'audit', 'reportes', 'testing', 'calidad',
      'informes qa', 'test results', 'qa metrics'
    ]
  },
  {
    id: 'figus',
    name: 'Figus - Sticker Album Collector',
    url: 'https://github.com/kodexArg/figus',
    description: 'Digital sticker album and trading card collector web app for tracking duplicate stickers, completed collections, and sticker swap lists.',
    keywords: [
      'figus', 'figuras', 'stickers', 'album', 'figuritas', 'coleccion',
      'trading cards', 'intercambio'
    ]
  },
  {
    id: 'alvs-capacitacion',
    name: 'ALVS Capacitación IA (Astro Deck)',
    url: 'https://github.com/kodexArg/alvs-capacitacion',
    description: 'Interactive web presentation deck built with Astro for artificial intelligence corporate training, AI engineering workshops, and technical seminars.',
    keywords: [
      'alvs-capacitacion', 'capacitacion', 'alvs', 'presentacion', 'astro',
      'ia', 'slides', 'curso ia', 'training'
    ]
  },
  {
    id: 'astro-cv',
    name: 'astro-cv (CV Source Repo)',
    url: 'https://github.com/kodexArg/astro-cv',
    description: 'Source code repository for Gabriel Cavedal\'s CV/Resume website built with Astro and Svelte.',
    keywords: [
      'astro-cv', 'cavedal', 'gabriel', 'astro resume', 'cv repo'
    ]
  }
];
