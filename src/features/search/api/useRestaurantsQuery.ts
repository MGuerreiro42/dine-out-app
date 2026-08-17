import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { NearbySearchResponseSchema, mapPlaceToRestaurant, resolvePlacePhotoUrl } from '@/lib/googlePlaces';
import { getNearbyPlaces, searchPlaces } from '@/mocks/repository';
import { RestaurantSchema } from '@/types';

const RestaurantsResponseSchema = z.array(RestaurantSchema);

export function useRestaurantsQuery(query?: string) {
  const trimmedQuery = query?.trim();

  return useQuery({
    queryKey: ['restaurants', trimmedQuery || null],
    // Each keystroke's debounced value is a new queryKey — without this,
    // the screen would flash to its full isLoading state (hiding the search
    // bar itself) on every search term change instead of just updating the
    // list in place.
    placeholderData: keepPreviousData,
    queryFn: async () => {
      // Google's real Nearby Search (New) has no free-text query support —
      // Text Search (New) is a genuinely separate endpoint for that (see
      // PROJECT.md's ADR log). Mirrored here rather than bolting an ad-hoc
      // text param onto getNearbyPlaces, which the mock wouldn't rehearse.
      const data = trimmedQuery ? await searchPlaces(trimmedQuery) : await getNearbyPlaces();
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
