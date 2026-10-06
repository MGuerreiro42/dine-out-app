import { apiPost } from '@/lib/apiClient';
import { AuthResponseSchema, AuthTokensSchema } from '@/lib/api/schema';

export async function signup(payload: { name: string; email: string; password: string }) {
  const data = await apiPost('/auth/signup', payload);
  return AuthResponseSchema.parse(data);
}

export async function login(payload: { email: string; password: string }) {
  const data = await apiPost('/auth/login', payload);
  return AuthResponseSchema.parse(data);
}

export async function refreshSession(refreshToken: string) {
  const data = await apiPost('/auth/refresh', { refreshToken });
  return AuthTokensSchema.parse(data);
}

export async function logoutSession(refreshToken: string): Promise<void> {
  await apiPost('/auth/logout', { refreshToken });
}
