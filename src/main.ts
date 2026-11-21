import { COPY_FEEDBACK_MS, RENDER_DEBOUNCE_MS, STORAGE_KEYS } from "./config";
import { debounce } from "./debounce";
import { requireElement } from "./dom";
import {
  ExportError,
  type ExportErrorCode,
  exportPng,
  exportSvg,
} from "./exporter";
import { isLocale, LOCALES, type Locale, type MessageKey } from "./i18n";
import {
  detectInitialLocale,
  getLocale,
  onLocaleChange,
  setLocale,
  t,
} from "./i18n/dom";
import { DiagramRenderer } from "./renderer";
import { safeStorage } from "./storage";
import { normalizeSvg } from "./svg";
import { detectTemplate, getTemplate, isPlantillaId } from "./templates";
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
  language: requireElement("idioma", HTMLSelectElement),
};

const EXPORT_ERROR_KEYS = {
  image: "error.export.image",
  png: "error.export.png",
  canvas: "error.export.canvas",
} as const satisfies Record<ExportErrorCode, MessageKey>;

// --- Estado ----------------------------------------------------------------

const renderer = new DiagramRenderer();
const viewport = new Viewport(el.output, el.canvas, (zoom) => {
  el.zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
});
let theme: Theme = loadInitialTheme();
let saveStatusKey: MessageKey = "status.initial";

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
      showError(`${t("error.render")}\n${result.message}`);
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

function setSaveStatus(key: MessageKey): void {
  saveStatusKey = key;
  el.saveStatus.textContent = t(key);
}

function saveCode(): void {
  const saved = safeStorage.set(STORAGE_KEYS.code, el.code.value);
  setSaveStatus(saved ? "status.saved" : "status.saveFailed");
}

function loadInitialCode(): void {
  const saved = safeStorage.get(STORAGE_KEYS.code);
  if (saved !== null) {
    el.code.value = saved;
    setSaveStatus("status.restored");
  } else {
    el.code.value = getTemplate("roadmap", getLocale());
    setSaveStatus("status.initial");
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

function refreshThemeTitle(): void {
  el.theme.title = t(theme === "dark" ? "theme.toLight" : "theme.toDark");
}

function setTheme(next: Theme): void {
  theme = next;
  applyThemeToDocument(theme);
  refreshThemeTitle();
  el.theme.setAttribute("aria-pressed", String(theme === "dark"));
}

// --- Panel de código -------------------------------------------------------

const isPanelCollapsed = (): boolean =>
  el.leftPanel.classList.contains("contraido");

function refreshPanelTitle(): void {
  el.togglePanel.title = t(
    isPanelCollapsed() ? "panel.expand" : "panel.collapse",
  );
}

function setPanelCollapsed(collapsed: boolean): void {
  el.leftPanel.classList.toggle("contraido", collapsed);
  el.togglePanel.setAttribute("aria-expanded", String(!collapsed));
  el.togglePanel.classList.toggle("activo", collapsed);
  refreshPanelTitle();
  viewport.updateScrollSpace();
}

// --- Idioma ----------------------------------------------------------------

function populateLanguageSelector(): void {
  el.language.replaceChildren(
    ...LOCALES.map(({ code, label }) => {
      const option = new Option(label, code);
      option.lang = code;
      return option;
    }),
  );
}

/** Refresca los textos que genera el código (no los marcados con `data-i18n*`). */
function refreshDynamicTexts(locale: Locale): void {
  el.language.value = locale;
  refreshThemeTitle();
  refreshPanelTitle();
  setSaveStatus(saveStatusKey);
}

/**
 * Si el editor tiene una plantilla sin editar, la muestra en el nuevo idioma;
 * si no, vuelve a dibujar para que un posible mensaje de error se re-traduzca.
 */
function refreshContentForLocale(from: Locale, to: Locale): void {
  const id = detectTemplate(el.code.value, from);
  if (id) setCode(getTemplate(id, to));
  else void draw();
}

// --- Acciones --------------------------------------------------------------

async function copyCode(): Promise<void> {
  if (!el.code.value) return;
  try {
    await navigator.clipboard.writeText(el.code.value);
    el.copy.title = t("copy.done");
    setTimeout(() => {
      el.copy.title = t("copy.title");
    }, COPY_FEEDBACK_MS);
  } catch {
    showError(t("error.copy"));
  }
}

async function downloadPng(svg: SVGElement): Promise<void> {
  try {
    await exportPng(svg, getComputedStyle(el.output).backgroundColor);
  } catch (error) {
    showError(
      t(
        error instanceof ExportError
          ? EXPORT_ERROR_KEYS[error.code]
          : "error.export.generic",
      ),
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
      if (isPlantillaId(id)) setCode(getTemplate(id, getLocale()));
    });
  }
  el.clear.addEventListener("click", () => setCode(""));

  el.language.addEventListener("change", () => {
    const next = el.language.value;
    if (!isLocale(next)) return;
    const previous = getLocale();
    setLocale(next);
    refreshContentForLocale(previous, next);
  });

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
    showError(`${t("error.window")} ${event.message || event.filename}`);
  });
  window.addEventListener("unhandledrejection", (event) => {
    const reason: unknown = event.reason;
    showError(
      `${t("error.unexpected")} ${reason instanceof Error ? reason.message : String(reason)}`,
    );
  });
}

// --- Arranque --------------------------------------------------------------

populateLanguageSelector();
onLocaleChange(refreshDynamicTexts);
setLocale(detectInitialLocale(), false);
setTheme(theme);
loadInitialCode();
bindEvents();
void draw();
