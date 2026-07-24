import { http, HttpResponse } from 'msw';

import { GOOGLE_PLACES_BASE_URL } from '@/lib/googlePlaces';
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
];
