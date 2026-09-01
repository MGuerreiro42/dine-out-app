import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import React from 'react';

import type { DiscoveryTaxonomies } from '@/features/search/types';
import { useSearchMapDiscovery } from '@/features/search/hooks/useSearchMapDiscovery';
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
];

const TAXONOMIES: DiscoveryTaxonomies = {
  cuisines: [{ id: 'brazilian', label: 'Brazilian', photos: ['https://example.com/photo.jpg'] }],
  occasions: [{ id: 'date-night', label: 'Date Night', icon: { set: 'Ionicons', name: 'heart-outline' } }],
  ambients: [{ id: 'cozy', label: 'Cozy' }],
  benefits: [],
  categorySubtypes: {},
};

afterEach(() => {
  jest.restoreAllMocks();
});

test('derives distance, tagline, and tags for the map result list', async () => {
  jest.spyOn(repository, 'getNearbyPlaces').mockResolvedValueOnce(RESTAURANTS);
  jest.spyOn(repository, 'getDiscoveryTaxonomies').mockResolvedValueOnce(TAXONOMIES);

  const { result } = await renderHook(() => useSearchMapDiscovery(), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(result.current.restaurants.length).toBeGreaterThan(0);
  expect(result.current.results.length).toBe(result.current.restaurants.length);
  expect(result.current.results[0]).toMatchObject({
    id: expect.any(Number),
    cuisineLabel: 'Brazilian',
    distance: expect.stringMatching(/^(\d+ m|\d+\.\d km)$/),
    tagline: expect.any(String),
    tags: expect.arrayContaining([expect.any(String)]),
  });
});

test('an active cuisine/occasion filter is forwarded to getNearbyPlaces with a 100 cap', async () => {
  const nearbySpy = jest.spyOn(repository, 'getNearbyPlaces').mockResolvedValueOnce(RESTAURANTS);
  jest.spyOn(repository, 'getDiscoveryTaxonomies').mockResolvedValueOnce(TAXONOMIES);

  const { result } = await renderHook(
    () => useSearchMapDiscovery(undefined, { cuisine: 'brazilian', occasion: 'date-night' }),
    { wrapper: createWrapper() },
  );

  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(nearbySpy).toHaveBeenCalledWith({
    query: undefined,
    cuisine: 'brazilian',
    occasion: 'date-night',
    limit: 100,
  });
});

test('no free-text query or filter keeps the default nearby limit', async () => {
  const nearbySpy = jest.spyOn(repository, 'getNearbyPlaces').mockResolvedValueOnce(RESTAURANTS);
  jest.spyOn(repository, 'getDiscoveryTaxonomies').mockResolvedValueOnce(TAXONOMIES);

  const { result } = await renderHook(() => useSearchMapDiscovery(), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(nearbySpy).toHaveBeenCalledWith({ query: undefined });
});

test('a filter-chip change reports isFetching without flipping isLoading back to true, and keeps the previous results visible', async () => {
  jest.spyOn(repository, 'getNearbyPlaces').mockResolvedValueOnce(RESTAURANTS);
  jest.spyOn(repository, 'getDiscoveryTaxonomies').mockResolvedValue(TAXONOMIES);

  const { result, rerender } = await renderHook(
    ({ filters }: { filters?: { cuisine?: string } }) => useSearchMapDiscovery(undefined, filters),
    { wrapper: createWrapper(), initialProps: { filters: undefined as { cuisine?: string } | undefined } },
  );

  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.isFetching).toBe(false);

  let resolveSecondFetch: (value: RestaurantSummary[]) => void = () => {};
  const secondFetch = new Promise<RestaurantSummary[]>((resolve) => {
    resolveSecondFetch = resolve;
  });
  jest.spyOn(repository, 'getNearbyPlaces').mockReturnValueOnce(secondFetch);

  rerender({ filters: { cuisine: 'brazilian' } });

  await waitFor(() => expect(result.current.isFetching).toBe(true));
  expect(result.current.isLoading).toBe(false);
  expect(result.current.results.length).toBeGreaterThan(0);

  resolveSecondFetch(RESTAURANTS);

  await waitFor(() => expect(result.current.isFetching).toBe(false));
});
