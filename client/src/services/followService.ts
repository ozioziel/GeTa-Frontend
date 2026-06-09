import { requestJson } from './http';
import type { DashboardUser } from '../types/social.types';
import { getCachedOrFetch, invalidateCache, invalidateCacheByPrefix } from './cache';
import { invalidateDashboardOverviewCache } from './dashboardService';

const FOLLOW_SUGGESTIONS_CACHE_KEY = 'follows:suggestions';
const FOLLOW_NETWORK_CACHE_KEY = 'follows:me';
const FOLLOW_STATS_PREFIX = 'follows:stats:';
const SEARCH_RESULTS_PREFIX = 'search:results:';

export type FollowStats = {
  followers: number;
  following: number;
};

function buildFollowStatsCacheKey(userId: string) {
  return `${FOLLOW_STATS_PREFIX}${userId}`;
}

function invalidateFollowCaches(userId?: string) {
  invalidateCache(FOLLOW_SUGGESTIONS_CACHE_KEY);
  invalidateCache(FOLLOW_NETWORK_CACHE_KEY);

  if (userId) {
    invalidateCache(buildFollowStatsCacheKey(userId));
  }

  invalidateCacheByPrefix(SEARCH_RESULTS_PREFIX);
  invalidateDashboardOverviewCache();
}

export async function getFollowSuggestions(): Promise<DashboardUser[]> {
  return getCachedOrFetch(FOLLOW_SUGGESTIONS_CACHE_KEY, () =>
    requestJson<DashboardUser[]>('/follows/suggestions'),
  );
}

export async function getMyFollowNetwork(): Promise<{
  followers: DashboardUser[];
  following: DashboardUser[];
  counts: FollowStats;
}> {
  return getCachedOrFetch(FOLLOW_NETWORK_CACHE_KEY, () => requestJson('/follows/me'));
}

export async function followUser(
  userId: string,
): Promise<{ isFollowing: boolean }> {
  const result = await requestJson<{ isFollowing: boolean }>(`/follows/${userId}`, {
    method: 'POST',
  });

  invalidateFollowCaches(userId);
  return result;
}

export async function unfollowUser(
  userId: string,
): Promise<{ isFollowing: boolean }> {
  const result = await requestJson<{ isFollowing: boolean }>(`/follows/${userId}`, {
    method: 'DELETE',
  });

  invalidateFollowCaches(userId);
  return result;
}

export async function getFollowStats(userId: string): Promise<FollowStats> {
  return getCachedOrFetch(buildFollowStatsCacheKey(userId), () =>
    requestJson<FollowStats>(`/follows/stats/${userId}`),
  );
}

export function invalidateAllFollowCaches() {
  invalidateCacheByPrefix(FOLLOW_STATS_PREFIX);
  invalidateFollowCaches();
}
