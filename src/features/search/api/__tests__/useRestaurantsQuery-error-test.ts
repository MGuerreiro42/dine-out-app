import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import React from 'react';

import { useRestaurantsQuery } from '@/features/search/api/useRestaurantsQuery';
import * as repository from '@/mocks/repository';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

test('surfaces a query error when the endpoint returns a server error', async () => {
  jest.spyOn(repository, 'getNearbyPlaces').mockRejectedValueOnce(new Error('Internal Server Error'));

  const { result } = await renderHook(() => useRestaurantsQuery(), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isError).toBe(true));

  expect(result.current.data).toBeUndefined();

  jest.restoreAllMocks();
});
