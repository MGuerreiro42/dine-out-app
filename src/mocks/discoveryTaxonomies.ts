import type { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import type { IconSpec } from '@/components/ui/Icon';
import type { Ambient, Benefit, CategorySubtype, Cuisine, Occasion } from '@/features/search/types';

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
  { id: 'churrasco', label: 'Churrasco', photo: PHOTOS.r1 },
  { id: 'mediterraneo', label: 'Mediterrâneo', photo: PHOTOS.r2 },
  { id: 'italiana', label: 'Italiana', photo: PHOTOS.r3 },
  { id: 'indiana', label: 'Indiana', photo: PHOTOS.r4 },
  { id: 'chinesa', label: 'Chinesa', photo: PHOTOS.r5 },
];

export const OCCASIONS: Occasion[] = [
  { id: 'encontro', label: 'Encontro', icon: icon('Ionicons', 'heart-outline') },
  { id: 'grupo', label: 'Grupo grande', icon: icon('Ionicons', 'people-outline') },
  { id: 'familia', label: 'Família', icon: icon('MaterialCommunityIcons', 'human-male-female-child') },
  { id: 'musica', label: 'Música ao vivo', icon: icon('Ionicons', 'musical-notes-outline') },
];

export const AMBIENTS: Ambient[] = [
  { id: 'cozy', label: 'Cozy' },
  { id: 'fancy', label: 'Fancy' },
  { id: 'relaxed', label: 'Relaxed' },
  { id: 'agitated', label: 'Agitated' },
];

export const BENEFITS: Benefit[] = [
  { text: 'Melhor avaliados da região' },
  { text: 'Reserva instantânea' },
  { text: 'Estacionamento garantido' },
  { text: 'Pagamento seguro' },
];

export const CATEGORY_SUBTYPES: Record<string, CategorySubtype[]> = {
  churrasco: [
    { icon: icon('MaterialCommunityIcons', 'grill'), label: 'Rodízio' },
    { icon: icon('MaterialCommunityIcons', 'fire'), label: 'Espetos' },
    { icon: icon('MaterialCommunityIcons', 'food-steak'), label: 'Prime cuts' },
  ],
  mediterraneo: [
    { icon: icon('MaterialCommunityIcons', 'bowl-mix'), label: 'Mezze' },
    { icon: icon('MaterialCommunityIcons', 'grill'), label: 'Grelhados' },
    { icon: icon('MaterialCommunityIcons', 'leaf'), label: 'Vegetariano' },
  ],
  italiana: [
    { icon: icon('MaterialCommunityIcons', 'pasta'), label: 'Massas' },
    { icon: icon('MaterialCommunityIcons', 'pizza'), label: 'Pizzas' },
    { icon: icon('MaterialCommunityIcons', 'rice'), label: 'Risotos' },
  ],
  indiana: [
    { icon: icon('MaterialCommunityIcons', 'pot-mix'), label: 'Curry' },
    { icon: icon('MaterialCommunityIcons', 'fire'), label: 'Tandoori' },
    { icon: icon('MaterialCommunityIcons', 'leaf'), label: 'Vegetariano' },
  ],
  chinesa: [
    { icon: icon('MaterialCommunityIcons', 'bowl-mix'), label: 'Dim Sum' },
    { icon: icon('MaterialCommunityIcons', 'pan'), label: 'Wok' },
    { icon: icon('MaterialCommunityIcons', 'duck'), label: 'Pato' },
  ],
};
