import { request } from './client';
import type { Post } from '@/@types/post';
import type { CreatePostPayload, GetPostsParams } from '@/@types/api';

function toQuery(params: Record<string, string | number | undefined>) {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  }
  return parts.length ? `?${parts.join('&')}` : '';
}

export function createPost(body: CreatePostPayload) {
  return request<Post>('/api/posts', { method: 'POST', body });
}

export function getPosts(params: GetPostsParams = {}) {
  const query = toQuery({ page: params.page, limit: params.limit });
  return request<Post[]>(`/api/posts${query}`, { method: 'GET' });
}

export function getMyPosts(params: GetPostsParams = {}) {
  const query = toQuery({ page: params.page, limit: params.limit });
  return request<Post[]>(`/api/posts/me${query}`, { method: 'GET' });
}

