import { discoveryTaxonomiesHandlers } from './discoveryTaxonomies';
import { restaurantDetailsHandlers } from './restaurantDetails';
import { restaurantsHandlers } from './restaurants';

export const handlers = [...restaurantsHandlers, ...restaurantDetailsHandlers, ...discoveryTaxonomiesHandlers];
