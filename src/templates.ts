export type PlantillaId = "roadmap" | "arquitectura";

export function isPlantillaId(value: unknown): value is PlantillaId {
  return typeof value === "string" && Object.hasOwn(PLANTILLAS, value);
}

/** Ejemplos genéricos de uso libre; no representan ningún proyecto u organización real. */
export const PLANTILLAS: Record<PlantillaId, string> = {
  roadmap: `flowchart TB
    subgraph F1["Fase 1 · Fundamentos"]
        A1["Definir alcance y objetivos"] --> A2["Diseñar la base del proyecto"]
        A2 --> A3["Configurar entorno y herramientas"]
        A3 --> M1(("Hito 1: Base lista"))
    end

    subgraph F2["Fase 2 · Desarrollo"]
        B1["Construir funcionalidades clave"] --> B2["Pruebas y correcciones"]
        B2 --> B3["Documentar y recoger feedback"]
        B3 --> M2(("Hito 2: Versión beta"))
    end

    subgraph F3["Fase 3 · Lanzamiento"]
        C1["Optimizar rendimiento y seguridad"] --> C2["Publicar versión estable"]
        C2 --> C3["Mantenimiento y mejora continua"]
        C3 --> M3(("Hito 3: Versión 1.0"))
    end

    M1 --> B1
    M2 --> C1`,

  arquitectura: `flowchart TB
    subgraph Cliente["Cliente"]
        U1["Navegador web"]
        U2["Aplicación móvil"]
    end

    subgraph Backend["Backend"]
        G1["API Gateway"] --> S1["Servicio de autenticación"]
        G1 --> S2["Servicio de negocio"]
    end

    subgraph Datos["Datos"]
        D1[("Base de datos")]
        D2[("Caché")]
    end

    subgraph Operaciones["Operaciones"]
        O1["Registros y métricas"]
        O2["Alertas"]
    end

    U1 --> G1
    U2 --> G1
    S1 --> D1
    S2 --> D1
    S2 --> D2
    S1 --> O1
    S2 --> O1
    O1 --> O2`,
};
