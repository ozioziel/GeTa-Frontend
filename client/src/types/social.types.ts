import type { Career } from './career.types';
import type { Post } from './post.types';
import type { User } from './auth.types';

export type DashboardUser = User & {
  isFollowing?: boolean;
};

export type NotificationItem = {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'message' | 'system';
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
  actor?: User | null;
};

export type NotificationSummary = {
  unreadCount: number;
};

export type MessageItem = {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  senderId: string;
  recipientId: string;
  sender?: User | null;
  recipient?: User | null;
};

export type ConversationSummary = {
  user: User | null;
  lastMessage: MessageItem;
  unreadCount: number;
};

export type ConversationDetail = {
  user: User | null;
  messages: MessageItem[];
};

export type SearchResults = {
  query: string;
  users: DashboardUser[];
  careers: Career[];
  posts: Post[];
};
