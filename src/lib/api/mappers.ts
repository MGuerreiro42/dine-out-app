import type { RestaurantSummary } from '@/lib/api/schema';
import type { Restaurant } from '@/types';

export function mapSummaryToRestaurant(summary: RestaurantSummary): Restaurant {
  return {
    id: summary.id,
    name: summary.displayName,
    photo: summary.photoUrl,
    rating: null,
    priceLevel: null,
    cuisine: summary.cuisineId,
    occasion: summary.occasion,
    ambient: summary.ambient,
    latitude: summary.latitude,
    longitude: summary.longitude,
    reviewCount: null,
  };
}
