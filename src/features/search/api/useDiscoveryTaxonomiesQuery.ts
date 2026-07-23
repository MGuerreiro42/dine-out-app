import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/apiClient';
import { DiscoveryTaxonomiesSchema } from '@/features/search/types';

export function useDiscoveryTaxonomiesQuery() {
  return useQuery({
    queryKey: ['discovery-taxonomies'],
    queryFn: async () => {
      const data = await apiClient.get('/discovery-taxonomies');
      return DiscoveryTaxonomiesSchema.parse(data);
    },
  });
}
