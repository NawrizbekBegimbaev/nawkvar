import client from './client';

interface AuthResponse {
  access: string;
  refresh: string;
}

export const register = (phone: string, password: string, name?: string, telegram?: string) =>
  client.post<AuthResponse>('/auth/register/', { phone, password, name, telegram });

export const login = (phone: string, password: string) =>
  client.post<AuthResponse>('/auth/login/', { phone, password });
