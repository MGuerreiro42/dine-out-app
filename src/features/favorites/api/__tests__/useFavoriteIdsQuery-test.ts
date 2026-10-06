import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import React from 'react';

import { useFavoriteIdsQuery } from '@/features/favorites/api/useFavoriteIdsQuery';
import * as favoritesApi from '@/lib/api/favorites';
import { useAuthStore } from '@/stores/auth';
import { useFavoritesStore } from '@/stores/favorites';

const ANA = { id: 1, name: 'Ana', email: 'ana@example.com' };
const BRUNO = { id: 2, name: 'Bruno', email: 'bruno@example.com' };

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 5 * 60 * 1000 } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

async function logIn(user: typeof ANA) {
  await act(async () => {
    useAuthStore.setState({ status: 'authenticated', isLoggedIn: true, user, accessToken: 'token' });
  });
}

async function logOut() {
  await act(async () => {
    useAuthStore.setState({ status: 'guest', isLoggedIn: false, user: null, accessToken: null });
  });
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
}

afterEach(() => {
  useFavoritesStore.setState({ favoriteIds: new Set() });
  useAuthStore.setState({ status: 'hydrating', isLoggedIn: false, user: null, accessToken: null });
  jest.restoreAllMocks();
});

test('logging out and back in as the same user repopulates favorites', async () => {
  const getSpy = jest.spyOn(favoritesApi, 'getFavoriteIds').mockResolvedValueOnce([1, 2]).mockResolvedValueOnce([1, 2, 3]);
  await logIn(ANA);
  await renderHook(() => useFavoriteIdsQuery(), { wrapper: createWrapper() });
  await waitFor(() => expect(useFavoritesStore.getState().favoriteIds.size).toBe(2));

  await logOut();
  expect(useFavoritesStore.getState().favoriteIds.size).toBe(0);

  await logIn(ANA);

  await waitFor(() => expect([...useFavoritesStore.getState().favoriteIds]).toEqual([1, 2, 3]));
  expect(getSpy).toHaveBeenCalledTimes(2);
});

test("a different user logging in never receives the previous user's favorites", async () => {
  let resolveBruno: (ids: number[]) => void = () => {};
  jest
    .spyOn(favoritesApi, 'getFavoriteIds')
    .mockResolvedValueOnce([1, 2])
    .mockReturnValueOnce(new Promise((resolve) => (resolveBruno = resolve)));
  await logIn(ANA);
  const { result } = await renderHook(() => useFavoriteIdsQuery(), { wrapper: createWrapper() });
  await waitFor(() => expect(useFavoritesStore.getState().favoriteIds.size).toBe(2));

  await logOut();
  await logIn(BRUNO);

  expect(result.current.data).toBeUndefined();
  expect(useFavoritesStore.getState().favoriteIds.size).toBe(0);

  await act(async () => resolveBruno([9]));

  await waitFor(() => expect([...useFavoritesStore.getState().favoriteIds]).toEqual([9]));
});
