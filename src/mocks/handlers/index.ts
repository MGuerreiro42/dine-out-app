import { discoveryTaxonomiesHandlers } from './discoveryTaxonomies';
import { placePhotosHandlers } from './placePhotos';
import { restaurantDetailsHandlers } from './restaurantDetails';
import { restaurantsHandlers } from './restaurants';

export const handlers = [
  ...restaurantsHandlers,
  ...restaurantDetailsHandlers,
  ...placePhotosHandlers,
  ...discoveryTaxonomiesHandlers,
];
