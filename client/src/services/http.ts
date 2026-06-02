import { API_URL } from '../config/api';
import { getToken, logout } from './authService';

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export async function requestJson<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const token = auth ? getToken() : null;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      ...(rest.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    logout();
  }

  if (!response.ok) {
    throw new Error(data.message || 'La solicitud al servidor fallo');
  }

  return data as T;
}
