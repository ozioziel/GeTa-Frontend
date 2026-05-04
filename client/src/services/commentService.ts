import { getCurrentUser, getToken } from './authService';
import type { Comment } from '../types/post.types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

function getAuthHeaders(): Record<string, string> {
  const token = getToken();

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getCommentAuthorName(rawComment: any): string {
  const localUser = getCurrentUser();

  const localFullName =
    localUser?.profile?.fullName ||
    (localUser as any)?.fullName ||
    'Tú';

  const commentAuthorId =
    rawComment.authorId ||
    rawComment.userId ||
    rawComment.author?.id ||
    rawComment.user?.id;

  const isMine =
    commentAuthorId &&
    localUser?.id &&
    commentAuthorId === localUser.id;

  return (
    rawComment.author?.profile?.fullName ||
    rawComment.author?.fullName ||
    rawComment.user?.profile?.fullName ||
    rawComment.user?.fullName ||
    rawComment.profile?.fullName ||
    rawComment.fullName ||
    rawComment.authorName ||
    (isMine ? localFullName : 'Usuario GeTa')
  );
}

function normalizeComment(rawComment: any): Comment {
  return {
    id: rawComment.id,
    postId: rawComment.postId,
    authorId: rawComment.authorId,
    authorName: getCommentAuthorName(rawComment),
    content: rawComment.content,
    createdAt: rawComment.createdAt || new Date().toISOString(),
  };
}

function extractArrayResponse(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.comments)) return data.comments;
  if (Array.isArray(data.items)) return data.items;
  return [];
}

export async function getCommentsByPost(postId: string): Promise<Comment[]> {
  const response = await fetch(`${API_URL}/comments/post/${postId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'No se pudieron cargar los comentarios');
  }

  const comments = extractArrayResponse(data);

  return comments.map(normalizeComment);
}

export async function createComment(
  postId: string,
  content: string,
): Promise<Comment> {
  const response = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      postId,
      content,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'No se pudo crear el comentario');
  }

  const rawComment = data.data || data.comment || data;

  return normalizeComment(rawComment);
}