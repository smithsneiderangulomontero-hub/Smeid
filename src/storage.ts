/**
 * Acceso a localStorage tolerante a fallos (modo privado, cuota excedida,
 * almacenamiento deshabilitado por política del navegador).
 */
export const safeStorage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  /** Devuelve `true` si el valor se persistió correctamente. */
  set(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
};
