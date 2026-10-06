import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getFavoriteIds } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { useFavoritesStore } from '@/stores/favorites';

export function useFavoriteIdsQuery() {
  const userId = useAuthStore((s) => s.user?.id ?? null);

  const query = useQuery({
    queryKey: ['favorite-ids', userId],
    queryFn: getFavoriteIds,
    enabled: userId !== null,
    // Toggles update the favorites store, not this cache; drop it once its user logs out so a re-login never replays a stale list.
    gcTime: 0,
  });

  useEffect(() => {
    if (query.data) {
      useFavoritesStore.getState().setFavoriteIds(query.data);
    }
  }, [query.data]);

  return query;
}
