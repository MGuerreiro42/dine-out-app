import { http, HttpResponse } from 'msw';

import { RESTAURANTS } from '@/mocks/restaurants';

export const restaurantsHandlers = [
  http.get('https://api.restaurante.app/restaurants', () => {
    return HttpResponse.json(RESTAURANTS);
  }),
];
