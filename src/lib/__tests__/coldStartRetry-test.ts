import { COLD_START_RETRY_COUNT, coldStartRetryDelay } from '@/lib/coldStartRetry';

test('backs off with enough total delay to ride out a Render free-tier cold start', () => {
  const delays = Array.from({ length: COLD_START_RETRY_COUNT }, (_, i) => coldStartRetryDelay(i));

  expect(delays).toEqual([1000, 2000, 4000, 8000, 8000]);

  const totalBackoffMs = delays.reduce((sum, delay) => sum + delay, 0);
  expect(totalBackoffMs).toBeGreaterThanOrEqual(20_000);
});

test('caps the delay instead of growing unbounded on further attempts', () => {
  expect(coldStartRetryDelay(10)).toBe(8000);
});
