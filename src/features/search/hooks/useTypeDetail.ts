import { useState } from 'react';

import { useDiscoveryTaxonomiesQuery } from '@/features/search/api/useDiscoveryTaxonomiesQuery';
import { useRestaurantsQuery } from '@/features/search/api/useRestaurantsQuery';
import type { Ambient, Cuisine, Occasion } from '@/features/search/types';
import type { Restaurant } from '@/types';

import { compareByRating } from '@/features/search/lib/ratingSort';

import { deriveHomeCard } from './useHomeDiscovery';

export type TaxonomyDimension = 'cuisine' | 'occasion' | 'ambient';

const REFINE_DIMENSIONS: Record<TaxonomyDimension, [TaxonomyDimension, TaxonomyDimension]> = {
  cuisine: ['occasion', 'ambient'],
  occasion: ['cuisine', 'ambient'],
  ambient: ['cuisine', 'occasion'],
};

const GRID_SIZE = 4;
const CATEGORY_LIMIT = 100;

const DIMENSION_FILTER_KEY: Partial<Record<TaxonomyDimension, 'cuisine' | 'occasion'>> = {
  cuisine: 'cuisine',
  occasion: 'occasion',
};

function topRated(list: Restaurant[]) {
  return [...list].sort((a, b) => compareByRating(a.rating, b.rating));
}

export function useTypeDetail(dimension: TaxonomyDimension, id: string | undefined, searchQuery?: string) {
  const filterKey = DIMENSION_FILTER_KEY[dimension];
  const restaurantsQuery = useRestaurantsQuery(
    searchQuery,
    id && filterKey ? { [filterKey]: id, limit: CATEGORY_LIMIT } : undefined,
  );
  const taxonomiesQuery = useDiscoveryTaxonomiesQuery();
  const { data: restaurants = [] } = restaurantsQuery;
  const { data: taxonomies } = taxonomiesQuery;

  const cuisines = taxonomies?.cuisines ?? [];
  const occasions = taxonomies?.occasions ?? [];
  const ambients = taxonomies?.ambients ?? [];
  const taxonomyByDimension: Record<TaxonomyDimension, (Cuisine | Occasion | Ambient)[]> = {
    cuisine: cuisines,
    occasion: occasions,
    ambient: ambients,
  };

  const toCard = (restaurant: Restaurant) => deriveHomeCard(restaurant, cuisines, occasions, ambients);

  const primaryLabel = (id ? taxonomyByDimension[dimension].find((item) => item.id === id)?.label : '') ?? '';
  const primaryList = id ? restaurants.filter((r) => r[dimension] === id) : [];

  const [refineDim1, refineDim2] = REFINE_DIMENSIONS[dimension];
  const refine1Options = taxonomyByDimension[refineDim1];
  const refine2Options = taxonomyByDimension[refineDim2];
  const [activeRefine1, setActiveRefine1] = useState<string | null>(null);
  const [activeRefine2, setActiveRefine2] = useState<string | null>(null);
  const currentRefine1 = activeRefine1 ?? refine1Options[0]?.id ?? null;
  const currentRefine2 = activeRefine2 ?? refine2Options[0]?.id ?? null;

  const refine1List = primaryList.filter((r) => r[refineDim1] === currentRefine1);
  const refine2List = primaryList.filter((r) => r[refineDim2] === currentRefine2);

  const champions = topRated(primaryList).slice(0, GRID_SIZE);
  const trending = [...primaryList].sort((a, b) => a.id - b.id).slice(0, GRID_SIZE);
  const lastSection = primaryList.slice(0, GRID_SIZE);
  const champion = champions[0];

  return {
    isLoading: restaurantsQuery.isLoading || taxonomiesQuery.isLoading,
    isError: restaurantsQuery.isError || taxonomiesQuery.isError,
    refetch: () => {
      restaurantsQuery.refetch();
      taxonomiesQuery.refetch();
    },
    primaryLabel,
    champion: champion ? toCard(champion) : undefined,
    champions: champions.map(toCard),
    trending: trending.map(toCard),
    lastSection: lastSection.map(toCard),
    refine1: {
      dimension: refineDim1,
      options: refine1Options.map((o) => ({ ...o, isActive: o.id === currentRefine1 })),
      setActive: setActiveRefine1,
      results: (refine1List.length ? refine1List : primaryList).slice(0, GRID_SIZE).map(toCard),
    },
    refine2: {
      dimension: refineDim2,
      options: refine2Options.map((o) => ({ ...o, isActive: o.id === currentRefine2 })),
      setActive: setActiveRefine2,
      results: (refine2List.length ? refine2List : primaryList).slice(0, GRID_SIZE).map(toCard),
    },
  };
}
