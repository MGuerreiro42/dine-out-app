import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getFavoriteIds } from '@/mocks/repository';
import { useAuthStore } from '@/stores/auth';
import { useFavoritesStore } from '@/stores/favorites';

export function useFavoriteIdsQuery() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const query = useQuery({
    queryKey: ['favorite-ids'],
    queryFn: getFavoriteIds,
    enabled: isLoggedIn,
  });

  useEffect(() => {
    if (query.data) {
      useFavoritesStore.getState().setFavoriteIds(query.data);
    }
  }, [query.data]);

  return query;
}
