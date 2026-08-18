import { z } from 'zod';

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
  location: z.object({ latitude: z.number(), longitude: z.number() }),
  rating: z.number(),
  userRatingCount: z.number(),
  priceLevel: GooglePriceLevelSchema,
  primaryType: z.string(),
  types: z.array(z.string()),
  photos: z.array(GooglePlacePhotoSchema),
});
export type GooglePlace = z.infer<typeof GooglePlaceSchema>;

export const AppPlaceSchema = GooglePlaceSchema.extend({
  occasion: z.string(),
  ambient: z.string(),
});
export type AppPlace = z.infer<typeof AppPlaceSchema>;

export const NearbySearchResponseSchema = z.object({
  places: z.array(AppPlaceSchema),
});

export const GoogleOpeningHoursSchema = z.object({
  weekdayDescriptions: z.array(z.string()),
});

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

export const GoogleReviewSchema = z.object({
  relativePublishTimeDescription: z.string(),
  rating: z.number(),
  text: z.object({ text: z.string(), languageCode: z.string() }),
  authorAttribution: z.object({ displayName: z.string() }),
});

export const PlaceDetailsSchema = AppPlaceSchema.extend({
  editorialSummary: z.object({ text: z.string(), languageCode: z.string() }),
  tags: z.array(z.string()),
  menu: z.array(z.object({ name: z.string(), price: z.string() })),
  internationalPhoneNumber: z.string(),
  regularOpeningHours: GoogleOpeningHoursSchema,
  whatsapp: z.string(),
  instagramHandle: z.string(),
  instagramPhotos: z.array(z.string()),
  thingsToKnow: z.array(z.object({ title: z.string(), text: z.string() })),
  reviews: z.array(GoogleReviewSchema),
  highlights: z.array(z.object({ title: z.string(), description: z.string() })),
}).extend(GoogleAmenityFieldsSchema.shape);
export type PlaceDetails = z.infer<typeof PlaceDetailsSchema>;

export const PhotoMediaResponseSchema = z.object({
  name: z.string(),
  photoUri: z.string(),
});
