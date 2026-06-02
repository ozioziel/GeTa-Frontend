import { requestJson } from './http';
import type { SearchResults } from '../types/social.types';
import { normalizePost } from './postService';

export async function searchAll(query: string): Promise<SearchResults> {
  const search = new URLSearchParams();

  if (query.trim()) {
    search.set('q', query.trim());
  }

  const data = await requestJson<any>(
    `/search${search.toString() ? `?${search.toString()}` : ''}`,
  );

  return {
    query: data.query || '',
    users: Array.isArray(data.users) ? data.users : [],
    careers: Array.isArray(data.careers) ? data.careers : [],
    posts: Array.isArray(data.posts) ? data.posts.map(normalizePost) : [],
  };
}
