import { apiGet } from '@/lib/apiClient';
import { AuthUserSchema } from '@/lib/api/schema';

export async function getCurrentUser() {
  return AuthUserSchema.parse(await apiGet('/users/me'));
}
