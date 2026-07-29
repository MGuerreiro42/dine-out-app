import { useState } from 'react';

import { useDiscoveryTaxonomiesQuery } from '@/features/search/api/useDiscoveryTaxonomiesQuery';
import { useRestaurantsQuery } from '@/features/search/api/useRestaurantsQuery';
import type { Restaurant } from '@/types';

export type DiscoveryCardData = Restaurant & {
  cuisineLabel: string;
  discount?: string;
  distance?: string;
};

// Presentation-only derivation, not stored data — same "lookup at render time,
// not authored per item" pattern as the restaurant feature's amenity icons.
function toDiscoveryCard(restaurant: Restaurant, cuisineLabel: string, distance?: string): DiscoveryCardData {
  return {
    ...restaurant,
    cuisineLabel,
    discount: restaurant.priceLevel === '$' ? '10% off' : undefined,
    distance,
  };
}

export function useCategoryDiscovery(initialCuisine?: string, searchQuery?: string) {
  const restaurantsQuery = useRestaurantsQuery(searchQuery);
  const taxonomiesQuery = useDiscoveryTaxonomiesQuery();
  const { data: restaurants = [] } = restaurantsQuery;
  const { data: taxonomies } = taxonomiesQuery;

  const cuisines = taxonomies?.cuisines ?? [];
  const [activeCuisine, setActiveCuisine] = useState<string | null>(null);

  const isValidInitial = initialCuisine ? cuisines.some((c) => c.id === initialCuisine) : false;
  const currentCuisine = activeCuisine ?? (isValidInitial ? (initialCuisine as string) : (cuisines[0]?.id ?? null));

  const cuisineLabel = cuisines.find((c) => c.id === currentCuisine)?.label ?? '';
  const subtypes = currentCuisine ? (taxonomies?.categorySubtypes[currentCuisine] ?? []) : [];

  const cuisineRestaurants = restaurants.filter((r) => r.cuisine === currentCuisine);

  // Only 6 restaurants exist per cuisine, and 3 grids of 4 (12 slots) can't
  // be fully disjoint from a 6-item pool — overlap across sections is an
  // accepted limitation of this prototype's dataset size, not a bug.
  const champions = [...cuisineRestaurants].sort((a, b) => Number(b.rating) - Number(a.rating)).slice(0, 4);
  const trending = [...cuisineRestaurants].sort((a, b) => a.id - b.id).slice(0, 4);
  const nearYou = cuisineRestaurants.slice(0, 4);

  return {
    isLoading: restaurantsQuery.isLoading || taxonomiesQuery.isLoading,
    isError: restaurantsQuery.isError || taxonomiesQuery.isError,
    refetch: () => {
      restaurantsQuery.refetch();
      taxonomiesQuery.refetch();
    },
    cuisines: cuisines.map((c) => ({ ...c, isActive: c.id === currentCuisine })),
    activeCuisineLabel: cuisineLabel,
    heroPhoto: champions[0]?.photo,
    subtypes,
    champions: champions.map((r) => toDiscoveryCard(r, cuisineLabel)),
    trending: trending.map((r) => toDiscoveryCard(r, cuisineLabel)),
    nearYou: nearYou.map((r) => toDiscoveryCard(r, cuisineLabel, `${(1 + (r.id % 5) * 0.3).toFixed(1)} km`)),
    setActiveCuisine,
  };
}
