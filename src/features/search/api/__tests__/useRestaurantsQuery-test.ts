import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import React from 'react';

import { useRestaurantsQuery } from '@/features/search/api/useRestaurantsQuery';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

test('resolves the restaurant list through MSW', async () => {
  const { result } = await renderHook(() => useRestaurantsQuery(), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data?.length).toBeGreaterThan(0);
  expect(result.current.data?.[0]).toMatchObject({ id: expect.any(Number), name: expect.any(String) });
});
