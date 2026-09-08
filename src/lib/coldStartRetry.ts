// TEMPORARY: dine-out-backend currently runs on Render's free tier, which spins its
// instance down after inactivity and takes up to ~60s to cold-start back up. During
// that window, requests either hang until the instance answers or bounce off Render's
// proxy with a fast 502/503 while it's mid-restart. TanStack Query's built-in default
// (1 retry, ~1s backoff) gives up long before a cold start finishes, surfacing
// "Couldn't load X." to testers who have no way to know it's just the dev backend
// waking up, not a real failure.
//
// This module exists only to ride out that window, and is deliberately isolated from
// queryClient.ts's own logic: delete this file and its two-line usage there once
// dine-out-backend moves to an always-on host — at that point the library's own
// defaults are enough and this stops being needed.

export const COLD_START_RETRY_COUNT = 5;

// 1s, 2s, 4s, 8s, 8s of backoff between attempts (~23s), on top of each attempt's own
// network timeout — comfortably covers a cold start even in the worst case where every
// attempt hangs for the full timeout instead of failing fast with a 502/503.
export function coldStartRetryDelay(attemptIndex: number): number {
  return Math.min(1000 * 2 ** attemptIndex, 8000);
}
