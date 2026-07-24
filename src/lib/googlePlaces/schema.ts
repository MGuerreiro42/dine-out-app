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

/** Also custom, also not part of Google's contract: our own menu/tags data. */
export const PlaceDetailsSchema = AppPlaceSchema.extend({
  editorialSummary: z.object({ text: z.string(), languageCode: z.string() }),
  tags: z.array(z.string()),
  menu: z.array(z.object({ name: z.string(), price: z.string() })),
});
export type PlaceDetails = z.infer<typeof PlaceDetailsSchema>;

export const PhotoMediaResponseSchema = z.object({
  name: z.string(),
  photoUri: z.string(),
});
