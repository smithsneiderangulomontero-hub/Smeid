import type { es } from "./locales/es";

export type MessageKey = keyof typeof es;
export type Messages = Record<MessageKey, string>;
