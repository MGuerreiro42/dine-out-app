import { useQuery } from '@tanstack/react-query';

import { ApiError, apiClient } from '@/lib/apiClient';
import { GOOGLE_PLACES_BASE_URL, PlaceDetailsSchema, mapPlaceToRestaurant, resolvePlacePhotoUrl } from '@/lib/googlePlaces';
import { RestaurantDetailSchema } from '@/features/restaurant/types';
import type { RestaurantDetail } from '@/features/restaurant/types';

export function useRestaurantDetailQuery(id: number) {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      try {
        const data = await apiClient.get<unknown>(`${GOOGLE_PLACES_BASE_URL}/places/${id}`);
        const place = PlaceDetailsSchema.parse(data);

        const photoUrls = await Promise.all(place.photos.map((photo) => resolvePlacePhotoUrl(photo.name)));
        const base = mapPlaceToRestaurant(place, photoUrls[0]);

        const detail: RestaurantDetail = {
          ...base,
          photos: photoUrls,
          description: place.editorialSummary.text,
          tags: place.tags,
          addressShort: place.formattedAddress,
          menu: place.menu,
        };

        return RestaurantDetailSchema.parse(detail);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });
}
