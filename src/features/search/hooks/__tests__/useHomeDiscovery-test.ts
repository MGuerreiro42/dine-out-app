import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import React from 'react';

import { useHomeDiscovery } from '@/features/search/hooks/useHomeDiscovery';
import type { DiscoveryTaxonomies } from '@/features/search/types';
import type { RestaurantSummary } from '@/lib/api';
import * as repository from '@/mocks/repository';
import { FALLBACK_LOCATION, useLocationStore } from '@/stores/location';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

function makeSummary(id: number, cuisineId: string): RestaurantSummary {
  return {
    id,
    displayName: `Restaurant ${id}`,
    formattedAddress: null,
    latitude: 0,
    longitude: 0,
    category: cuisineId,
    cuisineId,
    photoUrl: 'https://images.unsplash.com/photo-placeholder?w=1200&q=80',
    occasion: null,
    ambient: null,
    tags: [],
    whatsapp: null,
    instagramHandle: null,
    brandName: null,
    websites: [],
  };
}

const TAXONOMIES: DiscoveryTaxonomies = {
  cuisines: [
    { id: 'italian', label: 'Italian', photos: [] },
    { id: 'japanese', label: 'Japanese', photos: [] },
    { id: 'mexican', label: 'Mexican', photos: [] },
  ],
  occasions: [],
  ambients: [],
  benefits: [],
  categorySubtypes: {},
};

// 'italian' is `cuisines[0]`, so it's the default active chip and gets excluded from
// spotlight eligibility — anchor A includes it (to exercise that exclusion) plus two
// other cuisines so both remaining slots are filled deterministically.
const ANCHOR_A_RESULTS = [makeSummary(1, 'italian'), makeSummary(2, 'japanese'), makeSummary(3, 'mexican')];
const ANCHOR_B_RESULTS = [makeSummary(4, 'japanese')];

afterEach(() => {
  useLocationStore.setState({
    ...FALLBACK_LOCATION,
    label: 'Location unavailable',
    address: 'Location unavailable',
    status: 'fallback',
    source: 'gps',
    radiusKm: 10,
  });
  jest.restoreAllMocks();
});

test('re-picks spotlights against the new restaurant set when the radius/location anchor changes', async () => {
  jest.spyOn(repository, 'getDiscoveryTaxonomies').mockResolvedValue(TAXONOMIES);
  const nearbySpy = jest
    .spyOn(repository, 'getNearbyPlaces')
    .mockResolvedValueOnce(ANCHOR_A_RESULTS)
    .mockResolvedValueOnce(ANCHOR_B_RESULTS);

  const { result } = await renderHook(() => useHomeDiscovery(), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isLoading).toBe(false));
  await waitFor(() => expect(result.current.spotlights.length).toBeGreaterThan(0));

  expect(result.current.spotlights.map((s) => s.cuisineId).sort()).toEqual(['japanese', 'mexican']);

  await act(async () => {
    useLocationStore.setState({ radiusKm: 100 });
  });

  await waitFor(() => expect(nearbySpy).toHaveBeenCalledTimes(2));
  await waitFor(() => expect(result.current.spotlights.map((s) => s.cuisineId)).toEqual(['japanese']));
});

test('does not reshuffle the spotlight pick on a same-anchor refetch', async () => {
  jest.spyOn(repository, 'getDiscoveryTaxonomies').mockResolvedValue(TAXONOMIES);
  jest.spyOn(repository, 'getNearbyPlaces').mockResolvedValue(ANCHOR_A_RESULTS);

  const { result } = await renderHook(() => useHomeDiscovery(), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isLoading).toBe(false));
  await waitFor(() => expect(result.current.spotlights.length).toBeGreaterThan(0));

  const firstPick = result.current.spotlights.map((s) => s.cuisineId);

  await act(async () => {
    await result.current.refetch();
  });

  await waitFor(() => expect(result.current.spotlights.map((s) => s.cuisineId)).toEqual(firstPick));
});
