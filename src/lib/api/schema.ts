import { z } from 'zod';

export const RestaurantSummarySchema = z.object({
  id: z.number(),
  displayName: z.string(),
  formattedAddress: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  category: z.string(),
  cuisineId: z.string(),
  photoUrl: z.string(),
  occasion: z.string().nullable(),
  ambient: z.string().nullable(),
  tags: z.array(z.string()),
  whatsapp: z.string().nullable(),
  instagramHandle: z.string().nullable(),
});
export type RestaurantSummary = z.infer<typeof RestaurantSummarySchema>;

export const RestaurantsResponseSchema = z.array(RestaurantSummarySchema);

export const MenuItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.string(),
  category: z.string(),
  isAvailable: z.boolean(),
});

export const ThingToKnowSchema = z.object({
  id: z.number(),
  title: z.string(),
  text: z.string(),
});

export const HighlightSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
});

export const RestaurantDetailSchema = RestaurantSummarySchema.extend({
  menuItems: z.array(MenuItemSchema),
  thingsToKnow: z.array(ThingToKnowSchema),
  highlights: z.array(HighlightSchema),
  phones: z.array(z.string()),
  websites: z.array(z.string()),
  socialLinks: z.array(z.string()),
  categoryAlternates: z.array(z.string()),
  categoryHierarchy: z.array(z.string()),
  postalCode: z.string().nullable(),
  region: z.string().nullable(),
  country: z.string().nullable(),
  brandName: z.string().nullable(),
  brandWikidataId: z.string().nullable(),
});
export type RestaurantDetail = z.infer<typeof RestaurantDetailSchema>;
