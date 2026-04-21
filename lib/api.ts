/**
 * Client-side fetch yardımcıları.
 * Uygulama kök yolunda servis ediliyor; ama geriye dönük uyumluluk için
 * NEXT_PUBLIC_BASE_PATH set edilirse ön ek uygulanır.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string) {
  if (!path.startsWith("/")) return path;
  if (!BASE_PATH) return path;
  if (path.startsWith(BASE_PATH + "/") || path === BASE_PATH) return path;
  return `${BASE_PATH}${path}`;
}

export function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(withBase(path), init);
}
