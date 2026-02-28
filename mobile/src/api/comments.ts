import { AddCommentPayload } from '@/@types/api';
import { request } from './client';
import type { Comment } from '@/@types/post';

export function addComment(postId: string, body: AddCommentPayload) {
  return request<Comment>(`/api/posts/${encodeURIComponent(postId)}/comments`, {
    method: 'POST',
    body,
  });
}

export function getComments(postId: string) {
  return request<Comment[]>(
    `/api/posts/${encodeURIComponent(postId)}/comments`,
    { method: 'GET' },
  );
}

