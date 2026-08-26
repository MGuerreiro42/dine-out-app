import { useDiscoveryTaxonomiesQuery } from '@/features/search/api/useDiscoveryTaxonomiesQuery';
import { useRestaurantsQuery } from '@/features/search/api/useRestaurantsQuery';
import type { Restaurant } from '@/types';

export type MapResultData = Restaurant & {
  cuisineLabel: string;
  distance: string;
  tagline: string;
  tags: string[];
  isOpenNow: boolean;
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
    distance: `${(1 + (restaurant.id % 5) * 0.3).toFixed(1)} km`,
    tagline,
    tags,
    isOpenNow: restaurant.id % 4 !== 0,
    hasDelivery: restaurant.id % 3 !== 0,
    outdoorSeating: restaurant.ambient === 'cozy' || restaurant.ambient === 'relaxed',
    goodForGroups: restaurant.occasion === 'grupo',
    goodForChildren: restaurant.occasion === 'familia',
    servesVegetarianFood: restaurant.cuisine === 'mediterraneo' || restaurant.cuisine === 'indiana',
  };
}

export function useSearchMapDiscovery(searchQuery?: string) {
  const restaurantsQuery = useRestaurantsQuery(searchQuery);
  const taxonomiesQuery = useDiscoveryTaxonomiesQuery();
  const { data: restaurants = [] } = restaurantsQuery;
  const { data: taxonomies } = taxonomiesQuery;

  const cuisines = taxonomies?.cuisines ?? [];
  const occasions = taxonomies?.occasions ?? [];
  const ambients = taxonomies?.ambients ?? [];

  const results = restaurants.map((r) => {
    const cuisineLabel = cuisines.find((c) => c.id === r.cuisine)?.label ?? '';
    const occasionLabel = occasions.find((o) => o.id === r.occasion)?.label ?? '';
    const ambientLabel = ambients.find((a) => a.id === r.ambient)?.label ?? '';
    return toMapResult(r, cuisineLabel, occasionLabel, ambientLabel);
  });

  return {
    isLoading: restaurantsQuery.isLoading || taxonomiesQuery.isLoading,
    isError: restaurantsQuery.isError || taxonomiesQuery.isError,
    refetch: () => {
      restaurantsQuery.refetch();
      taxonomiesQuery.refetch();
    },
    restaurants,
    results,
  };
}
