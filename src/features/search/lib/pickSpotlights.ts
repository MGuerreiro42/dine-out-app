import type { Cuisine } from '@/features/search/types';
import type { Restaurant } from '@/types';

export type Spotlight = {
  cuisineId: string;
  label: string;
  title: string;
};

const SPOTLIGHT_COUNT = 2;

// 'restaurant' is a catch-all bucket ("Restaurants") — every row in this app is a
// restaurant, so a section titled "Best of Restaurants" reads like a labeling bug,
// not a curated pick. Excluded from spotlight eligibility.
const INELIGIBLE_CUISINE_IDS = new Set(['restaurant']);

// Every template must read naturally against every real cuisine label (`GET /taxonomies`),
// including non-adjective labels like "Buffet" — "Trending in Buffet"/"Popular in Buffet"
// read wrong, so templates avoid a preposition that assumes an adjectival cuisine name.
const TITLE_TEMPLATES = ['Best of {cuisine}', 'Trending {cuisine}', 'Top Rated {cuisine}', 'Popular {cuisine}'];

export function pickSpotlights(
  restaurants: Restaurant[],
  cuisines: Cuisine[],
  excludeCuisineId: string | null,
  random: () => number = Math.random,
): Spotlight[] {
  const pool = cuisines.filter(
    (cuisine) =>
      cuisine.id !== excludeCuisineId &&
      !INELIGIBLE_CUISINE_IDS.has(cuisine.id) &&
      restaurants.some((r) => r.cuisine === cuisine.id),
  );

  const picked: Cuisine[] = [];
  while (picked.length < SPOTLIGHT_COUNT && pool.length > 0) {
    const index = Math.floor(random() * pool.length);
    picked.push(...pool.splice(index, 1));
  }

  return picked.map((cuisine) => ({
    cuisineId: cuisine.id,
    label: cuisine.label,
    title: TITLE_TEMPLATES[Math.floor(random() * TITLE_TEMPLATES.length)].replace('{cuisine}', cuisine.label),
  }));
}
