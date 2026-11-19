import { COPY_FEEDBACK_MS, RENDER_DEBOUNCE_MS, STORAGE_KEYS } from "./config";
import { debounce } from "./debounce";
import { requireElement } from "./dom";
import { exportPng, exportSvg } from "./exporter";
import { DiagramRenderer } from "./renderer";
import { safeStorage } from "./storage";
import { normalizeSvg } from "./svg";
import { isPlantillaId, PLANTILLAS } from "./templates";
import {
  applyThemeToDocument,
  loadInitialTheme,
  saveTheme,
  type Theme,
} from "./theme";
import { Viewport } from "./viewport";

// --- Elementos -------------------------------------------------------------

const el = {
  code: requireElement("codigo", HTMLTextAreaElement),
  output: requireElement("salida", HTMLElement),
  canvas: requireElement("lienzo", HTMLDivElement),
  error: requireElement("log", HTMLPreElement),
  leftPanel: requireElement("panel-izq", HTMLElement),
  saveStatus: requireElement("estado-guardado", HTMLSpanElement),
  zoomLabel: requireElement("zoom-valor", HTMLSpanElement),
  collapsePanel: requireElement("btn-contraer-panel", HTMLButtonElement),
  togglePanel: requireElement("btn-toggle-code", HTMLButtonElement),
  theme: requireElement("btn-tema", HTMLButtonElement),
  copy: requireElement("btn-copiar", HTMLButtonElement),
  exportSvg: requireElement("btn-svg", HTMLButtonElement),
  exportPng: requireElement("btn-png", HTMLButtonElement),
  zoomIn: requireElement("zoom-in", HTMLButtonElement),
  zoomOut: requireElement("zoom-out", HTMLButtonElement),
  zoomReset: requireElement("zoom-reset", HTMLButtonElement),
  zoomFit: requireElement("zoom-fit", HTMLButtonElement),
  pan: requireElement("btn-manito", HTMLButtonElement),
  clear: requireElement("tpl-limpiar", HTMLButtonElement),
};

// --- Estado ----------------------------------------------------------------

const renderer = new DiagramRenderer();
const viewport = new Viewport(el.output, el.canvas, (zoom) => {
  el.zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
});
let theme: Theme = loadInitialTheme();

// --- Mensajes de error -----------------------------------------------------

function showError(message: string): void {
  el.error.style.display = "block";
  el.error.textContent = message;
}

function clearError(): void {
  el.error.style.display = "none";
  el.error.textContent = "";
}

// --- Diagrama --------------------------------------------------------------

function clearDiagram(): void {
  el.canvas.replaceChildren();
  viewport.updateScrollSpace();
}

async function draw(): Promise<void> {
  clearError();

  const code = el.code.value;
  if (!code.trim()) {
    renderer.cancel();
    clearDiagram();
    return;
  }

  const result = await renderer.render(code, theme);

  switch (result.status) {
    case "stale":
      return;
    case "error":
      clearDiagram();
      showError(`Error al renderizar:\n${result.message}`);
      return;
    case "ok": {
      // El SVG ya viene sanitizado por Mermaid (securityLevel: "strict").
      el.canvas.innerHTML = result.svg;
      const svg = el.canvas.querySelector("svg");
      if (svg) normalizeSvg(svg);
      viewport.refresh();
    }
  }
}

const drawDebounced = debounce(() => void draw(), RENDER_DEBOUNCE_MS);

// --- Persistencia ----------------------------------------------------------

function saveCode(): void {
  const saved = safeStorage.set(STORAGE_KEYS.code, el.code.value);
  el.saveStatus.textContent = saved
    ? "Guardado en localStorage"
    : "No se pudo guardar en localStorage";
}

function loadInitialCode(): void {
  const saved = safeStorage.get(STORAGE_KEYS.code);
  if (saved !== null) {
    el.code.value = saved;
    el.saveStatus.textContent = "Recuperado de localStorage";
  } else {
    el.code.value = PLANTILLAS.roadmap;
  }
}

/** Reemplaza el contenido del editor y renderiza sin esperar al debounce. */
function setCode(code: string): void {
  drawDebounced.cancel();
  el.code.value = code;
  saveCode();
  void draw();
}

// --- Tema ------------------------------------------------------------------

function setTheme(next: Theme): void {
  theme = next;
  applyThemeToDocument(theme);
  el.theme.title =
    theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
  el.theme.setAttribute("aria-pressed", String(theme === "dark"));
}

// --- Panel de código -------------------------------------------------------

function setPanelCollapsed(collapsed: boolean): void {
  el.leftPanel.classList.toggle("contraido", collapsed);
  el.togglePanel.setAttribute("aria-expanded", String(!collapsed));
  el.togglePanel.classList.toggle("activo", collapsed);
  el.togglePanel.title = collapsed
    ? "Expandir panel de código"
    : "Contraer panel de código";
  viewport.updateScrollSpace();
}

const isPanelCollapsed = (): boolean =>
  el.leftPanel.classList.contains("contraido");

// --- Acciones --------------------------------------------------------------

async function copyCode(): Promise<void> {
  if (!el.code.value) return;
  try {
    await navigator.clipboard.writeText(el.code.value);
    const originalTitle = el.copy.title;
    el.copy.title = "Copiado";
    setTimeout(() => {
      el.copy.title = originalTitle;
    }, COPY_FEEDBACK_MS);
  } catch {
    showError("No se pudo copiar al portapapeles.");
  }
}

async function downloadPng(svg: SVGElement): Promise<void> {
  try {
    await exportPng(svg, getComputedStyle(el.output).backgroundColor);
  } catch (error) {
    showError(
      error instanceof Error ? error.message : "No se pudo exportar a PNG.",
    );
  }
}

// --- Eventos ---------------------------------------------------------------

function bindEvents(): void {
  el.code.addEventListener("input", () => {
    saveCode();
    drawDebounced();
  });

  for (const button of document.querySelectorAll<HTMLElement>(
    "[data-plantilla]",
  )) {
    button.addEventListener("click", () => {
      const id: unknown = button.dataset.plantilla;
      if (isPlantillaId(id)) setCode(PLANTILLAS[id]);
    });
  }
  el.clear.addEventListener("click", () => setCode(""));

  el.theme.addEventListener("click", () => {
    setTheme(theme === "dark" ? "light" : "dark");
    saveTheme(theme);
    void draw();
  });

  el.collapsePanel.addEventListener("click", () => setPanelCollapsed(true));
  el.togglePanel.addEventListener("click", () =>
    setPanelCollapsed(!isPanelCollapsed()),
  );

  el.zoomIn.addEventListener("click", () => viewport.zoomIn());
  el.zoomOut.addEventListener("click", () => viewport.zoomOut());
  el.zoomReset.addEventListener("click", () => viewport.reset());
  el.zoomFit.addEventListener("click", () => viewport.fit());
  el.pan.addEventListener("click", () => {
    const active = !viewport.isPanMode;
    viewport.setPanMode(active);
    el.pan.classList.toggle("activo", active);
    el.pan.setAttribute("aria-pressed", String(active));
  });

  el.copy.addEventListener("click", () => void copyCode());
  el.exportSvg.addEventListener("click", () => {
    const svg = el.canvas.querySelector("svg");
    if (svg) exportSvg(svg);
  });
  el.exportPng.addEventListener("click", () => {
    const svg = el.canvas.querySelector("svg");
    if (svg) void downloadPng(svg);
  });

  window.addEventListener("error", (event) => {
    showError(`Error de ventana: ${event.message || event.filename}`);
  });
  window.addEventListener("unhandledrejection", (event) => {
    const reason: unknown = event.reason;
    showError(
      `Error inesperado: ${reason instanceof Error ? reason.message : String(reason)}`,
    );
  });
}

// --- Arranque --------------------------------------------------------------

setTheme(theme);
loadInitialCode();
bindEvents();
void draw();
