import { z } from 'zod';

export const RestaurantSchema = z.object({
  id: z.number(),
  name: z.string(),
  photo: z.string(),
  rating: z.string(),
  priceLevel: z.string(),
  cuisine: z.string(),
  occasion: z.string(),
  ambient: z.string(),
});

export type Restaurant = z.infer<typeof RestaurantSchema>;
