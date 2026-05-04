import { getToken, saveCurrentUser } from './authService';
import type { User } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

function getAuthHeaders(): Record<string, string> {
  const token = getToken();

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export type UpdateProfilePayload = {
  fullName: string;
  bio?: string;
  avatarUrl?: string;
};

export async function getMyProfile(): Promise<User> {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'No se pudo cargar el perfil');
  }

  saveCurrentUser(data);

  return data;
}

export async function updateMyProfile(
  payload: UpdateProfilePayload,
): Promise<User> {
  const response = await fetch(`${API_URL}/profiles/me`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        'No se pudo actualizar el perfil. Verifica que exista PATCH /profiles/me en el backend.',
    );
  }

  saveCurrentUser(data);

  return data;
}