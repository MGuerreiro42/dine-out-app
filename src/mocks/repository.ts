import { apiGet, ApiError } from '@/lib/apiClient';
import type { RestaurantDetail, RestaurantSummary } from '@/lib/api';
import type { DiscoveryTaxonomies } from '@/features/search/types';
import { CURRENT_USER } from '@/mocks/currentUser';
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
  return CURRENT_USER;
}
