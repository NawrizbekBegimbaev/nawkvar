import client from './client';

interface AuthResponse {
  access: string;
  refresh: string;
}

export const sendOtp = (telegram: string) =>
  client.post('/auth/send-otp/', { telegram });

export const register = (phone: string, password: string, name: string, telegram: string, otp_code: string) =>
  client.post<AuthResponse>('/auth/register/', { phone, password, name, telegram, otp_code });

export const login = (phone: string, password: string) =>
  client.post<AuthResponse>('/auth/login/', { phone, password });
