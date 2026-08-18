import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { NearbySearchResponseSchema, mapPlaceToRestaurant, resolvePlacePhotoUrl } from '@/lib/googlePlaces';
import { getNearbyPlaces } from '@/mocks/repository';
import { useFavoritesStore } from '@/stores/favorites';
import { RestaurantSchema } from '@/types';

const RestaurantsResponseSchema = z.array(RestaurantSchema);

// Mirrors search's useRestaurantsQuery (same mock, same Google Places
// mapping pipeline) rather than importing it — features never import each
// other, see favorites.md's Architecture Mapping. The only difference from
// that hook is the missing free-text query param (favorites has no search
// box) and the filter-by-favoriteIds step below.
export function useFavoriteRestaurantsQuery() {
  // Selected as a normal reactive hook dependency (not read once and
  // stashed) so unfavoriting a card re-renders this hook's consumers
  // immediately, without a manual refetch — see favorites.md's PO note.
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);

  const query = useQuery({
    // Distinct from search's ['restaurants', ...] cache key — the shared
    // mock-reading logic is intentionally duplicated per-feature, so the
    // cache entries stay independent too (see favorites.md's Architecture
    // Mapping on why this duplication is deliberate, not an oversight).
    queryKey: ['favorite-restaurants-source'],
    queryFn: async () => {
      const data = await getNearbyPlaces();
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

  // Filtering here (not inside queryFn) is what makes the result reactive to
  // favoriteIds changes: queryFn only reruns on cache invalidation/refetch,
  // but this recomputes on every render where favoriteIds changed. Also
  // covers the "id no longer resolves in mock data" edge case (favorites.md)
  // by simply not matching — no crash, filtered out silently.
  const favoriteRestaurants = useMemo(
    () => (query.data ?? []).filter((restaurant) => favoriteIds.has(restaurant.id)),
    [query.data, favoriteIds],
  );

  return { ...query, data: favoriteRestaurants };
}
