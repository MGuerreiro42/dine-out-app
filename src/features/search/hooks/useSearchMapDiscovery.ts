import { useDiscoveryTaxonomiesQuery } from '@/features/search/api/useDiscoveryTaxonomiesQuery';
import { useRestaurantsQuery } from '@/features/search/api/useRestaurantsQuery';
import { formatDistanceKm, haversineKm } from '@/lib/geo';
import { useLocationStore } from '@/stores/location';
import type { Restaurant } from '@/types';

export type MapResultData = Restaurant & {
  cuisineLabel: string;
  distance: string;
  tagline: string;
  tags: string[];
  hasDelivery: boolean;
  outdoorSeating: boolean;
  goodForGroups: boolean;
  goodForChildren: boolean;
  servesVegetarianFood: boolean;
};

function toMapResult(
  restaurant: Restaurant,
  cuisineLabel: string,
  occasionLabel: string,
  ambientLabel: string,
  fromLatitude: number,
  fromLongitude: number,
): MapResultData {
  const tags = [ambientLabel, occasionLabel].filter((label): label is string => Boolean(label));
  const tagline = [
    ambientLabel && `${ambientLabel} atmosphere`,
    occasionLabel && `for ${occasionLabel.toLowerCase()}`,
  ]
    .filter(Boolean)
    .join(' ');

  return {
    ...restaurant,
    cuisineLabel,
    distance: formatDistanceKm(haversineKm(fromLatitude, fromLongitude, restaurant.latitude, restaurant.longitude)),
    tagline,
    tags,
    hasDelivery: restaurant.id % 3 !== 0,
    outdoorSeating: restaurant.ambient === 'cozy' || restaurant.ambient === 'relaxed',
    goodForGroups: restaurant.occasion === 'grupo',
    goodForChildren: restaurant.occasion === 'familia',
    servesVegetarianFood: restaurant.cuisine === 'mediterraneo' || restaurant.cuisine === 'indiana',
  };
}

const CATEGORY_LIMIT = 100;

export function useSearchMapDiscovery(searchQuery?: string, filters?: { cuisine?: string; occasion?: string }) {
  const isNarrowed = Boolean(searchQuery?.trim() || filters?.cuisine || filters?.occasion);
  const restaurantsQuery = useRestaurantsQuery(
    searchQuery,
    isNarrowed ? { ...filters, limit: CATEGORY_LIMIT } : filters,
  );
  const taxonomiesQuery = useDiscoveryTaxonomiesQuery();
  const { data: restaurants = [] } = restaurantsQuery;
  const { data: taxonomies } = taxonomiesQuery;
  const latitude = useLocationStore((s) => s.latitude);
  const longitude = useLocationStore((s) => s.longitude);

  const cuisines = taxonomies?.cuisines ?? [];
  const occasions = taxonomies?.occasions ?? [];
  const ambients = taxonomies?.ambients ?? [];

  const results = restaurants.map((r) => {
    const cuisineLabel = cuisines.find((c) => c.id === r.cuisine)?.label ?? '';
    const occasionLabel = occasions.find((o) => o.id === r.occasion)?.label ?? '';
    const ambientLabel = ambients.find((a) => a.id === r.ambient)?.label ?? '';
    return toMapResult(r, cuisineLabel, occasionLabel, ambientLabel, latitude, longitude);
  });

  return {
    isLoading: restaurantsQuery.isLoading || taxonomiesQuery.isLoading,
    isFetching: restaurantsQuery.isFetching || taxonomiesQuery.isFetching,
    isError: restaurantsQuery.isError || taxonomiesQuery.isError,
    refetch: () => {
      restaurantsQuery.refetch();
      taxonomiesQuery.refetch();
    },
    restaurants,
    results,
  };
}
