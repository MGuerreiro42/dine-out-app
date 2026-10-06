import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import React from 'react';

import { useCurrentUserQuery } from '@/features/profile/api/useCurrentUserQuery';
import * as usersApi from '@/lib/api/users';
import { useAuthStore } from '@/stores/auth';

const ANA = { id: 1, name: 'Ana', email: 'ana@example.com' };
const BRUNO = { id: 2, name: 'Bruno', email: 'bruno@example.com' };

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 5 * 60 * 1000 } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

async function logIn(user: typeof ANA) {
  await act(async () => {
    useAuthStore.setState({ status: 'authenticated', isLoggedIn: true, user, accessToken: 'token' });
  });
}

afterEach(() => {
  useAuthStore.setState({ status: 'hydrating', isLoggedIn: false, user: null, accessToken: null });
  jest.restoreAllMocks();
});

test("a different user logging in within the stale window never sees the previous user's profile", async () => {
  let resolveBruno: (user: typeof BRUNO) => void = () => {};
  jest
    .spyOn(usersApi, 'getCurrentUser')
    .mockResolvedValueOnce(ANA)
    .mockReturnValueOnce(new Promise((resolve) => (resolveBruno = resolve)));
  await logIn(ANA);
  const { result } = await renderHook(() => useCurrentUserQuery(), { wrapper: createWrapper() });
  await waitFor(() => expect(result.current.data?.name).toBe('Ana'));

  await act(async () => {
    useAuthStore.setState({ status: 'guest', isLoggedIn: false, user: null, accessToken: null });
  });
  await logIn(BRUNO);

  expect(result.current.data).toBeUndefined();

  await act(async () => resolveBruno(BRUNO));

  await waitFor(() => expect(result.current.data).toMatchObject({ name: 'Bruno', email: 'bruno@example.com', initial: 'B' }));
});
