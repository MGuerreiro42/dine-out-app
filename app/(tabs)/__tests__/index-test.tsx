import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import React from 'react';

import * as repository from '@/mocks/repository';
import { useLocationStore } from '@/stores/location';

import HomeScreen from '../index';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), canGoBack: () => false, replace: jest.fn() }),
}));

// Home doesn't render either of these, but both are re-exported from the same
// `features/search/components` barrel and pull in native map/reanimated modules
// that aren't set up in this Jest environment.
jest.mock('@/features/search/components/MapResultsSheet', () => ({ MapResultsSheet: () => null }));
jest.mock('@/features/search/components/SearchMapView', () => ({ SearchMapView: () => null }));

const TAXONOMIES = {
  cuisines: [],
  occasions: [],
  ambients: [],
  benefits: [],
  categorySubtypes: {},
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

afterEach(() => {
  useLocationStore.setState({ radiusKm: 10 });
  jest.restoreAllMocks();
});

test('renders the empty state with a radius-expansion CTA when below the max radius', async () => {
  jest.spyOn(repository, 'getNearbyPlaces').mockResolvedValueOnce([]);
  jest.spyOn(repository, 'getDiscoveryTaxonomies').mockResolvedValueOnce(TAXONOMIES);

  await render(<HomeScreen />, { wrapper: createWrapper() });

  await waitFor(() => expect(screen.getByText('No restaurants found near you')).toBeTruthy());

  expect(screen.getByText('Try expanding your search radius.')).toBeTruthy();
  expect(screen.getByText('Expand to 100 km')).toBeTruthy();
});

test('renders a no-CTA empty state once the radius is already at its max', async () => {
  useLocationStore.setState({ radiusKm: 100 });
  jest.spyOn(repository, 'getNearbyPlaces').mockResolvedValueOnce([]);
  jest.spyOn(repository, 'getDiscoveryTaxonomies').mockResolvedValueOnce(TAXONOMIES);

  await render(<HomeScreen />, { wrapper: createWrapper() });

  await waitFor(() => expect(screen.getByText('No restaurants found within 100 km')).toBeTruthy());

  expect(screen.getByText('Try a different location.')).toBeTruthy();
  expect(screen.queryByText('Expand to 100 km')).toBeNull();
});

test('renders the skeleton while the initial fetch is in flight', async () => {
  jest.spyOn(repository, 'getNearbyPlaces').mockReturnValue(new Promise(() => {}));
  jest.spyOn(repository, 'getDiscoveryTaxonomies').mockReturnValue(new Promise(() => {}));

  const { toJSON } = await render(<HomeScreen />, { wrapper: createWrapper() });

  expect(screen.getByText('Search restaurants...')).toBeTruthy();
  expect(screen.queryByText('No restaurants found near you')).toBeNull();
  expect(screen.queryByText("Couldn't load Home.")).toBeNull();

  // `HomeSkeleton` renders each `Skeleton` block as an `Animated.View` whose
  // initial pulse opacity is 0.4 — count those instead of asserting on the
  // literal `className` string, which NativeWind resolves into `style` (not
  // guaranteed to round-trip through a dynamic template string in this
  // native test renderer, unlike on web, where the visual fix is verified).
  const pulseBlockCount = (JSON.stringify(toJSON()).match(/"opacity":0\.4/g) ?? []).length;
  expect(pulseBlockCount).toBeGreaterThan(10);
});
