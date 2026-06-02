import type { Career } from './career.types';
import type { User } from './auth.types';

export type Comment = {
  id: string;
  postId?: string;
  authorId?: string;
  authorName: string;
  content: string;
  createdAt: string;
  author?: User | null;
};

export type Post = {
  id: string;
  authorId?: string;
  careerId?: string;
  authorName: string;
  author?: User | null;
  authorCareer?: Career;
  content: string;
  mediaUrl?: string | null;
  createdAt: string;
  updatedAt?: string;
  comments: Comment[];
  likesCount: number;
  commentsCount: number;
  likedByCurrentUser: boolean;
  savedByCurrentUser: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
};
