import { z } from 'zod';

export const RestaurantSchema = z.object({
  id: z.number(),
  name: z.string(),
  photo: z.string().nullable(),
  rating: z.string().nullable(),
  priceLevel: z.string().nullable(),
  cuisine: z.string(),
  occasion: z.string().nullable(),
  ambient: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  reviewCount: z.number().nullable(),
  brandName: z.string().nullable(),
  websites: z.array(z.string()),
});

export type Restaurant = z.infer<typeof RestaurantSchema>;
