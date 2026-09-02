import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import React from 'react';

import { useRestaurantsQuery } from '@/features/search/api/useRestaurantsQuery';
import type { RestaurantSummary } from '@/lib/api';
import * as repository from '@/mocks/repository';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

const RESTAURANTS: RestaurantSummary[] = [
  {
    id: 1,
    displayName: 'Fogo & Brasa',
    formattedAddress: 'Av. Paulista, 1200 - Bela Vista, São Paulo - SP',
    latitude: -23.5649,
    longitude: -46.6583,
    category: 'brazilian_restaurant',
    cuisineId: 'brazilian',
    photoUrl: 'https://images.unsplash.com/photo-brazilian?w=1200&q=80',
    occasion: 'date-night',
    ambient: 'cozy',
    tags: [],
    whatsapp: null,
    instagramHandle: null,
    brandName: null,
    websites: [],
  },
  {
    id: 2,
    displayName: 'Trattoria Bella Vita',
    formattedAddress: null,
    latitude: -23.5724,
    longitude: -46.6834,
    category: 'italian_restaurant',
    cuisineId: 'pizza_italian',
    photoUrl: 'https://images.unsplash.com/photo-italian?w=1200&q=80',
    occasion: null,
    ambient: null,
    tags: [],
    whatsapp: null,
    instagramHandle: null,
    brandName: null,
    websites: [],
  },
];

afterEach(() => {
  jest.restoreAllMocks();
});

test('maps the nearby-places response into the domain restaurant list', async () => {
  jest.spyOn(repository, 'getNearbyPlaces').mockResolvedValueOnce(RESTAURANTS);

  const { result } = await renderHook(() => useRestaurantsQuery(), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data).toHaveLength(2);
  expect(result.current.data?.[0]).toMatchObject({
    id: 1,
    name: 'Fogo & Brasa',
    cuisine: 'brazilian',
    photo: 'https://images.unsplash.com/photo-brazilian?w=1200&q=80',
  });
});

test('forwards a trimmed query to getNearbyPlaces', async () => {
  const nearbySpy = jest.spyOn(repository, 'getNearbyPlaces').mockResolvedValueOnce([RESTAURANTS[0]]);

  const { result } = await renderHook(() => useRestaurantsQuery(' Fogo '), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(nearbySpy).toHaveBeenCalledWith({ query: 'Fogo' });
  expect(result.current.data).toHaveLength(1);
  expect(result.current.data?.[0].name).toBe('Fogo & Brasa');
});

test('an empty-string query is not forwarded as an empty q param', async () => {
  const nearbySpy = jest.spyOn(repository, 'getNearbyPlaces').mockResolvedValueOnce(RESTAURANTS);

  const { result } = await renderHook(() => useRestaurantsQuery('', { cuisine: 'brazilian', limit: 100 }), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(nearbySpy).toHaveBeenCalledWith({ query: undefined, cuisine: 'brazilian', limit: 100 });
});

test('forwards cuisine/occasion/category/limit filters to getNearbyPlaces and keys the query on them', async () => {
  const nearbySpy = jest.spyOn(repository, 'getNearbyPlaces').mockResolvedValueOnce([RESTAURANTS[0]]);

  const { result } = await renderHook(
    () => useRestaurantsQuery(undefined, { cuisine: 'brazilian', occasion: 'date-night', limit: 100 }),
    { wrapper: createWrapper() },
  );

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(nearbySpy).toHaveBeenCalledWith({
    query: undefined,
    cuisine: 'brazilian',
    occasion: 'date-night',
    limit: 100,
  });
});

test('does not share a cache entry between differently filtered queries', async () => {
  jest.spyOn(repository, 'getNearbyPlaces').mockResolvedValueOnce(RESTAURANTS).mockResolvedValueOnce([RESTAURANTS[0]]);

  const wrapper = createWrapper();
  const unfiltered = await renderHook(() => useRestaurantsQuery(), { wrapper });
  await waitFor(() => expect(unfiltered.result.current.isSuccess).toBe(true));

  const filtered = await renderHook(() => useRestaurantsQuery(undefined, { cuisine: 'brazilian' }), { wrapper });
  await waitFor(() => expect(filtered.result.current.isSuccess).toBe(true));

  expect(unfiltered.result.current.data).toHaveLength(2);
  expect(filtered.result.current.data).toHaveLength(1);
});
