import { http, HttpResponse } from 'msw';

import { CURRENT_USER } from '@/mocks/currentUser';

export const currentUserHandlers = [
  http.get('https://api.restaurante.app/current-user', () => {
    return HttpResponse.json(CURRENT_USER);
  }),
];
