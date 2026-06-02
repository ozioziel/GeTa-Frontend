import { getCurrentCareerId, getCurrentUser } from './authService';
import { requestJson } from './http';
import type { Post, Comment } from '../types/post.types';

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
    localUser?.profile?.fullName || (localUser as any)?.fullName || 'Tu';

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
    author: rawComment.author || null,
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
    careerId: rawPost.careerId,
    author: rawPost.author || null,
    authorName: getAuthorName(rawPost),
    authorCareer: getCareer(rawPost),
    content: rawPost.content,
    mediaUrl: rawPost.mediaUrl || null,
    createdAt: rawPost.createdAt || new Date().toISOString(),
    updatedAt: rawPost.updatedAt || rawPost.createdAt || new Date().toISOString(),
    comments: rawComments.map(normalizeComment),
    likesCount: Number(rawPost.likesCount || 0),
    commentsCount: Number(rawPost.commentsCount || rawComments.length || 0),
    likedByCurrentUser: Boolean(rawPost.likedByCurrentUser),
    savedByCurrentUser: Boolean(rawPost.savedByCurrentUser),
    canEdit: Boolean(rawPost.canEdit),
    canDelete: Boolean(rawPost.canDelete),
  };
}

function extractArrayResponse(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.posts)) return data.posts;
  if (Array.isArray(data.items)) return data.items;
  return [];
}

export type GetPostsParams = {
  careerId?: string;
  authorId?: string;
};

export async function getPosts(params: GetPostsParams = {}): Promise<Post[]> {
  const search = new URLSearchParams();

  if (params.careerId) {
    search.set('careerId', params.careerId);
  }

  if (params.authorId) {
    search.set('authorId', params.authorId);
  }

  const data = await requestJson<any>(
    `/posts${search.toString() ? `?${search.toString()}` : ''}`,
  );
  const posts = extractArrayResponse(data);

  return posts.map(normalizePost);
}

export async function getSavedPosts(): Promise<Post[]> {
  const data = await requestJson<any>('/posts/saved/me');
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

  const data = await requestJson<any>('/posts', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const rawPost = data.data || data.post || data;

  return normalizePost(rawPost);
}

export async function likePost(postId: string): Promise<Post> {
  const data = await requestJson<any>(`/posts/${postId}/like`, {
    method: 'POST',
  });

  return normalizePost(data.post || data);
}

export async function unlikePost(postId: string): Promise<Post> {
  const data = await requestJson<any>(`/posts/${postId}/like`, {
    method: 'DELETE',
  });

  return normalizePost(data.post || data);
}

export async function savePost(postId: string): Promise<Post> {
  const data = await requestJson<any>(`/posts/${postId}/save`, {
    method: 'POST',
  });

  return normalizePost(data.post || data);
}

export async function unsavePost(postId: string): Promise<Post> {
  const data = await requestJson<any>(`/posts/${postId}/save`, {
    method: 'DELETE',
  });

  return normalizePost(data.post || data);
}

export async function deletePost(postId: string): Promise<void> {
  await requestJson(`/posts/${postId}`, {
    method: 'DELETE',
  });
}
