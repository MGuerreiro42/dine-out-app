import { http, HttpResponse } from 'msw';

import { AMBIENTS, BENEFITS, CUISINES, OCCASIONS } from '@/mocks/discoveryTaxonomies';

export const discoveryTaxonomiesHandlers = [
  http.get('https://api.restaurante.app/discovery-taxonomies', () => {
    return HttpResponse.json({
      cuisines: CUISINES,
      occasions: OCCASIONS,
      ambients: AMBIENTS,
      benefits: BENEFITS,
    });
  }),
];
