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

test('derives distance, tagline, tags, and open status for the map result list', async () => {
  jest.spyOn(repository, 'getNearbyPlaces').mockResolvedValueOnce(RESTAURANTS);
  jest.spyOn(repository, 'getDiscoveryTaxonomies').mockResolvedValueOnce(TAXONOMIES);

  const { result } = await renderHook(() => useSearchMapDiscovery(), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(result.current.restaurants.length).toBeGreaterThan(0);
  expect(result.current.results.length).toBe(result.current.restaurants.length);
  expect(result.current.results[0]).toMatchObject({
    id: expect.any(Number),
    cuisineLabel: 'Brazilian',
    distance: expect.stringMatching(/^\d+\.\d km$/),
    tagline: expect.any(String),
    tags: expect.arrayContaining([expect.any(String)]),
    isOpenNow: expect.any(Boolean),
  });
});
