import axios from 'axios';
import { User, Post, Comment, Career } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

function mapUser(raw: any): User {
  return {
    id: String(raw.id ?? raw.userId ?? ''),
    name: raw.fullName ?? raw.name ?? '',
    email: raw.email ?? raw.user?.email ?? '',
    career: raw.career?.name ?? raw.career ?? '',
    careerId: raw.career?.id
      ? String(raw.career.id)
      : raw.careerId
        ? String(raw.careerId)
        : undefined,
    avatar: raw.avatarUrl ?? raw.avatar,
    bio: raw.bio,
  };
}

function mapPost(raw: any): Post {
  return {
    id: String(raw.id),
    author: mapUser(raw.author ?? raw.user ?? {}),
    content: raw.content ?? '',
    imageUrl: raw.mediaUrl ?? raw.imageUrl,
    createdAt: new Date(raw.createdAt),
    likes: raw.likes ?? raw.likesCount ?? 0,
    career: raw.career?.name ?? raw.career ?? '',
  };
}

function mapComment(raw: any): Comment {
  return {
    id: String(raw.id),
    postId: String(raw.postId),
    author: mapUser(raw.author ?? raw.user ?? {}),
    content: raw.content ?? '',
    createdAt: new Date(raw.createdAt),
  };
}

async function fetchFullProfile(): Promise<User> {
  const { data } = await api.get('/profiles/me');
  return mapUser(data);
}

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('authToken', data.accessToken);
    return fetchFullProfile();
  },

  register: async (
    name: string,
    email: string,
    password: string,
    careerId: string,
  ): Promise<User> => {
    const { data } = await api.post('/auth/register', {
      fullName: name,
      email,
      password,
      careerId,
    });
    localStorage.setItem('authToken', data.accessToken);
    return fetchFullProfile();
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    try {
      return await fetchFullProfile();
    } catch {
      localStorage.removeItem('authToken');
      return null;
    }
  },
};

export const careerService = {
  getCareers: async (): Promise<Career[]> => {
    const { data } = await api.get('/careers');
    return (Array.isArray(data) ? data : []).map((c: any) => ({
      id: String(c.id),
      name: c.name,
    }));
  },
};

export const postService = {
  getPosts: async (careerId?: string, page = 1, limit = 20): Promise<Post[]> => {
    const params: Record<string, any> = { page, limit };
    if (careerId) params.careerId = careerId;
    const { data } = await api.get('/posts', { params });
    const posts = Array.isArray(data) ? data : data.data ?? data.items ?? [];
    return posts.map(mapPost);
  },

  getPostsByAuthor: async (authorId: string, page = 1, limit = 20): Promise<Post[]> => {
    const { data } = await api.get('/posts', { params: { authorId, page, limit } });
    const posts = Array.isArray(data) ? data : data.data ?? data.items ?? [];
    return posts.map(mapPost);
  },

  getPost: async (id: string): Promise<Post> => {
    const { data } = await api.get(`/posts/${id}`);
    return mapPost(data);
  },

  createPost: async (content: string, careerId: string, mediaUrl?: string): Promise<Post> => {
    const body: Record<string, any> = { content, careerId };
    if (mediaUrl) body.mediaUrl = mediaUrl;
    const { data } = await api.post('/posts', body);
    return mapPost(data);
  },

  updatePost: async (id: string, content: string, mediaUrl?: string): Promise<Post> => {
    const body: Record<string, any> = { content };
    if (mediaUrl !== undefined) body.mediaUrl = mediaUrl;
    const { data } = await api.patch(`/posts/${id}`, body);
    return mapPost(data);
  },

  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },

  likePost: async (postId: string): Promise<void> => {
    await api.post(`/posts/${postId}/like`).catch(() => {});
  },
};

export const commentService = {
  getComments: async (postId: string): Promise<Comment[]> => {
    const { data } = await api.get(`/comments/post/${postId}`);
    const comments = Array.isArray(data) ? data : data.data ?? data.items ?? [];
    return comments.map(mapComment);
  },

  createComment: async (postId: string, content: string): Promise<Comment> => {
    const { data } = await api.post('/comments', { postId, content });
    return mapComment(data);
  },

  updateComment: async (id: string, content: string): Promise<Comment> => {
    const { data } = await api.patch(`/comments/${id}`, { content });
    return mapComment(data);
  },

  deleteComment: async (id: string): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },
};

export const profileService = {
  getMyProfile: async (): Promise<User> => {
    const { data } = await api.get('/profiles/me');
    return mapUser(data);
  },

  getProfile: async (userId: string): Promise<User> => {
    const { data } = await api.get(`/profiles/${userId}`);
    return mapUser(data);
  },

  updateMyProfile: async (updates: {
    fullName?: string;
    bio?: string;
    avatarUrl?: string;
    careerId?: string;
  }): Promise<User> => {
    await api.patch('/profiles/me', updates);
    return fetchFullProfile();
  },
};

export const uploadService = {
  upload: async (file: File): Promise<{ url: string; mimetype: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};

export default api;
