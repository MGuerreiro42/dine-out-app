import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import React from 'react';

import type { DiscoveryTaxonomies } from '@/features/search/types';
import { useTypeDetail } from '@/features/search/hooks/useTypeDetail';
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

test('cuisine dimension fetches a dedicated, cuisine-scoped, 100-cap batch', async () => {
  const nearbySpy = jest.spyOn(repository, 'getNearbyPlaces').mockResolvedValueOnce(RESTAURANTS);
  jest.spyOn(repository, 'getDiscoveryTaxonomies').mockResolvedValueOnce(TAXONOMIES);

  const { result } = await renderHook(() => useTypeDetail('cuisine', 'brazilian'), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(nearbySpy).toHaveBeenCalledWith({ query: undefined, cuisine: 'brazilian', limit: 100 });
});

test('occasion dimension fetches a dedicated, occasion-scoped, 100-cap batch', async () => {
  const nearbySpy = jest.spyOn(repository, 'getNearbyPlaces').mockResolvedValueOnce(RESTAURANTS);
  jest.spyOn(repository, 'getDiscoveryTaxonomies').mockResolvedValueOnce(TAXONOMIES);

  const { result } = await renderHook(() => useTypeDetail('occasion', 'date-night'), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(nearbySpy).toHaveBeenCalledWith({ query: undefined, occasion: 'date-night', limit: 100 });
});

test('ambient dimension keeps the general, unfiltered fetch', async () => {
  const nearbySpy = jest.spyOn(repository, 'getNearbyPlaces').mockResolvedValueOnce(RESTAURANTS);
  jest.spyOn(repository, 'getDiscoveryTaxonomies').mockResolvedValueOnce(TAXONOMIES);

  const { result } = await renderHook(() => useTypeDetail('ambient', 'cozy'), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(nearbySpy).toHaveBeenCalledWith({ query: undefined });
});

test('a search query on a cuisine page stays scoped to that cuisine', async () => {
  const nearbySpy = jest.spyOn(repository, 'getNearbyPlaces').mockResolvedValueOnce(RESTAURANTS);
  jest.spyOn(repository, 'getDiscoveryTaxonomies').mockResolvedValueOnce(TAXONOMIES);

  const { result } = await renderHook(() => useTypeDetail('cuisine', 'brazilian', 'fogo'), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(nearbySpy).toHaveBeenCalledWith({ query: 'fogo', cuisine: 'brazilian', limit: 100 });
});
