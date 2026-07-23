import type { Restaurant } from '@/types';

export type MenuItem = {
  name: string;
  price: string;
};

export type RestaurantDetail = Restaurant & {
  photos: string[];
  description: string;
  tags: string[];
  addressShort: string;
  menu: MenuItem[];
};
