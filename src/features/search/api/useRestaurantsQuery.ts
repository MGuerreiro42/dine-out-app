import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { NearbySearchResponseSchema, mapPlaceToRestaurant, resolvePlacePhotoUrl } from '@/lib/googlePlaces';
import { getNearbyPlaces, searchPlaces } from '@/mocks/repository';
import { RestaurantSchema } from '@/types';

const RestaurantsResponseSchema = z.array(RestaurantSchema);

export const MOCK_LOCATION = { latitude: -23.561, longitude: -46.656 };

export function useRestaurantsQuery(query?: string) {
  const trimmedQuery = query?.trim();

  return useQuery({
    queryKey: ['restaurants', trimmedQuery || null],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const data = trimmedQuery ? await searchPlaces(trimmedQuery) : await getNearbyPlaces();
      const { places } = NearbySearchResponseSchema.parse(data);

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
