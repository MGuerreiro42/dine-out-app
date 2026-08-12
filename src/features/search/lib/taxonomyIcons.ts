import type { IconSpec } from '@/components/ui';

// Presentation-only lookups — Cuisine/Ambient's own mock data don't carry an
// icon (Cuisine has `photo`, Ambient has neither). Shared here since both
// CuisineSelector/AmbientSelector and the generic type-detail/overview
// screens need the same glyphs.
export const CUISINE_ICONS: Record<string, IconSpec> = {
  churrasco: { set: 'Ionicons', name: 'flame-outline' },
  mediterraneo: { set: 'Ionicons', name: 'nutrition-outline' },
  italiana: { set: 'Ionicons', name: 'pizza-outline' },
  indiana: { set: 'MaterialCommunityIcons', name: 'chili-hot-outline' },
  chinesa: { set: 'MaterialCommunityIcons', name: 'noodles' },
};
export const DEFAULT_CUISINE_ICON: IconSpec = { set: 'Ionicons', name: 'restaurant-outline' };

export const AMBIENT_ICONS: Record<string, IconSpec> = {
  cozy: { set: 'Ionicons', name: 'cafe-outline' },
  fancy: { set: 'MaterialCommunityIcons', name: 'crown-outline' },
  relaxed: { set: 'Ionicons', name: 'wine-outline' },
  agitated: { set: 'Ionicons', name: 'flash-outline' },
};
export const DEFAULT_AMBIENT_ICON: IconSpec = { set: 'Ionicons', name: 'happy-outline' };
