import type { Locale } from "./i18n";

export type PlantillaId = "roadmap" | "arquitectura";

export const PLANTILLA_IDS: readonly PlantillaId[] = [
  "roadmap",
  "arquitectura",
];

export function isPlantillaId(value: unknown): value is PlantillaId {
  return PLANTILLA_IDS.some((id) => id === value);
}

// --- Roadmap ---------------------------------------------------------------

interface Phase {
  title: string;
  steps: readonly [string, string, string];
  milestone: string;
}

type RoadmapText = readonly [Phase, Phase, Phase];

const PHASE_IDS = [
  { subgraph: "F1", step: "A", milestone: "M1" },
  { subgraph: "F2", step: "B", milestone: "M2" },
  { subgraph: "F3", step: "C", milestone: "M3" },
] as const;

function buildRoadmap(phases: RoadmapText): string {
  const blocks = phases.map((phase, index) => {
    const ids = PHASE_IDS[index];
    if (!ids) throw new Error("Roadmap: fase fuera de rango.");
    const { subgraph, step, milestone } = ids;
    const [first, second, third] = phase.steps;

    return `    subgraph ${subgraph}["${phase.title}"]
        ${step}1["${first}"] --> ${step}2["${second}"]
        ${step}2 --> ${step}3["${third}"]
        ${step}3 --> ${milestone}(("${phase.milestone}"))
    end`;
  });

  return `flowchart TB
${blocks.join("\n\n")}

    M1 --> B1
    M2 --> C1`;
}

const ROADMAP_TEXT: Record<Locale, RoadmapText> = {
  es: [
    {
      title: "Fase 1 · Fundamentos",
      steps: [
        "Definir alcance y objetivos",
        "Diseñar la base del proyecto",
        "Configurar entorno y herramientas",
      ],
      milestone: "Hito 1: Base lista",
    },
    {
      title: "Fase 2 · Desarrollo",
      steps: [
        "Construir funcionalidades clave",
        "Pruebas y correcciones",
        "Documentar y recoger feedback",
      ],
      milestone: "Hito 2: Versión beta",
    },
    {
      title: "Fase 3 · Lanzamiento",
      steps: [
        "Optimizar rendimiento y seguridad",
        "Publicar versión estable",
        "Mantenimiento y mejora continua",
      ],
      milestone: "Hito 3: Versión 1.0",
    },
  ],
  en: [
    {
      title: "Phase 1 · Foundations",
      steps: [
        "Define scope and goals",
        "Design the project foundation",
        "Set up environment and tools",
      ],
      milestone: "Milestone 1: Foundation ready",
    },
    {
      title: "Phase 2 · Development",
      steps: [
        "Build key features",
        "Testing and fixes",
        "Document and gather feedback",
      ],
      milestone: "Milestone 2: Beta release",
    },
    {
      title: "Phase 3 · Launch",
      steps: [
        "Optimize performance and security",
        "Publish stable release",
        "Maintenance and continuous improvement",
      ],
      milestone: "Milestone 3: Version 1.0",
    },
  ],
  it: [
    {
      title: "Fase 1 · Fondamenta",
      steps: [
        "Definire ambito e obiettivi",
        "Progettare le basi del progetto",
        "Configurare ambiente e strumenti",
      ],
      milestone: "Traguardo 1: Base pronta",
    },
    {
      title: "Fase 2 · Sviluppo",
      steps: [
        "Realizzare le funzionalità chiave",
        "Test e correzioni",
        "Documentare e raccogliere feedback",
      ],
      milestone: "Traguardo 2: Versione beta",
    },
    {
      title: "Fase 3 · Lancio",
      steps: [
        "Ottimizzare prestazioni e sicurezza",
        "Pubblicare la versione stabile",
        "Manutenzione e miglioramento continuo",
      ],
      milestone: "Traguardo 3: Versione 1.0",
    },
  ],
  ca: [
    {
      title: "Fase 1 · Fonaments",
      steps: [
        "Definir l'abast i els objectius",
        "Dissenyar la base del projecte",
        "Configurar l'entorn i les eines",
      ],
      milestone: "Fita 1: Base llesta",
    },
    {
      title: "Fase 2 · Desenvolupament",
      steps: [
        "Construir les funcionalitats clau",
        "Proves i correccions",
        "Documentar i recollir comentaris",
      ],
      milestone: "Fita 2: Versió beta",
    },
    {
      title: "Fase 3 · Llançament",
      steps: [
        "Optimitzar el rendiment i la seguretat",
        "Publicar la versió estable",
        "Manteniment i millora contínua",
      ],
      milestone: "Fita 3: Versió 1.0",
    },
  ],
  de: [
    {
      title: "Phase 1 · Grundlagen",
      steps: [
        "Umfang und Ziele festlegen",
        "Projektgrundlage entwerfen",
        "Umgebung und Werkzeuge einrichten",
      ],
      milestone: "Meilenstein 1: Basis steht",
    },
    {
      title: "Phase 2 · Entwicklung",
      steps: [
        "Kernfunktionen entwickeln",
        "Tests und Korrekturen",
        "Dokumentieren und Feedback sammeln",
      ],
      milestone: "Meilenstein 2: Beta-Version",
    },
    {
      title: "Phase 3 · Einführung",
      steps: [
        "Leistung und Sicherheit optimieren",
        "Stabile Version veröffentlichen",
        "Wartung und laufende Verbesserung",
      ],
      milestone: "Meilenstein 3: Version 1.0",
    },
  ],
};

// --- Arquitectura ----------------------------------------------------------

interface ArchitectureText {
  client: string;
  web: string;
  mobile: string;
  backend: string;
  gateway: string;
  auth: string;
  business: string;
  data: string;
  database: string;
  cache: string;
  operations: string;
  logs: string;
  alerts: string;
}

function buildArchitecture(text: ArchitectureText): string {
  return `flowchart TB
    subgraph Cli["${text.client}"]
        U1["${text.web}"]
        U2["${text.mobile}"]
    end

    subgraph Back["${text.backend}"]
        G1["${text.gateway}"] --> S1["${text.auth}"]
        G1 --> S2["${text.business}"]
    end

    subgraph Dat["${text.data}"]
        D1[("${text.database}")]
        D2[("${text.cache}")]
    end

    subgraph Ops["${text.operations}"]
        O1["${text.logs}"]
        O2["${text.alerts}"]
    end

    U1 --> G1
    U2 --> G1
    S1 --> D1
    S2 --> D1
    S2 --> D2
    S1 --> O1
    S2 --> O1
    O1 --> O2`;
}

const ARCHITECTURE_TEXT: Record<Locale, ArchitectureText> = {
  es: {
    client: "Cliente",
    web: "Navegador web",
    mobile: "Aplicación móvil",
    backend: "Backend",
    gateway: "API Gateway",
    auth: "Servicio de autenticación",
    business: "Servicio de negocio",
    data: "Datos",
    database: "Base de datos",
    cache: "Caché",
    operations: "Operaciones",
    logs: "Registros y métricas",
    alerts: "Alertas",
  },
  en: {
    client: "Client",
    web: "Web browser",
    mobile: "Mobile app",
    backend: "Backend",
    gateway: "API Gateway",
    auth: "Authentication service",
    business: "Business service",
    data: "Data",
    database: "Database",
    cache: "Cache",
    operations: "Operations",
    logs: "Logs and metrics",
    alerts: "Alerts",
  },
  it: {
    client: "Client",
    web: "Browser web",
    mobile: "App mobile",
    backend: "Backend",
    gateway: "API Gateway",
    auth: "Servizio di autenticazione",
    business: "Servizio di business",
    data: "Dati",
    database: "Database",
    cache: "Cache",
    operations: "Operazioni",
    logs: "Log e metriche",
    alerts: "Avvisi",
  },
  ca: {
    client: "Client",
    web: "Navegador web",
    mobile: "Aplicació mòbil",
    backend: "Backend",
    gateway: "API Gateway",
    auth: "Servei d'autenticació",
    business: "Servei de negoci",
    data: "Dades",
    database: "Base de dades",
    cache: "Memòria cau",
    operations: "Operacions",
    logs: "Registres i mètriques",
    alerts: "Alertes",
  },
  de: {
    client: "Client",
    web: "Webbrowser",
    mobile: "Mobile App",
    backend: "Backend",
    gateway: "API-Gateway",
    auth: "Authentifizierungsdienst",
    business: "Geschäftsdienst",
    data: "Daten",
    database: "Datenbank",
    cache: "Cache",
    operations: "Betrieb",
    logs: "Protokolle und Metriken",
    alerts: "Warnungen",
  },
};

/** Ejemplos genéricos de uso libre; no representan ningún proyecto u organización real. */
export function getTemplate(id: PlantillaId, locale: Locale): string {
  return id === "roadmap"
    ? buildRoadmap(ROADMAP_TEXT[locale])
    : buildArchitecture(ARCHITECTURE_TEXT[locale]);
}

/** Plantilla a la que corresponde `code` tal cual (sin editar) en ese idioma. */
export function detectTemplate(
  code: string,
  locale: Locale,
): PlantillaId | undefined {
  return PLANTILLA_IDS.find((id) => getTemplate(id, locale) === code);
}
