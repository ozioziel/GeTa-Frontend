import { API_URL } from "../config/api";
import { getToken, logout } from "./authService";

type UploadMediaResponse = {
  mediaUrl: string;
  path: string;
};

export async function uploadMedia(file: File): Promise<string> {
  const token = getToken();
  const body = new FormData();
  body.append("file", file);

  const response = await fetch(`${API_URL}/uploads/media`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    logout();
  }

  if (!response.ok) {
    throw new Error(data.message || "No se pudo subir el archivo.");
  }

  const mediaUrl = (data as UploadMediaResponse).mediaUrl;

  if (!mediaUrl || /\/uploads\/?$/i.test(mediaUrl)) {
    throw new Error("El servidor no devolvio una URL valida para el archivo.");
  }

  return mediaUrl;
}
