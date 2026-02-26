import { request } from './client';

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
}

export function login(body: LoginPayload) {
  return request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body,
  });
}

export function register(body: RegisterPayload) {
  return request<RegisterResponse>('/api/auth/register', {
    method: 'POST',
    body,
  });
}