import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { RestaurantsResponseSchema as WireRestaurantsResponseSchema, mapSummaryToRestaurant } from '@/lib/api';
import { getNearbyPlaces, searchPlaces } from '@/mocks/repository';
import { useLocationStore } from '@/stores/location';
import { RestaurantSchema } from '@/types';

const RestaurantsResponseSchema = z.array(RestaurantSchema);

export function useRestaurantsQuery(query?: string) {
  const trimmedQuery = query?.trim();
  const latitude = useLocationStore((s) => s.latitude);
  const longitude = useLocationStore((s) => s.longitude);
  const radiusKm = useLocationStore((s) => s.radiusKm);

  return useQuery({
    queryKey: ['restaurants', trimmedQuery || null, latitude, longitude, radiusKm],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const data = trimmedQuery ? await searchPlaces(trimmedQuery) : await getNearbyPlaces();
      const summaries = WireRestaurantsResponseSchema.parse(data);

      const restaurants = summaries.map(mapSummaryToRestaurant);

      return RestaurantsResponseSchema.parse(restaurants);
    },
  });
}
