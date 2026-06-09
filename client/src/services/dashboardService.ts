import { requestJson } from './http';
import type { DashboardOverview } from '../types/dashboard.types';
import { getCachedOrFetch, invalidateCache } from './cache';

const DASHBOARD_OVERVIEW_CACHE_KEY = 'dashboard:overview';

export async function getDashboardOverview(): Promise<DashboardOverview> {
  return getCachedOrFetch(DASHBOARD_OVERVIEW_CACHE_KEY, () =>
    requestJson<DashboardOverview>('/dashboard/overview'),
  );
}

export function invalidateDashboardOverviewCache() {
  invalidateCache(DASHBOARD_OVERVIEW_CACHE_KEY);
}
