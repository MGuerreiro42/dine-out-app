import { pickSpotlights } from '@/features/search/lib/pickSpotlights';
import type { Cuisine } from '@/features/search/types';
import type { Restaurant } from '@/types';

function makeRestaurant(id: number, cuisine: string): Restaurant {
  return {
    id,
    name: `Restaurant ${id}`,
    photo: null,
    rating: null,
    priceLevel: null,
    cuisine,
    occasion: null,
    ambient: null,
    latitude: 0,
    longitude: 0,
    reviewCount: null,
  };
}

function makeCuisine(id: string): Cuisine {
  return { id, label: id.charAt(0).toUpperCase() + id.slice(1), photos: [] };
}

const cuisines = [makeCuisine('italian'), makeCuisine('japanese'), makeCuisine('mexican'), makeCuisine('indian')];
const restaurants = [
  makeRestaurant(1, 'italian'),
  makeRestaurant(2, 'japanese'),
  makeRestaurant(3, 'mexican'),
  // 'indian' has no matching restaurant
];

const alwaysFirst = () => 0;

test('deterministically picks the first two eligible cuisines when random always selects index 0', () => {
  const spotlights = pickSpotlights(restaurants, cuisines, null, alwaysFirst);

  expect(spotlights.map((s) => s.cuisineId)).toEqual(['italian', 'japanese']);
  expect(spotlights[0].title).toBe('Best of Italian');
  expect(spotlights[1].title).toBe('Best of Japanese');
});

test('excludes the currently active cuisine', () => {
  const spotlights = pickSpotlights(restaurants, cuisines, 'italian', alwaysFirst);

  expect(spotlights.map((s) => s.cuisineId)).toEqual(['japanese', 'mexican']);
});

test('excludes cuisines with zero matching restaurants', () => {
  const spotlights = pickSpotlights(restaurants, cuisines, null, alwaysFirst);

  expect(spotlights.some((s) => s.cuisineId === 'indian')).toBe(false);
});

test('excludes the catch-all "restaurant" cuisine bucket even when it has matches', () => {
  const cuisinesWithCatchAll = [makeCuisine('restaurant'), ...cuisines];
  const restaurantsWithCatchAll = [makeRestaurant(4, 'restaurant'), ...restaurants];

  const spotlights = pickSpotlights(restaurantsWithCatchAll, cuisinesWithCatchAll, null, alwaysFirst);

  expect(spotlights.some((s) => s.cuisineId === 'restaurant')).toBe(false);
  expect(spotlights.map((s) => s.cuisineId)).toEqual(['italian', 'japanese']);
});

test('returns a single spotlight when only one cuisine is eligible', () => {
  const oneMatch = [makeRestaurant(1, 'italian')];
  const spotlights = pickSpotlights(oneMatch, cuisines, null, alwaysFirst);

  expect(spotlights.map((s) => s.cuisineId)).toEqual(['italian']);
});

test('returns an empty array when no cuisine is eligible', () => {
  const spotlights = pickSpotlights([], cuisines, null, alwaysFirst);

  expect(spotlights).toEqual([]);
});

test('returns at most two spotlights even with many eligible cuisines', () => {
  const spotlights = pickSpotlights(restaurants, cuisines, null, alwaysFirst);

  expect(spotlights).toHaveLength(2);
});
