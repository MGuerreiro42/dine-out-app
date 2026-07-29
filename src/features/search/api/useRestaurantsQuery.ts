import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/apiClient';
import {
  GOOGLE_PLACES_BASE_URL,
  NearbySearchResponseSchema,
  mapPlaceToRestaurant,
  resolvePlacePhotoUrl,
} from '@/lib/googlePlaces';
import { RestaurantSchema } from '@/types';

const RestaurantsResponseSchema = z.array(RestaurantSchema);

// Matches LocationHeader's own hardcoded mock location — real geolocation
// is a separate, not-yet-built concern (see search.md's Assumptions).
// Exported for reuse as the Search & Map screen's initial map region.
export const MOCK_LOCATION = { latitude: -23.561, longitude: -46.656 };

export function useRestaurantsQuery() {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const data = await apiClient.post<unknown>(`${GOOGLE_PLACES_BASE_URL}/places:searchNearby`, {
        includedTypes: ['restaurant'],
        locationRestriction: { circle: { center: MOCK_LOCATION, radius: 5000 } },
      });
      const { places } = NearbySearchResponseSchema.parse(data);

      // Many places share the same underlying photo reference (the mock
      // pool only has 6 unique photos across 30 restaurants) — resolve each
      // unique reference once instead of once per place.
      const uniquePhotoNames = [...new Set(places.map((place) => place.photos[0].name))];
      const photoUrlEntries = await Promise.all(
        uniquePhotoNames.map(async (name) => [name, await resolvePlacePhotoUrl(name)] as const),
      );
      const photoUrlByName = new Map(photoUrlEntries);

      const restaurants = places.map((place) => {
        const photoUrl = photoUrlByName.get(place.photos[0].name);
        if (!photoUrl) {
          throw new Error(`No resolved photo URL for "${place.photos[0].name}"`);
        }
        return mapPlaceToRestaurant(place, photoUrl);
      });

      return RestaurantsResponseSchema.parse(restaurants);
    },
  });
}
