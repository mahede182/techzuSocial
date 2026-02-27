import { request } from './client';

export type ToggleLikeResult = { message: 'like' | 'unlike' } | { message: string };

export function toggleLike(postId: string) {
  return request<ToggleLikeResult>(
    `/api/posts/${encodeURIComponent(postId)}/like`,
    { method: 'POST' },
  );
}

