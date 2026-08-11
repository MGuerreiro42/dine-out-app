import { useState } from 'react';

import { useDiscoveryTaxonomiesQuery } from '@/features/search/api/useDiscoveryTaxonomiesQuery';
import { useRestaurantsQuery } from '@/features/search/api/useRestaurantsQuery';
import type { Restaurant } from '@/types';

export type DiscoveryCardData = Restaurant & {
  cuisineLabel: string;
  discount?: string;
  distance?: string;
};

export type TaxonomyDimension = 'cuisine' | 'venueType';

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

/**
 * Backs any "browse restaurants grouped by one taxonomy dimension" listing
 * page (hero banner + best-rated/trending/near-you grids, in-page tabs) —
 * today `cuisine` (the Category page) and `venueType` (Dine-in/Bars/Takeout).
 * `cuisineLabel` on every card is always the restaurant's *own* cuisine
 * (looked up independently of `dimension`, same pattern useSearchMapDiscovery
 * already uses), not the active tab's label — only the two happen to be
 * identical when `dimension === 'cuisine'`.
 */
export function useTaxonomyDiscovery(dimension: TaxonomyDimension, initialId?: string, searchQuery?: string) {
  const restaurantsQuery = useRestaurantsQuery(searchQuery);
  const taxonomiesQuery = useDiscoveryTaxonomiesQuery();
  const { data: restaurants = [] } = restaurantsQuery;
  const { data: taxonomies } = taxonomiesQuery;

  const cuisines = taxonomies?.cuisines ?? [];
  const items: { id: string; label: string }[] = dimension === 'cuisine' ? cuisines : (taxonomies?.venueTypes ?? []);
  const [activeId, setActiveId] = useState<string | null>(null);

  const isValidInitial = initialId ? items.some((item) => item.id === initialId) : false;
  const currentId = activeId ?? (isValidInitial ? (initialId as string) : (items[0]?.id ?? null));

  const activeLabel = items.find((item) => item.id === currentId)?.label ?? '';
  // Subtypes ("Rodízio"/"Espetos"...) only exist per-cuisine — a venue-type
  // listing has no equivalent "explore by style" refinement yet.
  const subtypes = dimension === 'cuisine' && currentId ? (taxonomies?.categorySubtypes[currentId] ?? []) : [];

  const dimensionRestaurants = restaurants.filter((r) => r[dimension] === currentId);
  const cuisineLabelFor = (restaurant: Restaurant) => cuisines.find((c) => c.id === restaurant.cuisine)?.label ?? '';

  // Only 6-10 restaurants exist per dimension value, and 3 grids of 4 (12
  // slots) can't be fully disjoint from that small a pool — overlap across
  // sections is an accepted limitation of this prototype's dataset size.
  const champions = [...dimensionRestaurants].sort((a, b) => Number(b.rating) - Number(a.rating)).slice(0, 4);
  const trending = [...dimensionRestaurants].sort((a, b) => a.id - b.id).slice(0, 4);
  const nearYou = dimensionRestaurants.slice(0, 4);

  return {
    isLoading: restaurantsQuery.isLoading || taxonomiesQuery.isLoading,
    isError: restaurantsQuery.isError || taxonomiesQuery.isError,
    refetch: () => {
      restaurantsQuery.refetch();
      taxonomiesQuery.refetch();
    },
    items: items.map((item) => ({ ...item, isActive: item.id === currentId })),
    activeLabel,
    heroPhoto: champions[0]?.photo,
    subtypes,
    champions: champions.map((r) => toDiscoveryCard(r, cuisineLabelFor(r))),
    trending: trending.map((r) => toDiscoveryCard(r, cuisineLabelFor(r))),
    nearYou: nearYou.map((r) => toDiscoveryCard(r, cuisineLabelFor(r), `${(1 + (r.id % 5) * 0.3).toFixed(1)} km`)),
    setActiveId,
  };
}
