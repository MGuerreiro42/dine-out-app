import type { IconSpec } from '@/components/ui';

export const CUISINE_ICONS: Record<string, IconSpec> = {
  brazilian: { set: 'Ionicons', name: 'flame-outline' },
  mediterranean: { set: 'Ionicons', name: 'nutrition-outline' },
  italian: { set: 'Ionicons', name: 'pizza-outline' },
  indian: { set: 'MaterialCommunityIcons', name: 'chili-hot-outline' },
  chinese: { set: 'MaterialCommunityIcons', name: 'noodles' },
};
export const DEFAULT_CUISINE_ICON: IconSpec = { set: 'Ionicons', name: 'restaurant-outline' };

export const AMBIENT_ICONS: Record<string, IconSpec> = {
  cozy: { set: 'Ionicons', name: 'cafe-outline' },
  fancy: { set: 'MaterialCommunityIcons', name: 'crown-outline' },
  relaxed: { set: 'Ionicons', name: 'wine-outline' },
  agitated: { set: 'Ionicons', name: 'flash-outline' },
};
export const DEFAULT_AMBIENT_ICON: IconSpec = { set: 'Ionicons', name: 'happy-outline' };
