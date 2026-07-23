import { QueryClient } from '@tanstack/react-query';

// staleTime: mostly-static discovery data, no reason to refetch on every screen focus.
// retry: reduced from TanStack Query's default of 3 — while this app talks to MSW (not a
// real backend), a failure is almost always a deterministic bug, not a transient network
// blip, so failing fast beats retrying silently for several seconds. Revisit (raise back up)
// once a real, occasionally-flaky backend exists.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});
