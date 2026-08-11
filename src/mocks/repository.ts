// Imported from the concrete module, not the @/lib/googlePlaces barrel —
// the barrel re-exports client.ts, which imports this file's own
// getPlacePhotoUrl, so going through it here would close a require cycle
// (index.ts -> client.ts -> repository.ts -> index.ts).
import { mapPrimaryTypeToCuisine } from '@/lib/googlePlaces/mappers';
import { AMBIENTS, BENEFITS, CATEGORY_SUBTYPES, CUISINES, OCCASIONS, VENUE_TYPES } from '@/mocks/discoveryTaxonomies';
import { PLACE_DETAILS } from '@/mocks/restaurantDetails';
import { PLACES, photoUrlForMockName } from '@/mocks/restaurants';
import { CURRENT_USER } from '@/mocks/currentUser';

/**
 * Static, in-process stand-in for the not-yet-built backend — plain async
 * functions the query hooks call directly, no fetch/HTTP layer to simulate.
 * Replaced MSW's network-level interception (see PROJECT.md's ADR log for
 * why); when a real NestJS backend exists, these function bodies become
 * real fetch calls with the query hooks' signatures unchanged.
 */

export async function getNearbyPlaces() {
  // Real Nearby Search filters by the request body's locationRestriction;
  // this mock ignores it and always returns the full seeded set.
  return { places: PLACES };
}

export async function searchPlaces(textQuery: string) {
  // Google's real Nearby Search has no free-text query support at all —
  // Text Search is a genuinely separate endpoint (see PROJECT.md's ADR
  // log) — so text filtering is mocked here, not bolted onto
  // getNearbyPlaces above.
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
    venueTypes: VENUE_TYPES,
    benefits: BENEFITS,
    categorySubtypes: CATEGORY_SUBTYPES,
  };
}

export async function getCurrentUser() {
  return CURRENT_USER;
}
