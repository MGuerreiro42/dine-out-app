import { useRef, useState } from 'react';

import { useDiscoveryTaxonomiesQuery } from '@/features/search/api/useDiscoveryTaxonomiesQuery';
import { useRestaurantsQuery } from '@/features/search/api/useRestaurantsQuery';
import { pickSpotlights, type Spotlight } from '@/features/search/lib/pickSpotlights';
import type { Ambient, Cuisine, Occasion } from '@/features/search/types';
import { formatDistanceKm, haversineKm } from '@/lib/geo';
import { useLocationStore } from '@/stores/location';
import type { Restaurant } from '@/types';

export type HomeCardData = Restaurant & {
  cuisineLabel: string;
  tags: string[];
  hasDelivery: boolean;
  distanceLabel: string;
};

export function deriveHomeCard(
  restaurant: Restaurant,
  cuisines: Cuisine[],
  occasions: Occasion[],
  ambients: Ambient[],
  fromLatitude: number,
  fromLongitude: number,
): HomeCardData {
  return {
    ...restaurant,
    cuisineLabel: cuisines.find((c) => c.id === restaurant.cuisine)?.label ?? '',
    tags: [
      ambients.find((a) => a.id === restaurant.ambient)?.label,
      occasions.find((o) => o.id === restaurant.occasion)?.label,
    ].filter((label): label is string => Boolean(label)),
    hasDelivery: restaurant.id % 3 !== 0,
    distanceLabel: formatDistanceKm(
      haversineKm(fromLatitude, fromLongitude, restaurant.latitude, restaurant.longitude),
    ),
  };
}

type SpotlightMemo = { anchorKey: string; picks: Spotlight[] };

export function useHomeDiscovery() {
  const restaurantsQuery = useRestaurantsQuery();
  const taxonomiesQuery = useDiscoveryTaxonomiesQuery();
  const { data: restaurants = [] } = restaurantsQuery;
  const { data: taxonomies } = taxonomiesQuery;
  const latitude = useLocationStore((s) => s.latitude);
  const longitude = useLocationStore((s) => s.longitude);
  const radiusKm = useLocationStore((s) => s.radiusKm);

  const [activeCuisine, setActiveCuisine] = useState<string | null>(null);

  const cuisines = taxonomies?.cuisines ?? [];
  const occasions = taxonomies?.occasions ?? [];
  const ambients = taxonomies?.ambients ?? [];

  const currentCuisine = activeCuisine ?? cuisines[0]?.id ?? null;

  const cuisineList = restaurants.filter((r) => r.cuisine === currentCuisine);

  const toHomeCard = (restaurant: Restaurant) =>
    deriveHomeCard(restaurant, cuisines, occasions, ambients, latitude, longitude);

  const featured = restaurants.slice(0, 5).map(toHomeCard);
  const taglineFor = (restaurant: HomeCardData) => {
    const ambientLabel = ambients.find((a) => a.id === restaurant.ambient)?.label ?? '';
    return [
      restaurant.cuisineLabel && `Authentic ${restaurant.cuisineLabel} dining`,
      ambientLabel && `a ${ambientLabel.toLowerCase()} atmosphere`,
    ]
      .filter(Boolean)
      .join(' with ');
  };

  // Keyed on the search anchor (not "ever computed") so a location/radius change
  // re-picks against the new restaurant set, but a same-anchor refetch (e.g.
  // TanStack Query's background refetch) doesn't reshuffle the pick mid-session.
  // Guarded on `!isPlaceholderData`: `useRestaurantsQuery` uses `keepPreviousData`, so
  // the render right after an anchor change still carries the *previous* anchor's
  // restaurants under the *new* key — computing here would lock in a pick derived
  // from stale data before the real fetch for the new anchor resolves.
  const spotlightMemoRef = useRef<SpotlightMemo | null>(null);
  const spotlightAnchorKey = `${latitude}:${longitude}:${radiusKm}`;
  if (
    (spotlightMemoRef.current === null || spotlightMemoRef.current.anchorKey !== spotlightAnchorKey) &&
    restaurants.length > 0 &&
    cuisines.length > 0 &&
    !restaurantsQuery.isPlaceholderData
  ) {
    spotlightMemoRef.current = {
      anchorKey: spotlightAnchorKey,
      picks: pickSpotlights(restaurants, cuisines, currentCuisine),
    };
  }
  const spotlightMemo = spotlightMemoRef.current;
  const spotlightPicks = spotlightMemo && spotlightMemo.anchorKey === spotlightAnchorKey ? spotlightMemo.picks : [];

  const spotlights = spotlightPicks.map((pick) => ({
    ...pick,
    restaurants: restaurants.filter((r) => r.cuisine === pick.cuisineId).map(toHomeCard),
  }));

  // One card per brand, keeping the first (nearest, per the backend's distance sort)
  // location of each chain rather than repeating the same brand for every branch nearby.
  const seenBrands = new Set<string>();
  const brandRestaurants = restaurants
    .filter((r) => {
      if (!r.brandName || seenBrands.has(r.brandName)) return false;
      seenBrands.add(r.brandName);
      return true;
    })
    .map(toHomeCard);

  return {
    isLoading: restaurantsQuery.isLoading || taxonomiesQuery.isLoading,
    isFetching: restaurantsQuery.isFetching,
    isError: restaurantsQuery.isError || taxonomiesQuery.isError,
    refetch: () => {
      restaurantsQuery.refetch();
      taxonomiesQuery.refetch();
    },
    restaurants: restaurants.map(toHomeCard),
    cuisines: cuisines.map((c) => ({ ...c, isActive: c.id === currentCuisine })),
    cuisineList: (cuisineList.length ? cuisineList : restaurants.slice(0, 3)).map(toHomeCard),
    occasions,
    spotlights,
    featured,
    brandRestaurants,
    taglineFor,
    setActiveCuisine,
  };
}
