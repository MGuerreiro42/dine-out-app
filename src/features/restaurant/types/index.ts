import { z } from 'zod';

import { RestaurantSchema } from '@/types';

export const MenuItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.string(),
  category: z.string(),
  isAvailable: z.boolean(),
});
export type MenuItem = z.infer<typeof MenuItemSchema>;

export const ThingToKnowSchema = z.object({
  id: z.number(),
  title: z.string(),
  text: z.string(),
});
export type ThingToKnow = z.infer<typeof ThingToKnowSchema>;

export const ReviewSchema = z.object({
  name: z.string(),
  time: z.string(),
  rating: z.number(),
  text: z.string(),
});
export type Review = z.infer<typeof ReviewSchema>;

export const HighlightSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
});
export type Highlight = z.infer<typeof HighlightSchema>;

export const RestaurantDetailSchema = RestaurantSchema.extend({
  photos: z.array(z.string()),
  tags: z.array(z.string()),
  addressShort: z.string().nullable(),
  menu: z.array(MenuItemSchema),
  thingsToKnow: z.array(ThingToKnowSchema),
  phone: z.string().nullable(),
  whatsapp: z.string().nullable(),
  instagramHandle: z.string().nullable(),
  reviews: z.array(ReviewSchema),
  highlights: z.array(HighlightSchema),
});
export type RestaurantDetail = z.infer<typeof RestaurantDetailSchema>;
