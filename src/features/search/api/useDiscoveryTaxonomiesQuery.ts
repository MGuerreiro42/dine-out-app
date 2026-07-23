import { useQuery } from '@tanstack/react-query';

import { AMBIENTS, BENEFITS, CUISINES, OCCASIONS } from '@/mocks';

export function useDiscoveryTaxonomiesQuery() {
  return useQuery({
    queryKey: ['discovery-taxonomies'],
    queryFn: async () => ({
      cuisines: CUISINES,
      occasions: OCCASIONS,
      ambients: AMBIENTS,
      benefits: BENEFITS,
    }),
  });
}
