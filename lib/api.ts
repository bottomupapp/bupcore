/**
 * Client-side fetch yardımcıları. basePath "/product" olduğundan
 * raw fetch("/api/...") çağrıları YANLIŞ sonuç verir; bu sargı
 * otomatik olarak basePath önekini ekler.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/product";

export function withBase(path: string) {
  if (!path.startsWith("/")) return path;
  if (BASE_PATH && path.startsWith(BASE_PATH + "/")) return path;
  return `${BASE_PATH}${path}`;
}

export function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(withBase(path), init);
}
