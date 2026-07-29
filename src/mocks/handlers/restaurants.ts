import { http, HttpResponse } from 'msw';

import { GOOGLE_PLACES_BASE_URL, mapPrimaryTypeToCuisine } from '@/lib/googlePlaces';
import { CUISINES } from '@/mocks/discoveryTaxonomies';
import { PLACES } from '@/mocks/restaurants';

export const restaurantsHandlers = [
  // Nearby Search (New) shape: POST .../places:searchNearby -> { places: [...] }.
  // The ":" is escaped for MSW's path matcher, which otherwise treats it as
  // a path-param marker (see PROJECT.md's ADR log).
  http.post(`${GOOGLE_PLACES_BASE_URL}/places\\:searchNearby`, () => {
    // Real Nearby Search filters by the request body's locationRestriction;
    // this mock ignores it and always returns the full seeded set.
    return HttpResponse.json({ places: PLACES });
  }),

  // Text Search (New) shape: POST .../places:searchText -> { places: [...] }.
  // Google's real Nearby Search has no free-text query support at all —
  // this is a genuinely separate endpoint (see PROJECT.md's ADR log) — so
  // text filtering is mocked here, not bolted onto searchNearby above.
  http.post(`${GOOGLE_PLACES_BASE_URL}/places\\:searchText`, async ({ request }) => {
    const { textQuery } = (await request.json()) as { textQuery: string };
    const needle = textQuery.trim().toLowerCase();

    const matches = PLACES.filter((place) => {
      const cuisineLabel = CUISINES.find((c) => c.id === mapPrimaryTypeToCuisine(place.primaryType))?.label ?? '';
      return (
        place.displayName.text.toLowerCase().includes(needle) || cuisineLabel.toLowerCase().includes(needle)
      );
    });

    return HttpResponse.json({ places: matches });
  }),
];
