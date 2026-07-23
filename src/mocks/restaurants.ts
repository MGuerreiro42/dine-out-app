import type { Restaurant } from '@/types';

const PHOTOS = {
  r1: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80',
  r2: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
  r3: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80',
  r4: 'https://images.unsplash.com/photo-1558030006-450675393462?w=500&q=80',
  r5: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80',
  r6: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&q=80',
};

export const RESTAURANTS: Restaurant[] = [
  { id: 1, name: 'Fogo & Brasa', photo: PHOTOS.r1, rating: '4.8', priceLevel: '$$$', cuisine: 'churrasco', occasion: 'familia', ambient: 'fancy' },
  { id: 2, name: 'Terra Nostra', photo: PHOTOS.r2, rating: '4.5', priceLevel: '$$', cuisine: 'mediterraneo', occasion: 'encontro', ambient: 'cozy' },
  { id: 3, name: 'Casa Oliveira', photo: PHOTOS.r3, rating: '4.6', priceLevel: '$$', cuisine: 'italiana', occasion: 'grupo', ambient: 'relaxed' },
  { id: 4, name: 'Brasa Real', photo: PHOTOS.r4, rating: '4.7', priceLevel: '$$$', cuisine: 'churrasco', occasion: 'grupo', ambient: 'fancy' },
  { id: 5, name: 'Zeytin Meze', photo: PHOTOS.r5, rating: '4.4', priceLevel: '$$', cuisine: 'mediterraneo', occasion: 'encontro', ambient: 'cozy' },
  { id: 6, name: 'Espeto & Cia', photo: PHOTOS.r6, rating: '4.3', priceLevel: '$', cuisine: 'churrasco', occasion: 'musica', ambient: 'agitated' },
];
