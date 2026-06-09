import { requestJson } from './http';
import type {
  NotificationItem,
  NotificationSummary,
} from '../types/social.types';
import { getCachedOrFetch, invalidateCache } from './cache';
import { invalidateDashboardOverviewCache } from './dashboardService';

const NOTIFICATIONS_LIST_CACHE_KEY = 'notifications:list';
const NOTIFICATIONS_SUMMARY_CACHE_KEY = 'notifications:summary';

function invalidateNotificationCaches() {
  invalidateCache(NOTIFICATIONS_LIST_CACHE_KEY);
  invalidateCache(NOTIFICATIONS_SUMMARY_CACHE_KEY);
  invalidateDashboardOverviewCache();
}

export async function getNotifications(): Promise<NotificationItem[]> {
  return getCachedOrFetch(NOTIFICATIONS_LIST_CACHE_KEY, () =>
    requestJson<NotificationItem[]>('/notifications'),
  );
}

export async function getNotificationSummary(): Promise<NotificationSummary> {
  return getCachedOrFetch(NOTIFICATIONS_SUMMARY_CACHE_KEY, () =>
    requestJson<NotificationSummary>('/notifications/summary'),
  );
}

export async function markNotificationAsRead(id: string) {
  const result = await requestJson(`/notifications/${id}/read`, {
    method: 'PATCH',
  });

  invalidateNotificationCaches();
  return result;
}

export async function markAllNotificationsAsRead() {
  const result = await requestJson('/notifications/read-all', {
    method: 'PATCH',
  });

  invalidateNotificationCaches();
  return result;
}
