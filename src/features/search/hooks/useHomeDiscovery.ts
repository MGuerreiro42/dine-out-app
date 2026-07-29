import { useState } from 'react';

import { useDiscoveryTaxonomiesQuery } from '@/features/search/api/useDiscoveryTaxonomiesQuery';
import { useRestaurantsQuery } from '@/features/search/api/useRestaurantsQuery';

export function useHomeDiscovery(searchQuery?: string) {
  const restaurantsQuery = useRestaurantsQuery(searchQuery);
  const taxonomiesQuery = useDiscoveryTaxonomiesQuery();
  const { data: restaurants = [] } = restaurantsQuery;
  const { data: taxonomies } = taxonomiesQuery;

  const [activeCuisine, setActiveCuisine] = useState<string | null>(null);
  const [activeOccasion, setActiveOccasion] = useState<string | null>(null);
  const [activeAmbient, setActiveAmbient] = useState<string | null>(null);

  const cuisines = taxonomies?.cuisines ?? [];
  const occasions = taxonomies?.occasions ?? [];
  const ambients = taxonomies?.ambients ?? [];
  const benefits = taxonomies?.benefits ?? [];

  const currentCuisine = activeCuisine ?? cuisines[0]?.id ?? null;
  const currentOccasion = activeOccasion ?? occasions[0]?.id ?? null;
  const currentAmbient = activeAmbient ?? ambients[0]?.id ?? null;

  const cuisineList = restaurants.filter((r) => r.cuisine === currentCuisine);
  const occasionList = restaurants.filter((r) => r.occasion === currentOccasion);
  const ambientList = restaurants.filter((r) => r.ambient === currentAmbient);

  return {
    isLoading: restaurantsQuery.isLoading || taxonomiesQuery.isLoading,
    isError: restaurantsQuery.isError || taxonomiesQuery.isError,
    refetch: () => {
      restaurantsQuery.refetch();
      taxonomiesQuery.refetch();
    },
    restaurants,
    cuisines: cuisines.map((c) => ({ ...c, isActive: c.id === currentCuisine })),
    occasions: occasions.map((o) => ({ ...o, isActive: o.id === currentOccasion })),
    ambients: ambients.map((a) => ({ ...a, isActive: a.id === currentAmbient })),
    benefits,
    cuisineList: cuisineList.length ? cuisineList : restaurants.slice(0, 3),
    occasionList: occasionList.length ? occasionList : restaurants.slice(0, 3),
    ambientList: ambientList.length ? ambientList : restaurants.slice(0, 3),
    setActiveCuisine,
    setActiveOccasion,
    setActiveAmbient,
  };
}
