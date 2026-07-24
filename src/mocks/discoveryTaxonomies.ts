import type { Ambient, Benefit, CategorySubtype, Cuisine, Occasion } from '@/features/search/types';

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
  { id: 'encontro', label: 'Encontro', initial: 'E' },
  { id: 'grupo', label: 'Grupo grande', initial: 'G' },
  { id: 'familia', label: 'Família', initial: 'F' },
  { id: 'musica', label: 'Música ao vivo', initial: 'M' },
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
    { initial: 'R', label: 'Rodízio' },
    { initial: 'E', label: 'Espetos' },
    { initial: 'P', label: 'Prime cuts' },
  ],
  mediterraneo: [
    { initial: 'M', label: 'Mezze' },
    { initial: 'G', label: 'Grelhados' },
    { initial: 'V', label: 'Vegetariano' },
  ],
  italiana: [
    { initial: 'M', label: 'Massas' },
    { initial: 'P', label: 'Pizzas' },
    { initial: 'R', label: 'Risotos' },
  ],
  indiana: [
    { initial: 'C', label: 'Curry' },
    { initial: 'T', label: 'Tandoori' },
    { initial: 'V', label: 'Vegetariano' },
  ],
  chinesa: [
    { initial: 'D', label: 'Dim Sum' },
    { initial: 'W', label: 'Wok' },
    { initial: 'P', label: 'Pato' },
  ],
};
