import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@/mocks/repository';
import { UserProfileSchema } from '@/types';

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const data = await getCurrentUser();
      return UserProfileSchema.parse(data);
    },
  });
}
