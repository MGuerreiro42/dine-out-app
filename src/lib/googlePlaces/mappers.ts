import type { AppPlace, GooglePriceLevel } from '@/lib/googlePlaces/schema';
import type { Restaurant } from '@/types';

const CUISINE_BY_PRIMARY_TYPE: Record<string, string> = {
  brazilian_restaurant: 'churrasco',
  mediterranean_restaurant: 'mediterraneo',
  italian_restaurant: 'italiana',
  indian_restaurant: 'indiana',
  chinese_restaurant: 'chinesa',
};

const PRICE_LEVEL_TO_DISPLAY: Record<GooglePriceLevel, string> = {
  PRICE_LEVEL_UNSPECIFIED: '$',
  PRICE_LEVEL_FREE: '$',
  PRICE_LEVEL_INEXPENSIVE: '$',
  PRICE_LEVEL_MODERATE: '$$',
  PRICE_LEVEL_EXPENSIVE: '$$$',
  PRICE_LEVEL_VERY_EXPENSIVE: '$$$$',
};

export function mapPrimaryTypeToCuisine(primaryType: string): string {
  const cuisine = CUISINE_BY_PRIMARY_TYPE[primaryType];
  if (!cuisine) {
    throw new Error(`No cuisine mapping for Google primaryType "${primaryType}"`);
  }
  return cuisine;
}

export function mapPriceLevel(priceLevel: GooglePriceLevel): string {
  return PRICE_LEVEL_TO_DISPLAY[priceLevel];
}

/** Maps the wire-contract shape to our internal, unchanged `Restaurant` type. */
export function mapPlaceToRestaurant(place: AppPlace, photoUrl: string): Restaurant {
  return {
    id: Number(place.id),
    name: place.displayName.text,
    photo: photoUrl,
    rating: place.rating.toFixed(1),
    priceLevel: mapPriceLevel(place.priceLevel),
    cuisine: mapPrimaryTypeToCuisine(place.primaryType),
    occasion: place.occasion,
    ambient: place.ambient,
  };
}
