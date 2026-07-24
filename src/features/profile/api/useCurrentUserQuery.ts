import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/apiClient';
import { UserProfileSchema } from '@/types';

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const data = await apiClient.get('/current-user');
      return UserProfileSchema.parse(data);
    },
  });
}
