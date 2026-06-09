import { requestJson } from './http';
import type {
  ConversationDetail,
  ConversationSummary,
  NotificationSummary,
} from '../types/social.types';
import { getCachedOrFetch, invalidateCache, invalidateCacheByPrefix } from './cache';
import { invalidateDashboardOverviewCache } from './dashboardService';

const MESSAGES_SUMMARY_CACHE_KEY = 'messages:summary';
const MESSAGES_CONVERSATIONS_CACHE_KEY = 'messages:conversations';
const MESSAGES_CONVERSATION_PREFIX = 'messages:conversation:';

function buildConversationCacheKey(userId: string) {
  return `${MESSAGES_CONVERSATION_PREFIX}${userId}`;
}

function invalidateMessageCaches(userId?: string) {
  invalidateCache(MESSAGES_SUMMARY_CACHE_KEY);
  invalidateCache(MESSAGES_CONVERSATIONS_CACHE_KEY);

  if (userId) {
    invalidateCache(buildConversationCacheKey(userId));
  } else {
    invalidateCacheByPrefix(MESSAGES_CONVERSATION_PREFIX);
  }

  invalidateDashboardOverviewCache();
}

export async function getMessageSummary(): Promise<NotificationSummary> {
  return getCachedOrFetch(MESSAGES_SUMMARY_CACHE_KEY, () =>
    requestJson<NotificationSummary>('/messages/summary'),
  );
}

export async function getConversations(): Promise<ConversationSummary[]> {
  return getCachedOrFetch(MESSAGES_CONVERSATIONS_CACHE_KEY, () =>
    requestJson<ConversationSummary[]>('/messages/conversations'),
  );
}

export async function getConversation(userId: string): Promise<ConversationDetail> {
  return getCachedOrFetch(buildConversationCacheKey(userId), () =>
    requestJson<ConversationDetail>(`/messages/with/${userId}`),
  );
}

export async function sendMessage(recipientId: string, content: string) {
  const result = await requestJson('/messages', {
    method: 'POST',
    body: JSON.stringify({ recipientId, content }),
  });

  invalidateMessageCaches(recipientId);
  return result;
}
