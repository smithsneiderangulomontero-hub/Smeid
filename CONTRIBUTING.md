# Contribuir a SMEID

¡Gracias por tu interés! SMEID es software libre y sin fines de lucro; toda ayuda es bienvenida: errores, ideas, documentación, traducciones y código.

## Preparar el entorno

Requisitos: Node.js >= 20.

```bash
git clone https://github.com/smithsneiderangulomontero-hub/Smeid.git
cd Smeid
npm install
npm run dev
```

> No abras `index.html` con doble clic: necesita pasar por Vite.

## Flujo de trabajo

1. Abre un issue para cambios grandes antes de empezar, así evitamos trabajo duplicado.
2. Crea una rama desde `main` (`feature/...` o `fix/...`).
3. Haz cambios pequeños y enfocados.
4. Comprueba que todo pasa en local:

   ```bash
   npm run ci   # lint + tipos + tests + build
   ```

5. Abre un Pull Request y rellena la plantilla.

## Convenciones

- **Formato y lint**: [Biome](https://biomejs.dev/). Usa `npm run lint:fix` para corregir automáticamente.
- **Commits**: mensajes claros, preferiblemente con [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`...).
- **Tests**: la lógica pura va en módulos sin DOM y con test (`*.test.ts` junto al módulo).
- **Seguridad**: no uses `innerHTML` con contenido que no provenga de `mermaid.render`. Los mensajes de error se muestran con `textContent`.
- **CSP**: no añadas scripts externos ni `eval`; el build aplica una política estricta.

## Dependencias y licencias

Solo se aceptan dependencias con licencia permisiva compatible con MIT (MIT, ISC, BSD, Apache-2.0). Si añades o cambias dependencias de producción, ejecuta `npm run licenses` y confirma el cambio de `THIRD_PARTY_LICENSES.md`.

## Qué no incluir

- Código copiado de fuentes con licencia incompatible o sin licencia.
- Secretos, claves, datos personales o información confidencial de empresas o clientes (en código, plantillas, ejemplos o capturas).

## Licencia de las contribuciones

Al enviar un cambio aceptas que se publique bajo la [licencia MIT](./LICENSE) del proyecto.

Al participar aceptas respetar el [Código de Conducta](./CODE_OF_CONDUCT.md).
