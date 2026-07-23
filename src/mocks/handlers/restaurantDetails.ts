import { http, HttpResponse } from 'msw';

import { RESTAURANT_DETAILS } from '@/mocks/restaurantDetails';

export const restaurantDetailsHandlers = [
  http.get('https://api.restaurante.app/restaurants/:id', ({ params }) => {
    const id = Number(params.id);
    const restaurant = RESTAURANT_DETAILS[id];

    if (!restaurant) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(restaurant);
  }),
];
