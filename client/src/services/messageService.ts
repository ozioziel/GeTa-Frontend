import { requestJson } from './http';
import type {
  ConversationDetail,
  ConversationSummary,
  NotificationSummary,
} from '../types/social.types';

export async function getMessageSummary(): Promise<NotificationSummary> {
  return requestJson<NotificationSummary>('/messages/summary');
}

export async function getConversations(): Promise<ConversationSummary[]> {
  return requestJson<ConversationSummary[]>('/messages/conversations');
}

export async function getConversation(userId: string): Promise<ConversationDetail> {
  return requestJson<ConversationDetail>(`/messages/with/${userId}`);
}

export async function sendMessage(recipientId: string, content: string) {
  return requestJson('/messages', {
    method: 'POST',
    body: JSON.stringify({ recipientId, content }),
  });
}
