import type { User } from '../types/auth.types';
import { API_URL } from '../config/api';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

type AuthPayload = {
  accessToken?: string;
  token?: string;
  user?: User;
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  careerId: string;
};

async function sendAuthRequest<TBody>(path: string, body: TBody) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'No se pudo completar la autenticacion');
  }

  return data as AuthPayload;
}

function extractAccessToken(payload: AuthPayload): string {
  const token = payload.accessToken || payload.token;

  if (!token) {
    throw new Error('El backend no devolvio un token de acceso');
  }

  return token;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveAccessToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
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
    throw new Error('No hay token de sesion');
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

export async function establishSession(payload: AuthPayload): Promise<User | null> {
  const token = extractAccessToken(payload);
  saveAccessToken(token);

  if (payload.user) {
    saveCurrentUser(payload.user);
  }

  try {
    return await fetchCurrentUser();
  } catch {
    if (payload.user) {
      return payload.user;
    }

    return null;
  }
}

export async function loginRequest(payload: LoginPayload) {
  return sendAuthRequest('/auth/login', payload);
}

export async function registerRequest(payload: RegisterPayload) {
  return sendAuthRequest('/auth/register', payload);
}

export async function getCurrentCareerId(): Promise<string> {
  const localUser = getCurrentUser();

  const localCareerId =
    localUser?.profile?.careerId || localUser?.profile?.career?.id;

  if (localCareerId) {
    return localCareerId;
  }

  const userFromApi = await fetchCurrentUser();

  const apiCareerId =
    userFromApi.profile?.careerId || userFromApi.profile?.career?.id;

  if (!apiCareerId) {
    throw new Error('No se encontro la carrera del usuario actual');
  }

  return apiCareerId;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
