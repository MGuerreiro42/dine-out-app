import { useQuery } from '@tanstack/react-query';

import { RESTAURANTS } from '@/mocks';

export function useRestaurantsQuery() {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => RESTAURANTS,
  });
}
