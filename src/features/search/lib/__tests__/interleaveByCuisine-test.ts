import { interleaveByCuisine } from '@/features/search/lib/interleaveByCuisine';

function item(cuisine: string, tag: string) {
  return { cuisine, tag };
}

test('round-robins across cuisines instead of keeping same-cuisine items clustered', () => {
  const items = [
    item('bar', 'bar-1'),
    item('bar', 'bar-2'),
    item('cafe', 'cafe-1'),
    item('bar', 'bar-3'),
    item('restaurant', 'restaurant-1'),
  ];

  const result = interleaveByCuisine(items).map((i) => i.tag);

  // First pass takes one from each group in order of first appearance (bar, cafe,
  // restaurant); second pass takes the remaining bar items.
  expect(result).toEqual(['bar-1', 'cafe-1', 'restaurant-1', 'bar-2', 'bar-3']);
});

test('preserves every item exactly once', () => {
  const items = Array.from({ length: 7 }, (_, i) => item(['bar', 'cafe', 'restaurant'][i % 3], `item-${i}`));

  const result = interleaveByCuisine(items);

  expect(result).toHaveLength(items.length);
  expect(result.map((i) => i.tag).sort()).toEqual(items.map((i) => i.tag).sort());
});

test('returns an empty array for an empty input without looping', () => {
  expect(interleaveByCuisine([])).toEqual([]);
});
