import { useQuery } from '@tanstack/react-query';

import { ApiError, apiClient } from '@/lib/apiClient';
import { RestaurantDetailSchema } from '@/features/restaurant/types';

export function useRestaurantDetailQuery(id: number) {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      try {
        const data = await apiClient.get(`/restaurants/${id}`);
        return RestaurantDetailSchema.parse(data);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });
}
