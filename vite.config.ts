import { existsSync, readFileSync } from "node:fs";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

/**
 * Política de seguridad de contenido para producción.
 *
 * - Sin `script-src` externos: Mermaid se empaqueta, ya no viene de un CDN.
 * - `style-src 'unsafe-inline'` es necesario porque Mermaid genera SVG con
 *   estilos en línea.
 * - Solo se inyecta en build: en desarrollo Vite necesita WebSocket para HMR.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ");

function contentSecurityPolicy(): Plugin {
  return {
    name: "smeid:csp",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler: () => [
        {
          tag: "meta",
          attrs: { "http-equiv": "Content-Security-Policy", content: CSP },
          injectTo: "head-prepend",
        },
      ],
    },
  };
}

/**
 * Incluye en `dist/` la licencia del proyecto y los avisos de terceros: las
 * licencias MIT/BSD/Apache exigen conservarlos al redistribuir el código.
 * THIRD_PARTY_LICENSES.md se regenera con `npm run licenses`.
 */
function licenseFiles(): Plugin {
  const files = ["LICENSE", "THIRD_PARTY_LICENSES.md"];
  return {
    name: "smeid:licenses",
    apply: "build",
    generateBundle() {
      for (const fileName of files) {
        if (!existsSync(fileName)) {
          this.error(
            `Falta ${fileName}; no se puede generar un build distribuible.`,
          );
        }
        this.emitFile({
          type: "asset",
          fileName,
          source: readFileSync(fileName),
        });
      }
    },
  };
}

export default defineConfig({
  plugins: [contentSecurityPolicy(), licenseFiles()],
  build: {
    target: "es2022",
    // Mermaid carga cada tipo de diagrama en chunks aparte (lazy); algunos son grandes.
    chunkSizeWarningLimit: 1000,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
