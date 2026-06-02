import { requestJson } from './http';
import type { DashboardUser } from '../types/social.types';

export type FollowStats = {
  followers: number;
  following: number;
};

export async function getFollowSuggestions(): Promise<DashboardUser[]> {
  return requestJson<DashboardUser[]>('/follows/suggestions');
}

export async function getMyFollowNetwork(): Promise<{
  followers: DashboardUser[];
  following: DashboardUser[];
  counts: FollowStats;
}> {
  return requestJson('/follows/me');
}

export async function followUser(userId: string): Promise<{ isFollowing: boolean }> {
  return requestJson(`/follows/${userId}`, {
    method: 'POST',
  });
}

export async function unfollowUser(userId: string): Promise<{ isFollowing: boolean }> {
  return requestJson(`/follows/${userId}`, {
    method: 'DELETE',
  });
}

export async function getFollowStats(userId: string): Promise<FollowStats> {
  return requestJson<FollowStats>(`/follows/stats/${userId}`);
}
