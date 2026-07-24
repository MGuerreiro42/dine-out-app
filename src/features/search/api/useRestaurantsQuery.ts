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
const MOCK_LOCATION = { latitude: -23.561, longitude: -46.656 };

export function useRestaurantsQuery() {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const data = await apiClient.post<unknown>(`${GOOGLE_PLACES_BASE_URL}/places:searchNearby`, {
        includedTypes: ['restaurant'],
        locationRestriction: { circle: { center: MOCK_LOCATION, radius: 5000 } },
      });
      const { places } = NearbySearchResponseSchema.parse(data);

      const restaurants = await Promise.all(
        places.map(async (place) => {
          const photoUrl = await resolvePlacePhotoUrl(place.photos[0].name);
          return mapPlaceToRestaurant(place, photoUrl);
        }),
      );

      return RestaurantsResponseSchema.parse(restaurants);
    },
  });
}
