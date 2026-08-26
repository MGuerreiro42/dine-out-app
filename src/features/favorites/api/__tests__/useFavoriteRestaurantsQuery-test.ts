import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import React from 'react';

import { useFavoriteRestaurantsQuery } from '@/features/favorites/api/useFavoriteRestaurantsQuery';
import type { RestaurantSummary } from '@/lib/api';
import * as repository from '@/mocks/repository';
import { useFavoritesStore } from '@/stores/favorites';

const RESTAURANTS: RestaurantSummary[] = [
  {
    id: 1,
    displayName: 'Fogo & Brasa',
    formattedAddress: 'Av. Paulista, 1200 - Bela Vista, São Paulo - SP',
    latitude: -23.5649,
    longitude: -46.6583,
    category: 'brazilian_restaurant',
    cuisineId: 'brazilian',
    occasion: 'date-night',
    ambient: 'cozy',
    tags: [],
    whatsapp: null,
    instagramHandle: null,
  },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

afterEach(() => {
  // Reset the shared global store so favoriting in one test can't leak into
  // the next — this store is a module singleton, not created per-render.
  useFavoritesStore.setState({ favoriteIds: new Set() });
  jest.restoreAllMocks();
});

test('reacts to favoriteIds changes without an extra mock/network call', async () => {
  const getNearbyPlacesSpy = jest.spyOn(repository, 'getNearbyPlaces').mockResolvedValueOnce(RESTAURANTS);

  const { result } = await renderHook(() => useFavoriteRestaurantsQuery(), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toHaveLength(0);
  expect(getNearbyPlacesSpy).toHaveBeenCalledTimes(1);

  // Favoriting a restaurant should update the filtered list on the next
  // render purely from the store's reactive `favoriteIds` dependency (see
  // useFavoriteRestaurantsQuery.ts) — no refetch/new mock call needed.
  await act(async () => {
    useFavoritesStore.getState().toggleFavorite(1);
  });

  await waitFor(() => expect(result.current.data).toHaveLength(1));
  expect(result.current.data?.[0]).toMatchObject({ id: 1 });
  expect(getNearbyPlacesSpy).toHaveBeenCalledTimes(1);

  // Unfavoriting removes it again, still without a new network/mock call.
  await act(async () => {
    useFavoritesStore.getState().toggleFavorite(1);
  });

  await waitFor(() => expect(result.current.data).toHaveLength(0));
  expect(getNearbyPlacesSpy).toHaveBeenCalledTimes(1);
});
