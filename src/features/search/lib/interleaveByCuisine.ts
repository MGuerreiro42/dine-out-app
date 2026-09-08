import type { Restaurant } from '@/types';

// "All" mode's ordering: round-robin across cuisines (one from each, cycling) instead
// of raw pool order — a plain distance-sorted pool can cluster same-cuisine
// restaurants together (e.g. a street of bars), which reads as monotonous rather than
// "a bit of everything nearby."
export function interleaveByCuisine<T extends Pick<Restaurant, 'cuisine'>>(items: T[]): T[] {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const group = groups.get(item.cuisine);
    if (group) {
      group.push(item);
    } else {
      groups.set(item.cuisine, [item]);
    }
  }

  const buckets = [...groups.values()];
  const result: T[] = [];
  for (let index = 0; result.length < items.length; index++) {
    for (const bucket of buckets) {
      if (index < bucket.length) {
        result.push(bucket[index]);
      }
    }
  }
  return result;
}
