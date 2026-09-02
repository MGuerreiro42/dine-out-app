import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import React from 'react';

import { HOME_SECTION_LIMIT, useHomeDiscovery } from '@/features/search/hooks/useHomeDiscovery';
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

// Each Home section (pool, active cuisine, each spotlight) now fires its own
// getNearbyPlaces call, filtered server-side by `cuisine` — mirror that filtering here
// instead of the old one-call-per-render assumption. Anchor selection is keyed off
// radiusKm since (like the real backend) getNearbyPlaces itself reads the location
// anchor from the store rather than receiving it as a param.
function mockNearbyByAnchor(anchorA: RestaurantSummary[], anchorB: RestaurantSummary[]) {
  return jest.spyOn(repository, 'getNearbyPlaces').mockImplementation(async (params) => {
    const pool = useLocationStore.getState().radiusKm >= 100 ? anchorB : anchorA;
    return params?.cuisine ? pool.filter((r) => r.cuisineId === params.cuisine) : pool;
  });
}

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
  mockNearbyByAnchor(ANCHOR_A_RESULTS, ANCHOR_B_RESULTS);

  const { result } = await renderHook(() => useHomeDiscovery(), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isLoading).toBe(false));
  await waitFor(() => expect(result.current.spotlights.length).toBeGreaterThan(0));

  expect(result.current.spotlights.map((s) => s.cuisineId).sort()).toEqual(['japanese', 'mexican']);

  await act(async () => {
    useLocationStore.setState({ radiusKm: 100 });
  });

  // Anchor B only has a 'japanese' restaurant, so 'mexican' is no longer eligible —
  // this also confirms the spotlight settles to its own independent query's result,
  // not the (now stale) previous anchor's data.
  await waitFor(() => expect(result.current.spotlights.map((s) => s.cuisineId)).toEqual(['japanese']));
});

test('does not reshuffle the spotlight pick on a same-anchor refetch', async () => {
  jest.spyOn(repository, 'getDiscoveryTaxonomies').mockResolvedValue(TAXONOMIES);
  mockNearbyByAnchor(ANCHOR_A_RESULTS, ANCHOR_A_RESULTS);

  const { result } = await renderHook(() => useHomeDiscovery(), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isLoading).toBe(false));
  await waitFor(() => expect(result.current.spotlights.length).toBeGreaterThan(0));

  const firstPick = result.current.spotlights.map((s) => s.cuisineId);

  await act(async () => {
    await result.current.refetch();
  });

  await waitFor(() => expect(result.current.spotlights.map((s) => s.cuisineId)).toEqual(firstPick));
});

test('fetches the pool, the active cuisine, and each spotlight independently, all capped at HOME_SECTION_LIMIT', async () => {
  jest.spyOn(repository, 'getDiscoveryTaxonomies').mockResolvedValue(TAXONOMIES);
  const nearbySpy = mockNearbyByAnchor(ANCHOR_A_RESULTS, ANCHOR_A_RESULTS);

  const { result } = await renderHook(() => useHomeDiscovery(), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isLoading).toBe(false));
  await waitFor(() => expect(result.current.cuisineListLoading).toBe(false));
  await waitFor(() => expect(result.current.spotlights.every((s) => !s.isLoading)).toBe(true));

  const cuisinesRequested = new Set(nearbySpy.mock.calls.map(([params]) => params?.cuisine ?? null));
  // The pool (no cuisine filter), the active cuisine ('italian'), and both spotlight
  // picks ('japanese', 'mexican') — 4 independent requests, not 1 shared one.
  expect(cuisinesRequested).toEqual(new Set([null, 'italian', 'japanese', 'mexican']));

  for (const [params] of nearbySpy.mock.calls) {
    expect(params?.limit).toBe(HOME_SECTION_LIMIT);
  }
});
