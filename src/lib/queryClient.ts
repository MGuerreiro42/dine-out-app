import { QueryClient } from '@tanstack/react-query';

import { COLD_START_RETRY_COUNT, coldStartRetryDelay } from './coldStartRetry';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      // Only queries (reads) retry this aggressively — mutations (signup, favorite
      // toggles, etc.) keep the library default so a cold-start retry can't double up
      // a side-effecting request.
      retry: COLD_START_RETRY_COUNT,
      retryDelay: coldStartRetryDelay,
    },
  },
});
