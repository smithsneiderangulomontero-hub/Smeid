import type { Theme } from "./theme";

type MermaidApi = typeof import("mermaid")["default"];

export type RenderResult =
  | { status: "ok"; svg: string }
  /** Una petición más reciente (o una cancelación) invalidó esta. */
  | { status: "stale" }
  | { status: "error"; message: string };

const STALE: RenderResult = { status: "stale" };

let mermaidLoader: Promise<MermaidApi> | undefined;

/** Carga Mermaid bajo demanda para no bloquear el arranque de la interfaz. */
function loadMermaid(): Promise<MermaidApi> {
  mermaidLoader ??= import("mermaid")
    .then((module) => module.default)
    .catch((error: unknown) => {
      mermaidLoader = undefined; // permite reintentar
      throw error;
    });
  return mermaidLoader;
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Envuelve Mermaid garantizando que solo el último render solicitado se
 * considera válido (evita que un render lento pise a uno más reciente).
 */
export class DiagramRenderer {
  private latestRequest = 0;
  private configuredTheme: Theme | undefined;

  /** Invalida cualquier render en curso. */
  cancel(): void {
    this.latestRequest += 1;
  }

  async render(code: string, theme: Theme): Promise<RenderResult> {
    const request = ++this.latestRequest;
    const diagramId = `smeid-diagrama-${request}`;
    const isStale = (): boolean => request !== this.latestRequest;

    try {
      const mermaid = await loadMermaid();
      if (isStale()) return STALE;

      this.configure(mermaid, theme);
      const { svg } = await mermaid.render(diagramId, code);
      return isStale() ? STALE : { status: "ok", svg };
    } catch (error) {
      // Mermaid deja su contenedor temporal en el DOM cuando el render falla.
      document.getElementById(`d${diagramId}`)?.remove();
      return isStale() ? STALE : { status: "error", message: toMessage(error) };
    }
  }

  private configure(mermaid: MermaidApi, theme: Theme): void {
    if (this.configuredTheme === theme) return;

    mermaid.initialize({
      startOnLoad: false,
      // "strict" sanitiza el SVG y desactiva HTML/clics en el diagrama.
      securityLevel: "strict",
      suppressErrorRendering: true,
      theme: theme === "dark" ? "dark" : "default",
      flowchart: {
        curve: "basis",
        nodeSpacing: 35,
        rankSpacing: 55,
        padding: 15,
      },
    });
    this.configuredTheme = theme;
  }
}
