import { distanceKmFrom, distanceLabelFrom } from '@/lib/geo';

const ORIGIN = { latitude: -23.5505, longitude: -46.6333 };
const TARGET = { latitude: -22.9068, longitude: -43.1729 };

test('returns the great-circle distance from the origin', () => {
  expect(distanceKmFrom(ORIGIN, TARGET)).toBeCloseTo(361, 0);
});

test('returns null without an origin', () => {
  expect(distanceKmFrom(null, TARGET)).toBeNull();
  expect(distanceLabelFrom(null, TARGET)).toBeNull();
});

test('formats the distance label from the origin', () => {
  expect(distanceLabelFrom(ORIGIN, TARGET)).toBe('360.7 km');
  expect(distanceLabelFrom(ORIGIN, { latitude: ORIGIN.latitude + 0.004, longitude: ORIGIN.longitude })).toBe('445 m');
});
