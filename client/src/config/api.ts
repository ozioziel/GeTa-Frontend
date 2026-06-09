export const API_URL =
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:3000/api";

export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export function resolveApiAssetUrl(url?: string | null): string | null {
  const cleanUrl = url?.trim();

  if (!cleanUrl) {
    return null;
  }

  if (/\/uploads\/?$/i.test(cleanUrl)) {
    return null;
  }

  if (/^https?:\/\//i.test(cleanUrl)) {
    return cleanUrl;
  }

  if (cleanUrl.startsWith("/")) {
    return `${API_ORIGIN}${cleanUrl}`;
  }

  return cleanUrl;
}
