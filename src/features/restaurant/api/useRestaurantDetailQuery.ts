import { useQuery } from '@tanstack/react-query';

import { RESTAURANT_DETAILS } from '@/mocks';

export function useRestaurantDetailQuery(id: number) {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => RESTAURANT_DETAILS[id] ?? null,
  });
}
