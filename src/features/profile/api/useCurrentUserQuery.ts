import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@/mocks/repository';
import { useAuthStore } from '@/stores/auth';
import { UserProfileSchema } from '@/types';

export function useCurrentUserQuery() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const data = await getCurrentUser();
      return UserProfileSchema.parse(data);
    },
    enabled: isLoggedIn,
  });
}
