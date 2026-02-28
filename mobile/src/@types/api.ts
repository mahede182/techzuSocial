import { HttpMethod } from "../constants/api";

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface RegisterResponse {
  message: string;
  token: string;
}

export interface AddCommentPayload {
  text: string;
}

export interface CreatePostPayload {
  text: string;
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
}

export type ToggleLikeResult = { message: 'like' | 'unlike' } | { message: string };