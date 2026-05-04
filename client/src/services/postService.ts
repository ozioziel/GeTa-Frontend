import { getCurrentCareerId, getCurrentUser, getToken } from './authService';
import type { Post, Comment } from '../types/post.types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

function getAuthHeaders(): Record<string, string> {
  const token = getToken();

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getLocalUserFullName(rawPost?: any): string | null {
  const user = getCurrentUser();

  if (!user) return null;

  const localFullName = user.profile?.fullName || (user as any).fullName || null;

  const postAuthorId =
    rawPost?.authorId ||
    rawPost?.userId ||
    rawPost?.author?.id ||
    rawPost?.user?.id;

  if (!postAuthorId) {
    return localFullName;
  }

  if (postAuthorId === user.id) {
    return localFullName;
  }

  return null;
}

function getAuthorName(rawPost: any): string {
  return (
    rawPost.author?.profile?.fullName ||
    rawPost.author?.fullName ||
    rawPost.user?.profile?.fullName ||
    rawPost.user?.fullName ||
    rawPost.profile?.fullName ||
    rawPost.fullName ||
    rawPost.authorName ||
    getLocalUserFullName(rawPost) ||
    'Usuario GeTa'
  );
}

function getCareer(rawPost: any) {
  return (
    rawPost.career ||
    rawPost.author?.profile?.career ||
    rawPost.profile?.career ||
    rawPost.user?.profile?.career ||
    getCurrentUser()?.profile?.career ||
    undefined
  );
}

function normalizeComment(rawComment: any): Comment {
  const localUser = getCurrentUser();

  const localFullName =
    localUser?.profile?.fullName || (localUser as any)?.fullName || 'Tú';

  const commentAuthorId =
    rawComment.authorId ||
    rawComment.userId ||
    rawComment.author?.id ||
    rawComment.user?.id;

  const isMine =
    commentAuthorId && localUser?.id && commentAuthorId === localUser.id;

  return {
    id: rawComment.id,
    postId: rawComment.postId,
    authorId: rawComment.authorId,
    authorName:
      rawComment.author?.profile?.fullName ||
      rawComment.author?.fullName ||
      rawComment.user?.profile?.fullName ||
      rawComment.user?.fullName ||
      rawComment.profile?.fullName ||
      rawComment.fullName ||
      rawComment.authorName ||
      (isMine ? localFullName : 'Usuario GeTa'),
    content: rawComment.content,
    createdAt: rawComment.createdAt || new Date().toISOString(),
  };
}

export function normalizePost(rawPost: any): Post {
  const rawComments = Array.isArray(rawPost.comments)
    ? rawPost.comments
    : Array.isArray(rawPost.Comments)
      ? rawPost.Comments
      : [];

  return {
    id: rawPost.id,
    authorId: rawPost.authorId || rawPost.userId,
    authorName: getAuthorName(rawPost),
    authorCareer: getCareer(rawPost),
    content: rawPost.content,
    mediaUrl: rawPost.mediaUrl || null,
    createdAt: rawPost.createdAt || new Date().toISOString(),
    comments: rawComments.map(normalizeComment),
  };
}

function extractArrayResponse(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.posts)) return data.posts;
  if (Array.isArray(data.items)) return data.items;
  return [];
}

export async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'No se pudieron cargar las publicaciones');
  }

  const posts = extractArrayResponse(data);

  return posts.map(normalizePost);
}

export async function createPost(
  content: string,
  mediaUrl?: string,
): Promise<Post> {
  const careerId = await getCurrentCareerId();

  const body = {
    content,
    careerId,
    ...(mediaUrl ? { mediaUrl } : {}),
  };

  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'No se pudo crear la publicación');
  }

  const rawPost = data.data || data.post || data;

  return normalizePost(rawPost);
}