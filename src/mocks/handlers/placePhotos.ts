import { http, HttpResponse } from 'msw';

import { GOOGLE_PLACES_BASE_URL } from '@/lib/googlePlaces';
import { photoUrlForMockName } from '@/mocks/restaurants';

export const placePhotosHandlers = [
  // Place Photo (New) media endpoint: GET .../photos/{name}/media -> { name, photoUri }.
  http.get(`${GOOGLE_PLACES_BASE_URL}/photos/:name/media`, ({ params }) => {
    const name = String(params.name);
    const photoUri = photoUrlForMockName(name);

    if (!photoUri) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({ name, photoUri });
  }),
];
