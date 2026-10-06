import { useQuery } from '@tanstack/react-query';

import { DiscoveryTaxonomiesSchema } from '@/features/search/types';
import { getDiscoveryTaxonomies } from '@/lib/api';

export function useDiscoveryTaxonomiesQuery() {
  return useQuery({
    queryKey: ['discovery-taxonomies'],
    queryFn: async () => {
      const data = await getDiscoveryTaxonomies();
      return DiscoveryTaxonomiesSchema.parse(data);
    },
  });
}
