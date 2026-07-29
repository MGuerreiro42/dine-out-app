import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import React from 'react';

import { useSearchMapDiscovery } from '@/features/search/hooks/useSearchMapDiscovery';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

test('derives distance, tagline, tags, and open status for the map result list', async () => {
  const { result } = await renderHook(() => useSearchMapDiscovery(), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(result.current.restaurants.length).toBeGreaterThan(0);
  expect(result.current.results.length).toBe(result.current.restaurants.length);
  expect(result.current.results[0]).toMatchObject({
    id: expect.any(Number),
    cuisineLabel: expect.any(String),
    distance: expect.stringMatching(/^\d+\.\d km$/),
    tagline: expect.any(String),
    tags: expect.arrayContaining([expect.any(String)]),
    isOpenNow: expect.any(Boolean),
  });
});
