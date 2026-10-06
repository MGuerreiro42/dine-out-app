import { ApiError, apiGet } from '@/lib/apiClient';
import type { RestaurantDetail, RestaurantSummary } from '@/lib/api/schema';

const NEARBY_LIMIT = 50;

export type NearbyRestaurantsParams = {
  latitude: number;
  longitude: number;
  radiusKm: number;
  query?: string;
  cuisine?: string;
  occasion?: string;
  category?: string;
  limit?: number;
};

export async function getNearbyRestaurants(params: NearbyRestaurantsParams): Promise<RestaurantSummary[]> {
  return apiGet<RestaurantSummary[]>('/restaurants', {
    lat: params.latitude,
    lng: params.longitude,
    radiusKm: params.radiusKm,
    q: params.query,
    cuisine: params.cuisine,
    occasion: params.occasion,
    category: params.category,
    limit: params.limit ?? NEARBY_LIMIT,
  });
}

export async function getRestaurant(id: number): Promise<RestaurantDetail | null> {
  try {
    return await apiGet<RestaurantDetail>(`/restaurants/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
