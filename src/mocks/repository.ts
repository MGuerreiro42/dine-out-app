import { mapPrimaryTypeToCuisine } from '@/lib/googlePlaces/mappers';
import { AMBIENTS, BENEFITS, CATEGORY_SUBTYPES, CUISINES, OCCASIONS } from '@/mocks/discoveryTaxonomies';
import { PLACE_DETAILS } from '@/mocks/restaurantDetails';
import { PLACES, photoUrlForMockName } from '@/mocks/restaurants';
import { CURRENT_USER } from '@/mocks/currentUser';

export async function getNearbyPlaces() {
  return { places: PLACES };
}

export async function searchPlaces(textQuery: string) {
  const needle = textQuery.trim().toLowerCase();

  const matches = PLACES.filter((place) => {
    const cuisineLabel = CUISINES.find((c) => c.id === mapPrimaryTypeToCuisine(place.primaryType))?.label ?? '';
    return (
      place.displayName.text.toLowerCase().includes(needle) || cuisineLabel.toLowerCase().includes(needle)
    );
  });

  return { places: matches };
}

export async function getPlaceDetails(id: string) {
  return PLACE_DETAILS[id] ?? null;
}

export async function getPlacePhotoUrl(name: string) {
  const photoUri = photoUrlForMockName(name);
  return photoUri ? { name, photoUri } : null;
}

export async function getDiscoveryTaxonomies() {
  return {
    cuisines: CUISINES,
    occasions: OCCASIONS,
    ambients: AMBIENTS,
    benefits: BENEFITS,
    categorySubtypes: CATEGORY_SUBTYPES,
  };
}

export async function getCurrentUser() {
  return CURRENT_USER;
}
