import { fetchCurrentUser, getToken, saveCurrentUser } from './authService';
import { requestJson } from './http';
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
  await requestJson('/profiles/me', {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const currentUser = await fetchCurrentUser();
  saveCurrentUser(currentUser);
  return currentUser;
}

export async function getProfileByUserId(userId: string) {
  return requestJson<any>(`/profiles/${userId}`);
}
