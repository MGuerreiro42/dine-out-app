import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { RestaurantsResponseSchema as WireRestaurantsResponseSchema, mapSummaryToRestaurant } from '@/lib/api';
import { getNearbyPlaces } from '@/mocks/repository';
import { useLocationStore } from '@/stores/location';
import { RestaurantSchema } from '@/types';

const RestaurantsResponseSchema = z.array(RestaurantSchema);

export type RestaurantsQueryFilters = {
  cuisine?: string;
  occasion?: string;
  category?: string;
  limit?: number;
};

export function useRestaurantsQuery(query?: string, filters?: RestaurantsQueryFilters) {
  const trimmedQuery = query?.trim();
  const latitude = useLocationStore((s) => s.latitude);
  const longitude = useLocationStore((s) => s.longitude);
  const radiusKm = useLocationStore((s) => s.radiusKm);

  return useQuery({
    queryKey: [
      'restaurants',
      trimmedQuery || null,
      latitude,
      longitude,
      radiusKm,
      filters?.cuisine ?? null,
      filters?.occasion ?? null,
      filters?.category ?? null,
      filters?.limit ?? null,
    ],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const data = await getNearbyPlaces({ query: trimmedQuery || undefined, ...filters });
      const summaries = WireRestaurantsResponseSchema.parse(data);

      const restaurants = summaries.map(mapSummaryToRestaurant);

      return RestaurantsResponseSchema.parse(restaurants);
    },
  });
}
