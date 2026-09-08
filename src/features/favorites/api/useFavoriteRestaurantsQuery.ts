import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { RestaurantsResponseSchema as WireRestaurantsResponseSchema, mapSummaryToRestaurant } from '@/lib/api';
import { getNearbyPlaces } from '@/mocks/repository';
import { useFavoritesStore } from '@/stores/favorites';
import { useLocationStore } from '@/stores/location';
import { RestaurantSchema } from '@/types';

const RestaurantsResponseSchema = z.array(RestaurantSchema);

// Mirrors search's useRestaurantsQuery (same repository call, same wire
// mapping pipeline) rather than importing it — features never import each
// other, see favorites.md's Architecture Mapping. The only difference from
// that hook is the missing free-text query param (favorites has no search
// box) and the filter-by-favoriteIds step below.
export function useFavoriteRestaurantsQuery() {
  // Selected as a normal reactive hook dependency (not read once and
  // stashed) so unfavoriting a card re-renders this hook's consumers
  // immediately, without a manual refetch — see favorites.md's PO note.
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  // getNearbyPlaces() reads these straight off the location store regardless
  // of args, so they must be part of the cache key too — otherwise a radius
  // change after the first fetch (e.g. expanding past an empty default-radius
  // result) leaves this query stuck on a stale, possibly restaurant-less
  // result set for its full staleTime, hiding an already-saved favorite.
  const latitude = useLocationStore((s) => s.latitude);
  const longitude = useLocationStore((s) => s.longitude);
  const radiusKm = useLocationStore((s) => s.radiusKm);

  const query = useQuery({
    // Distinct from search's ['restaurants', ...] cache key — the shared
    // fetching logic is intentionally duplicated per-feature, so the
    // cache entries stay independent too (see favorites.md's Architecture
    // Mapping on why this duplication is deliberate, not an oversight).
    queryKey: ['favorite-restaurants-source', latitude, longitude, radiusKm],
    queryFn: async () => {
      const data = await getNearbyPlaces();
      const summaries = WireRestaurantsResponseSchema.parse(data);

      const restaurants = summaries.map(mapSummaryToRestaurant);

      return RestaurantsResponseSchema.parse(restaurants);
    },
  });

  // Filtering here (not inside queryFn) is what makes the result reactive to
  // favoriteIds changes: queryFn only reruns on cache invalidation/refetch,
  // but this recomputes on every render where favoriteIds changed. Also
  // covers the "id no longer resolves in the current result set" edge case
  // (favorites.md) by simply not matching — no crash, filtered out silently.
  const favoriteRestaurants = useMemo(
    () => (query.data ?? []).filter((restaurant) => favoriteIds.has(restaurant.id)),
    [query.data, favoriteIds],
  );

  return { ...query, data: favoriteRestaurants };
}
