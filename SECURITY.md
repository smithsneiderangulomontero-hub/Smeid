# Política de seguridad

## Versiones con soporte

Solo se mantiene la última versión publicada en la rama `main`.

## Cómo reportar una vulnerabilidad

**No abras un issue público.** Usa el reporte privado de GitHub:

<https://github.com/smithsneiderangulomontero-hub/Smeid/security/advisories/new>

Incluye, si puedes:

- Descripción del problema e impacto.
- Pasos para reproducirlo (idealmente con un diagrama de ejemplo).
- Navegador y versión afectados.

Es un proyecto mantenido de forma voluntaria: intentaremos responder en unos días y corregir cuanto antes los problemas confirmados. Te daremos crédito en la corrección si lo deseas.

## Alcance

SMEID se ejecuta íntegramente en el navegador y no envía datos a ningún servidor. Los puntos más sensibles son:

- Renderizado de diagramas de origen no confiable (Mermaid con `securityLevel: "strict"`).
- Inserción del SVG generado en el DOM.
- La Content-Security-Policy del build (`vite.config.ts`).

Las vulnerabilidades en dependencias de terceros deben reportarse también a sus mantenedores.
