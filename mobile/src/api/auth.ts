import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from '@/@types/api';
import { request } from './client';
import type { User } from '@/@types/auth';

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

export function getMe() {
  return request<User>('/api/auth/me', { method: 'GET' });
}

export function saveFcmToken(fcmToken: string) {
  return request<{ message: string }>('/api/auth/token', {
    method: 'PUT',
    body: { fcmToken },
  });
}

export function removeFcmToken(fcmToken: string) {
  return request<{ message: string }>('/api/auth/token', {
    method: 'DELETE',
    body: { fcmToken },
  });
}