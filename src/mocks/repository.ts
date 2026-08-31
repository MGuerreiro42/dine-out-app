import { apiDelete, apiGet, ApiError, apiPost, apiPut } from '@/lib/apiClient';
import { AuthResponseSchema, AuthTokensSchema, ReviewSchema } from '@/lib/api';
import type { RestaurantDetail, RestaurantSummary } from '@/lib/api';
import type { DiscoveryTaxonomies } from '@/features/search/types';
import { useLocationStore } from '@/stores/location';

const NEARBY_LIMIT = 50;

export async function getNearbyPlaces(params?: {
  query?: string;
  cuisine?: string;
  occasion?: string;
  category?: string;
  limit?: number;
}): Promise<RestaurantSummary[]> {
  const { latitude, longitude, radiusKm } = useLocationStore.getState();
  return apiGet<RestaurantSummary[]>('/restaurants', {
    lat: latitude,
    lng: longitude,
    radiusKm,
    q: params?.query,
    cuisine: params?.cuisine,
    occasion: params?.occasion,
    category: params?.category,
    limit: params?.limit ?? NEARBY_LIMIT,
  });
}

export async function getPlaceDetails(id: string): Promise<RestaurantDetail | null> {
  try {
    return await apiGet<RestaurantDetail>(`/restaurants/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getDiscoveryTaxonomies(): Promise<DiscoveryTaxonomies> {
  return apiGet<DiscoveryTaxonomies>('/taxonomies');
}

export async function getCurrentUser() {
  const user = await apiGet<{ id: number; name: string; email: string }>('/users/me');
  return { ...user, initial: user.name.charAt(0).toUpperCase() };
}

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

export async function getFavoriteIds(): Promise<number[]> {
  return apiGet<number[]>('/favorites');
}

export async function addFavorite(id: number): Promise<void> {
  await apiPut(`/favorites/${id}`);
}

export async function removeFavorite(id: number): Promise<void> {
  await apiDelete(`/favorites/${id}`);
}

export async function submitReview(restaurantId: number, payload: { rating: number; text: string }) {
  const data = await apiPost(`/restaurants/${restaurantId}/reviews`, payload);
  return ReviewSchema.parse(data);
}
