import { z } from 'zod';

import { IconSpecSchema } from '@/components/ui/Icon';
import { RestaurantSchema } from '@/types';

export const MenuItemSchema = z.object({
  name: z.string(),
  price: z.string(),
});
export type MenuItem = z.infer<typeof MenuItemSchema>;

export const AmenitySchema = z.object({
  icon: IconSpecSchema,
  label: z.string(),
});
export type Amenity = z.infer<typeof AmenitySchema>;

export const ThingToKnowSchema = z.object({
  title: z.string(),
  text: z.string(),
});
export type ThingToKnow = z.infer<typeof ThingToKnowSchema>;

export const OpeningHoursSchema = z.object({
  day: z.string(),
  hours: z.string(),
});
export type OpeningHours = z.infer<typeof OpeningHoursSchema>;

export const ReviewSchema = z.object({
  name: z.string(),
  time: z.string(),
  rating: z.number(),
  text: z.string(),
});
export type Review = z.infer<typeof ReviewSchema>;

export const RestaurantDetailSchema = RestaurantSchema.extend({
  photos: z.array(z.string()),
  description: z.string(),
  tags: z.array(z.string()),
  addressShort: z.string(),
  menu: z.array(MenuItemSchema),
  amenities: z.array(AmenitySchema),
  openingHours: z.array(OpeningHoursSchema),
  thingsToKnow: z.array(ThingToKnowSchema),
  phone: z.string(),
  whatsapp: z.string(),
  instagramHandle: z.string(),
  instagramPhotos: z.array(z.string()),
  reviews: z.array(ReviewSchema),
  reviewCount: z.number(),
  highlights: z.array(z.string()),
});
export type RestaurantDetail = z.infer<typeof RestaurantDetailSchema>;
