import type { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import type { IconSpec } from '@/components/ui/Icon';
import type { Ambient, Benefit, CategorySubtype, Cuisine, Occasion } from '@/features/search/types';

// Overloaded per set so each call site still gets a compile-time check
// against that set's real glyph names, despite the shared helper.
function icon(set: 'Ionicons', name: keyof typeof Ionicons.glyphMap): IconSpec;
function icon(set: 'MaterialCommunityIcons', name: keyof typeof MaterialCommunityIcons.glyphMap): IconSpec;
function icon(set: 'MaterialIcons', name: keyof typeof MaterialIcons.glyphMap): IconSpec;
function icon(set: IconSpec['set'], name: string): IconSpec {
  return { set, name } as IconSpec;
}

const PHOTOS = {
  r1: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80',
  r2: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
  r3: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80',
  r4: 'https://images.unsplash.com/photo-1558030006-450675393462?w=500&q=80',
  r5: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80',
};

export const CUISINES: Cuisine[] = [
  { id: 'brazilian', label: 'Brazilian BBQ', photo: PHOTOS.r1 },
  { id: 'mediterranean', label: 'Mediterranean', photo: PHOTOS.r2 },
  { id: 'italian', label: 'Italian', photo: PHOTOS.r3 },
  { id: 'indian', label: 'Indian', photo: PHOTOS.r4 },
  { id: 'chinese', label: 'Chinese', photo: PHOTOS.r5 },
];

export const OCCASIONS: Occasion[] = [
  { id: 'date', label: 'Date', icon: icon('Ionicons', 'heart-outline') },
  { id: 'group', label: 'Large group', icon: icon('Ionicons', 'people-outline') },
  { id: 'family', label: 'Family', icon: icon('MaterialCommunityIcons', 'human-male-female-child') },
  { id: 'music', label: 'Live music', icon: icon('Ionicons', 'musical-notes-outline') },
];

export const AMBIENTS: Ambient[] = [
  { id: 'cozy', label: 'Cozy' },
  { id: 'fancy', label: 'Fancy' },
  { id: 'relaxed', label: 'Relaxed' },
  { id: 'agitated', label: 'Agitated' },
];

export const BENEFITS: Benefit[] = [
  { text: 'Top rated in the area' },
  { text: 'Instant booking' },
  { text: 'Guaranteed parking' },
  { text: 'Secure payment' },
];

export const CATEGORY_SUBTYPES: Record<string, CategorySubtype[]> = {
  brazilian: [
    { icon: icon('MaterialCommunityIcons', 'grill'), label: 'All-you-can-eat' },
    { icon: icon('MaterialCommunityIcons', 'fire'), label: 'Skewers' },
    { icon: icon('MaterialCommunityIcons', 'food-steak'), label: 'Prime cuts' },
  ],
  mediterranean: [
    { icon: icon('MaterialCommunityIcons', 'bowl-mix'), label: 'Mezze' },
    { icon: icon('MaterialCommunityIcons', 'grill'), label: 'Grilled' },
    { icon: icon('MaterialCommunityIcons', 'leaf'), label: 'Vegetarian' },
  ],
  italian: [
    { icon: icon('MaterialCommunityIcons', 'pasta'), label: 'Pasta' },
    { icon: icon('MaterialCommunityIcons', 'pizza'), label: 'Pizza' },
    { icon: icon('MaterialCommunityIcons', 'rice'), label: 'Risotto' },
  ],
  indian: [
    { icon: icon('MaterialCommunityIcons', 'pot-mix'), label: 'Curry' },
    { icon: icon('MaterialCommunityIcons', 'fire'), label: 'Tandoori' },
    { icon: icon('MaterialCommunityIcons', 'leaf'), label: 'Vegetarian' },
  ],
  chinese: [
    { icon: icon('MaterialCommunityIcons', 'bowl-mix'), label: 'Dim Sum' },
    { icon: icon('MaterialCommunityIcons', 'pan'), label: 'Wok' },
    { icon: icon('MaterialCommunityIcons', 'duck'), label: 'Duck' },
  ],
};
