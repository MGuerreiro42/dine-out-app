import { z } from 'zod';

export const AuthUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
});
export type AuthUser = z.infer<typeof AuthUserSchema>;

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type AuthTokens = z.infer<typeof AuthTokensSchema>;

export const AuthResponseSchema = AuthTokensSchema.extend({
  user: AuthUserSchema,
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

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
  brandName: z.string().nullable(),
  websites: z.array(z.string()),
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

export const ReviewSchema = z.object({
  id: z.number(),
  userId: z.number(),
  userName: z.string(),
  rating: z.number(),
  text: z.string(),
  createdAt: z.string(),
});

export const RestaurantDetailSchema = RestaurantSummarySchema.extend({
  menuItems: z.array(MenuItemSchema),
  thingsToKnow: z.array(ThingToKnowSchema),
  highlights: z.array(HighlightSchema),
  phones: z.array(z.string()),
  socialLinks: z.array(z.string()),
  categoryAlternates: z.array(z.string()),
  categoryHierarchy: z.array(z.string()),
  postalCode: z.string().nullable(),
  region: z.string().nullable(),
  country: z.string().nullable(),
  brandWikidataId: z.string().nullable(),
  // Capped at the 20 most recent server-side (dine-out-backend's specs/reviews.md) —
  // reviewCount is the true, uncapped total, so it can exceed reviews.length.
  reviews: z.array(ReviewSchema),
  averageRating: z.number().nullable(),
  reviewCount: z.number(),
});
export type RestaurantDetail = z.infer<typeof RestaurantDetailSchema>;
