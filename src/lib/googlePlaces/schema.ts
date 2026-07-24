import { z } from 'zod';

/**
 * Wire-contract schemas mirroring Google Places API (New)'s actual response
 * shapes (checked against current docs, not assumed) — see PROJECT.md's ADR
 * log for why. These are deliberately separate from src/types/restaurant.ts
 * and src/features/restaurant/types/: the wire contract can drift from or
 * get replaced independently of our internal domain model, which is the
 * whole point of normalizing at the query-hook boundary (see mappers.ts).
 */

export const GooglePriceLevelSchema = z.enum([
  'PRICE_LEVEL_UNSPECIFIED',
  'PRICE_LEVEL_FREE',
  'PRICE_LEVEL_INEXPENSIVE',
  'PRICE_LEVEL_MODERATE',
  'PRICE_LEVEL_EXPENSIVE',
  'PRICE_LEVEL_VERY_EXPENSIVE',
]);
export type GooglePriceLevel = z.infer<typeof GooglePriceLevelSchema>;

export const GooglePlacePhotoSchema = z.object({
  name: z.string(),
  widthPx: z.number(),
  heightPx: z.number(),
});

export const GooglePlaceSchema = z.object({
  id: z.string(),
  displayName: z.object({ text: z.string(), languageCode: z.string() }),
  formattedAddress: z.string(),
  rating: z.number(),
  userRatingCount: z.number(),
  priceLevel: GooglePriceLevelSchema,
  primaryType: z.string(),
  types: z.array(z.string()),
  photos: z.array(GooglePlacePhotoSchema),
});
export type GooglePlace = z.infer<typeof GooglePlaceSchema>;

/**
 * Our mock (and, later, our own backend-for-frontend) bolts these two
 * product-specific discovery filters onto the proxied Google response.
 * They are NOT part of Google's real Place contract — kept as a separate
 * extension so that distinction stays visible in the schema itself.
 */
export const AppPlaceSchema = GooglePlaceSchema.extend({
  occasion: z.string(),
  ambient: z.string(),
});
export type AppPlace = z.infer<typeof AppPlaceSchema>;

export const NearbySearchResponseSchema = z.object({
  places: z.array(AppPlaceSchema),
});

/**
 * Real Google fields relevant to "practical info before committing" (opening
 * hours, phone, amenities) — a curated subset of Place's actual boolean
 * amenity fields, not all of them.
 */
export const GoogleOpeningHoursSchema = z.object({
  weekdayDescriptions: z.array(z.string()),
});

/**
 * Google's real boolean amenity fields are flat, top-level fields on Place —
 * kept flat here too, not grouped, for the same reason.
 */
export const GoogleAmenityFieldsSchema = z.object({
  delivery: z.boolean(),
  takeout: z.boolean(),
  dineIn: z.boolean(),
  reservable: z.boolean(),
  outdoorSeating: z.boolean(),
  liveMusic: z.boolean(),
  goodForGroups: z.boolean(),
  goodForChildren: z.boolean(),
  allowsDogs: z.boolean(),
  wheelchairAccessibleEntrance: z.boolean(),
  servesVegetarianFood: z.boolean(),
  restroom: z.boolean(),
});
export type GoogleAmenityFields = z.infer<typeof GoogleAmenityFieldsSchema>;

/** Real Google Review shape — an exact match for our own Review entity. */
export const GoogleReviewSchema = z.object({
  relativePublishTimeDescription: z.string(),
  rating: z.number(),
  text: z.object({ text: z.string(), languageCode: z.string() }),
  authorAttribution: z.object({ displayName: z.string() }),
});

/** Also custom, also not part of Google's contract: our own menu/tags/thingsToKnow/highlights data. */
export const PlaceDetailsSchema = AppPlaceSchema.extend({
  editorialSummary: z.object({ text: z.string(), languageCode: z.string() }),
  tags: z.array(z.string()),
  menu: z.array(z.object({ name: z.string(), price: z.string() })),
  internationalPhoneNumber: z.string(),
  regularOpeningHours: GoogleOpeningHoursSchema,
  whatsapp: z.string(),
  instagramHandle: z.string(),
  // Plain URLs, not routed through the photo-reference two-hop flow that
  // mirrors Google's real photo contract — Instagram has no such contract
  // to mirror here, so simulating a fake two-hop would add nothing.
  instagramPhotos: z.array(z.string()),
  thingsToKnow: z.array(z.object({ title: z.string(), text: z.string() })),
  reviews: z.array(GoogleReviewSchema),
  highlights: z.array(z.string()),
}).extend(GoogleAmenityFieldsSchema.shape);
export type PlaceDetails = z.infer<typeof PlaceDetailsSchema>;

export const PhotoMediaResponseSchema = z.object({
  name: z.string(),
  photoUri: z.string(),
});
