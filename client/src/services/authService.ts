import type { User } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export function getCurrentUser(): User | null {
  const userData = localStorage.getItem(USER_KEY);

  if (!userData) {
    return null;
  }

  try {
    return JSON.parse(userData) as User;
  } catch {
    return null;
  }
}

export function saveCurrentUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function fetchCurrentUser(): Promise<User> {
  const token = getToken();

  if (!token) {
    throw new Error('No hay token de sesión');
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'No se pudo obtener el usuario actual');
  }

  saveCurrentUser(data);

  return data;
}

export async function getCurrentCareerId(): Promise<string> {
  const localUser = getCurrentUser();

  const localCareerId =
    localUser?.profile?.careerId ||
    localUser?.profile?.career?.id;

  if (localCareerId) {
    return localCareerId;
  }

  const userFromApi = await fetchCurrentUser();

  const apiCareerId =
    userFromApi.profile?.careerId ||
    userFromApi.profile?.career?.id;

  if (!apiCareerId) {
    throw new Error('No se encontró la carrera del usuario actual');
  }

  return apiCareerId;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}