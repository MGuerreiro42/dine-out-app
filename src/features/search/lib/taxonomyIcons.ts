import type { IconSpec } from '@/components/ui';

export const CUISINE_ICONS: Record<string, IconSpec> = {
  bar: { set: 'Ionicons', name: 'beer-outline' },
  restaurant: { set: 'Ionicons', name: 'restaurant-outline' },
  pizza_italian: { set: 'Ionicons', name: 'pizza-outline' },
  brazilian: { set: 'Ionicons', name: 'flame-outline' },
  fast_food: { set: 'Ionicons', name: 'fast-food-outline' },
  barbecue: { set: 'MaterialCommunityIcons', name: 'grill' },
  cafe: { set: 'Ionicons', name: 'cafe-outline' },
  asian: { set: 'MaterialCommunityIcons', name: 'noodles' },
  latin_american: { set: 'MaterialCommunityIcons', name: 'taco' },
  buffet: { set: 'MaterialCommunityIcons', name: 'buffet' },
  vegetarian_vegan: { set: 'MaterialCommunityIcons', name: 'sprout' },
};
export const DEFAULT_CUISINE_ICON: IconSpec = { set: 'Ionicons', name: 'restaurant-outline' };

export const AMBIENT_ICONS: Record<string, IconSpec> = {
  cozy: { set: 'Ionicons', name: 'cafe-outline' },
  fancy: { set: 'MaterialCommunityIcons', name: 'crown-outline' },
  relaxed: { set: 'Ionicons', name: 'wine-outline' },
  agitated: { set: 'Ionicons', name: 'flash-outline' },
};
export const DEFAULT_AMBIENT_ICON: IconSpec = { set: 'Ionicons', name: 'happy-outline' };
