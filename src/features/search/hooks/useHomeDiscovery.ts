import { useState } from 'react';

import { useDiscoveryTaxonomiesQuery } from '@/features/search/api/useDiscoveryTaxonomiesQuery';
import { useRestaurantsQuery } from '@/features/search/api/useRestaurantsQuery';
import type { Ambient, Cuisine, Occasion } from '@/features/search/types';
import type { Restaurant } from '@/types';

export type HomeCardData = Restaurant & {
  cuisineLabel: string;
  tags: string[];
  isOpenNow: boolean;
  hasDelivery: boolean;
};

// Presentation-only derivation, not stored data — same pattern already
// established by DiscoveryCardData (search) and MapResultData (search &
// map): a restaurant's own cuisine/occasion/ambient labels and a
// deterministic mock "open now" flag, computed at render time. Standalone
// (not a closure) so useTypeDetail can reuse it against the same taxonomies.
export function deriveHomeCard(
  restaurant: Restaurant,
  cuisines: Cuisine[],
  occasions: Occasion[],
  ambients: Ambient[],
): HomeCardData {
  return {
    ...restaurant,
    cuisineLabel: cuisines.find((c) => c.id === restaurant.cuisine)?.label ?? '',
    tags: [
      ambients.find((a) => a.id === restaurant.ambient)?.label,
      occasions.find((o) => o.id === restaurant.occasion)?.label,
    ].filter((label): label is string => Boolean(label)),
    isOpenNow: restaurant.id % 4 !== 0,
    hasDelivery: restaurant.id % 3 !== 0,
  };
}

export function useHomeDiscovery() {
  const restaurantsQuery = useRestaurantsQuery();
  const taxonomiesQuery = useDiscoveryTaxonomiesQuery();
  const { data: restaurants = [] } = restaurantsQuery;
  const { data: taxonomies } = taxonomiesQuery;

  const [activeCuisine, setActiveCuisine] = useState<string | null>(null);
  const [activeOccasion, setActiveOccasion] = useState<string | null>(null);
  const [activeAmbient, setActiveAmbient] = useState<string | null>(null);

  const cuisines = taxonomies?.cuisines ?? [];
  const occasions = taxonomies?.occasions ?? [];
  const ambients = taxonomies?.ambients ?? [];

  const currentCuisine = activeCuisine ?? cuisines[0]?.id ?? null;
  const currentOccasion = activeOccasion ?? occasions[0]?.id ?? null;
  const currentAmbient = activeAmbient ?? ambients[0]?.id ?? null;

  const cuisineList = restaurants.filter((r) => r.cuisine === currentCuisine);
  const occasionList = restaurants.filter((r) => r.occasion === currentOccasion);
  const ambientList = restaurants.filter((r) => r.ambient === currentAmbient);

  const toHomeCard = (restaurant: Restaurant) => deriveHomeCard(restaurant, cuisines, occasions, ambients);

  const featured = restaurants[0];
  const featuredCuisineLabel = featured ? (cuisines.find((c) => c.id === featured.cuisine)?.label ?? '') : '';
  const featuredAmbientLabel = featured ? (ambients.find((a) => a.id === featured.ambient)?.label ?? '') : '';
  const featuredTagline = featured
    ? `Authentic ${featuredCuisineLabel} dining with a ${featuredAmbientLabel.toLowerCase()} atmosphere.`
    : '';

  return {
    isLoading: restaurantsQuery.isLoading || taxonomiesQuery.isLoading,
    isError: restaurantsQuery.isError || taxonomiesQuery.isError,
    refetch: () => {
      restaurantsQuery.refetch();
      taxonomiesQuery.refetch();
    },
    restaurants: restaurants.map(toHomeCard),
    cuisines: cuisines.map((c) => ({ ...c, isActive: c.id === currentCuisine })),
    occasions: occasions.map((o) => ({ ...o, isActive: o.id === currentOccasion })),
    ambients: ambients.map((a) => ({ ...a, isActive: a.id === currentAmbient })),
    cuisineList: (cuisineList.length ? cuisineList : restaurants.slice(0, 3)).map(toHomeCard),
    occasionList: (occasionList.length ? occasionList : restaurants.slice(0, 3)).map(toHomeCard),
    ambientList: (ambientList.length ? ambientList : restaurants.slice(0, 3)).map(toHomeCard),
    featuredTagline,
    setActiveCuisine,
    setActiveOccasion,
    setActiveAmbient,
  };
}
