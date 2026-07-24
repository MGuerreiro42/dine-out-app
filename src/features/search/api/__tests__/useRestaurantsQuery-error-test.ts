import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import React from 'react';

import { useRestaurantsQuery } from '@/features/search/api/useRestaurantsQuery';
import { GOOGLE_PLACES_BASE_URL } from '@/lib/googlePlaces';
import { server } from '@/mocks/native';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

test('surfaces a query error when the endpoint returns a server error', async () => {
  server.use(
    http.post(`${GOOGLE_PLACES_BASE_URL}/places\\:searchNearby`, () => new HttpResponse(null, { status: 500 })),
  );

  const { result } = await renderHook(() => useRestaurantsQuery(), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isError).toBe(true));

  expect(result.current.data).toBeUndefined();
});
