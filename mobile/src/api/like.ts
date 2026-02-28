import { request } from './client';
import type { ToggleLikeResult } from '@/@types/api';

export function toggleLike(postId: string) {
  return request<ToggleLikeResult>(
    `/api/posts/${encodeURIComponent(postId)}/like`,
    { method: 'POST' },
  );
}

