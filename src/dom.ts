type ElementConstructor<T extends Element> = abstract new (
  ...args: never[]
) => T;

/**
 * Obtiene un elemento por id verificando su tipo en tiempo de ejecución.
 * Falla de forma explícita si el HTML y el código se desincronizan, en lugar
 * de propagar un `null` disfrazado con `as`.
 */
export function requireElement<T extends Element>(
  id: string,
  type: ElementConstructor<T>,
): T {
  const element = document.getElementById(id);
  if (!(element instanceof type)) {
    throw new Error(`Elemento #${id} no encontrado o de tipo inesperado.`);
  }
  return element;
}
