import { requestJson } from './http';
import type {
  NotificationItem,
  NotificationSummary,
} from '../types/social.types';

export async function getNotifications(): Promise<NotificationItem[]> {
  return requestJson<NotificationItem[]>('/notifications');
}

export async function getNotificationSummary(): Promise<NotificationSummary> {
  return requestJson<NotificationSummary>('/notifications/summary');
}

export async function markNotificationAsRead(id: string) {
  return requestJson(`/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

export async function markAllNotificationsAsRead() {
  return requestJson('/notifications/read-all', {
    method: 'PATCH',
  });
}
