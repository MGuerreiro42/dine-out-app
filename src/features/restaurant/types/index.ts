import { z } from 'zod';

import { RestaurantSchema } from '@/types';

export const MenuItemSchema = z.object({
  name: z.string(),
  price: z.string(),
});
export type MenuItem = z.infer<typeof MenuItemSchema>;

export const RestaurantDetailSchema = RestaurantSchema.extend({
  photos: z.array(z.string()),
  description: z.string(),
  tags: z.array(z.string()),
  addressShort: z.string(),
  menu: z.array(MenuItemSchema),
});
export type RestaurantDetail = z.infer<typeof RestaurantDetailSchema>;
