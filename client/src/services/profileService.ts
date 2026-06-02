import { fetchCurrentUser, getToken, saveCurrentUser } from './authService';
import { API_URL } from '../config/api';
import type { User } from '../types/auth.types';

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
  return fetchCurrentUser();
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

  const currentUser = await fetchCurrentUser();
  saveCurrentUser(currentUser);
  return currentUser;
}
