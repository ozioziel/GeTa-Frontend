import {
  fetchCurrentUser,
  getCurrentUser,
  getToken,
  saveCurrentUser,
} from './authService';
import { requestJson } from './http';
import type { User } from '../types/auth.types';
import { getCachedOrFetch, invalidateCacheByPrefix } from './cache';
import { invalidateDashboardOverviewCache } from './dashboardService';
import { invalidateAllFollowCaches } from './followService';

const PROFILE_PUBLIC_PREFIX = 'profiles:public:';
const SEARCH_RESULTS_PREFIX = 'search:results:';

function buildPublicProfileCacheKey(userId: string) {
  return `${PROFILE_PUBLIC_PREFIX}${userId}`;
}

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
  return getCurrentUser() || fetchCurrentUser();
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

  invalidateDashboardOverviewCache();
  invalidateAllFollowCaches();
  invalidateCacheByPrefix(SEARCH_RESULTS_PREFIX);
  invalidateCacheByPrefix('posts:list:');
  invalidateCacheByPrefix('posts:single:');
  invalidateCacheByPrefix(PROFILE_PUBLIC_PREFIX);
  invalidateCacheByPrefix('notifications:');
  invalidateCacheByPrefix('messages:');

  return currentUser;
}

export async function getProfileByUserId(userId: string) {
  return getCachedOrFetch(buildPublicProfileCacheKey(userId), () =>
    requestJson<any>(`/profiles/${userId}`),
  );
}
