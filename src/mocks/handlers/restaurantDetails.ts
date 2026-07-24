import { http, HttpResponse } from 'msw';

import { GOOGLE_PLACES_BASE_URL } from '@/lib/googlePlaces';
import { PLACE_DETAILS } from '@/mocks/restaurantDetails';

export const restaurantDetailsHandlers = [
  // Place Details (New) shape: GET .../places/{id} -> a single raw Place object.
  http.get(`${GOOGLE_PLACES_BASE_URL}/places/:id`, ({ params }) => {
    const id = String(params.id);
    const place = PLACE_DETAILS[id];

    if (!place) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(place);
  }),
];
