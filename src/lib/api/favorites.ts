import { apiDelete, apiGet, apiPut } from '@/lib/apiClient';

export async function getFavoriteIds(): Promise<number[]> {
  return apiGet<number[]>('/favorites');
}

export async function addFavorite(id: number): Promise<void> {
  await apiPut(`/favorites/${id}`);
}

export async function removeFavorite(id: number): Promise<void> {
  await apiDelete(`/favorites/${id}`);
}
