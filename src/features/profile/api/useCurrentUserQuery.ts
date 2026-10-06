import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { UserProfileSchema } from '@/types';

export function useCurrentUserQuery() {
  const userId = useAuthStore((s) => s.user?.id ?? null);

  return useQuery({
    queryKey: ['current-user', userId],
    queryFn: async () => {
      const data = await getCurrentUser();
      return UserProfileSchema.parse({ ...data, initial: data.name.charAt(0).toUpperCase() });
    },
    enabled: userId !== null,
  });
}
