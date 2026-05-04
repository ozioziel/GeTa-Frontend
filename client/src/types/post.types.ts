import type { Career } from './career.types';

export type Comment = {
  id: string;
  postId?: string;
  authorId?: string;
  authorName: string;
  content: string;
  createdAt: string;
};

export type Post = {
  id: string;
  authorId?: string;
  authorName: string;
  authorCareer?: Career;
  content: string;
  mediaUrl?: string | null;
  createdAt: string;
  comments: Comment[];
};