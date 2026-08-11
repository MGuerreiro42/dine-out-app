import type { AppPlace, GooglePriceLevel } from '@/lib/googlePlaces';

/**
 * Same 6 Unsplash photos the app has always used (no more exist in the
 * source design to pull from) — the pool is now referenced by opaque mock
 * photo names instead of direct URLs, resolved through the two-hop photo
 * flow in src/mocks/repository.ts's getPlacePhotoUrl, mirroring Google
 * Places API (New)'s real photo-reference contract.
 */
const PHOTO_URL_POOL = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80',
  'https://images.unsplash.com/photo-1558030006-450675393462?w=500&q=80',
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80',
  'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&q=80',
];

export function photoUrlForMockName(name: string): string | undefined {
  const index = Number(name.replace('r', '')) - 1;
  return PHOTO_URL_POOL[index];
}

export function photoRef(poolIndex: number) {
  return { name: `r${poolIndex}`, widthPx: 500, heightPx: 375 };
}

function types(primaryType: string): string[] {
  return [primaryType, 'restaurant', 'food', 'point_of_interest', 'establishment'];
}

type PlaceSeed = Omit<AppPlace, 'displayName' | 'photos' | 'types'> & {
  name: string;
  photoPoolIndex: number;
};

const PRICE = {
  low: 'PRICE_LEVEL_INEXPENSIVE' as GooglePriceLevel,
  mid: 'PRICE_LEVEL_MODERATE' as GooglePriceLevel,
  high: 'PRICE_LEVEL_EXPENSIVE' as GooglePriceLevel,
};

const SEEDS: PlaceSeed[] = [
  // Churrasco (brazilian_restaurant)
  { id: '1', name: 'Fogo & Brasa', formattedAddress: 'Av. Paulista, 1200 - Bela Vista, São Paulo - SP', location: { latitude: -23.5649, longitude: -46.6583 }, rating: 4.8, userRatingCount: 980, priceLevel: PRICE.high, primaryType: 'brazilian_restaurant', occasion: 'familia', ambient: 'fancy', venueType: 'dine-in', photoPoolIndex: 1 },
  { id: '2', name: 'Brasa Real', formattedAddress: 'Av. Brigadeiro Faria Lima, 2200 - Itaim Bibi, São Paulo - SP', location: { latitude: -23.5808, longitude: -46.678 }, rating: 4.7, userRatingCount: 640, priceLevel: PRICE.high, primaryType: 'brazilian_restaurant', occasion: 'grupo', ambient: 'fancy', venueType: 'bar', photoPoolIndex: 4 },
  { id: '3', name: 'Espeto & Cia', formattedAddress: 'Rua Aspicuelta, 45 - Vila Madalena, São Paulo - SP', location: { latitude: -23.5558, longitude: -46.6901 }, rating: 4.3, userRatingCount: 310, priceLevel: PRICE.low, primaryType: 'brazilian_restaurant', occasion: 'musica', ambient: 'agitated', venueType: 'takeout', photoPoolIndex: 6 },
  { id: '4', name: 'Costelaria do Vale', formattedAddress: 'Rua Harmonia, 88 - Vila Madalena, São Paulo - SP', location: { latitude: -23.554, longitude: -46.6883 }, rating: 4.5, userRatingCount: 420, priceLevel: PRICE.mid, primaryType: 'brazilian_restaurant', occasion: 'encontro', ambient: 'cozy', venueType: 'dine-in', photoPoolIndex: 2 },
  { id: '5', name: 'Rancho do Chef', formattedAddress: 'Alameda Santos, 700 - Jardim Paulista, São Paulo - SP', location: { latitude: -23.5634, longitude: -46.6646 }, rating: 4.4, userRatingCount: 250, priceLevel: PRICE.mid, primaryType: 'brazilian_restaurant', occasion: 'familia', ambient: 'relaxed', venueType: 'bar', photoPoolIndex: 5 },
  { id: '6', name: 'Points Grill', formattedAddress: 'Rua Teodoro Sampaio, 500 - Pinheiros, São Paulo - SP', location: { latitude: -23.5616, longitude: -46.6888 }, rating: 4.2, userRatingCount: 190, priceLevel: PRICE.low, primaryType: 'brazilian_restaurant', occasion: 'grupo', ambient: 'agitated', venueType: 'takeout', photoPoolIndex: 3 },

  // Mediterrâneo
  { id: '7', name: 'Terra Nostra', formattedAddress: 'Rua Oscar Freire, 340 - Jardins, São Paulo - SP', location: { latitude: -23.5724, longitude: -46.668 }, rating: 4.5, userRatingCount: 560, priceLevel: PRICE.mid, primaryType: 'mediterranean_restaurant', occasion: 'encontro', ambient: 'cozy', venueType: 'dine-in', photoPoolIndex: 2 },
  { id: '8', name: 'Zeytin Meze', formattedAddress: 'Rua Girassol, 155 - Vila Madalena, São Paulo - SP', location: { latitude: -23.5594, longitude: -46.6901 }, rating: 4.4, userRatingCount: 380, priceLevel: PRICE.mid, primaryType: 'mediterranean_restaurant', occasion: 'encontro', ambient: 'cozy', venueType: 'bar', photoPoolIndex: 5 },
  { id: '9', name: 'Oliveira & Azeite', formattedAddress: 'Rua Cardeal Arcoverde, 220 - Pinheiros, São Paulo - SP', location: { latitude: -23.5688, longitude: -46.6834 }, rating: 4.6, userRatingCount: 410, priceLevel: PRICE.mid, primaryType: 'mediterranean_restaurant', occasion: 'familia', ambient: 'relaxed', venueType: 'takeout', photoPoolIndex: 1 },
  { id: '10', name: 'Costa Azul Meze', formattedAddress: 'Alameda Lorena, 1500 - Jardins, São Paulo - SP', location: { latitude: -23.567, longitude: -46.6716 }, rating: 4.3, userRatingCount: 300, priceLevel: PRICE.high, primaryType: 'mediterranean_restaurant', occasion: 'grupo', ambient: 'fancy', venueType: 'dine-in', photoPoolIndex: 4 },
  { id: '11', name: 'Cedro do Líbano', formattedAddress: 'Rua Bela Cintra, 900 - Consolação, São Paulo - SP', location: { latitude: -23.5562, longitude: -46.6638 }, rating: 4.7, userRatingCount: 720, priceLevel: PRICE.mid, primaryType: 'mediterranean_restaurant', occasion: 'familia', ambient: 'cozy', venueType: 'bar', photoPoolIndex: 6 },
  { id: '12', name: 'Ilha Grega', formattedAddress: 'Rua Augusta, 2100 - Jardins, São Paulo - SP', location: { latitude: -23.5634, longitude: -46.668 }, rating: 4.1, userRatingCount: 150, priceLevel: PRICE.low, primaryType: 'mediterranean_restaurant', occasion: 'musica', ambient: 'agitated', venueType: 'takeout', photoPoolIndex: 3 },

  // Italiana
  { id: '13', name: 'Casa Oliveira', formattedAddress: 'Rua Fradique Coutinho, 88 - Vila Madalena, São Paulo - SP', location: { latitude: -23.5504, longitude: -46.6901 }, rating: 4.6, userRatingCount: 500, priceLevel: PRICE.mid, primaryType: 'italian_restaurant', occasion: 'grupo', ambient: 'relaxed', venueType: 'dine-in', photoPoolIndex: 3 },
  { id: '14', name: 'Trattoria Bella Vita', formattedAddress: 'Rua dos Pinheiros, 610 - Pinheiros, São Paulo - SP', location: { latitude: -23.5724, longitude: -46.6834 }, rating: 4.8, userRatingCount: 900, priceLevel: PRICE.high, primaryType: 'italian_restaurant', occasion: 'encontro', ambient: 'cozy', venueType: 'bar', photoPoolIndex: 1 },
  { id: '15', name: 'Forno di Napoli', formattedAddress: 'Rua Wisard, 240 - Vila Madalena, São Paulo - SP', location: { latitude: -23.5594, longitude: -46.6955 }, rating: 4.5, userRatingCount: 640, priceLevel: PRICE.mid, primaryType: 'italian_restaurant', occasion: 'familia', ambient: 'relaxed', venueType: 'takeout', photoPoolIndex: 5 },
  { id: '16', name: 'Pasta & Vino', formattedAddress: 'Alameda Gabriel Monteiro da Silva, 350 - Jardins, São Paulo - SP', location: { latitude: -23.5688, longitude: -46.6698 }, rating: 4.7, userRatingCount: 520, priceLevel: PRICE.high, primaryType: 'italian_restaurant', occasion: 'encontro', ambient: 'fancy', venueType: 'dine-in', photoPoolIndex: 2 },
  { id: '17', name: 'Al Dente Cucina', formattedAddress: 'Rua Mourato Coelho, 970 - Pinheiros, São Paulo - SP', location: { latitude: -23.567, longitude: -46.687 }, rating: 4.2, userRatingCount: 210, priceLevel: PRICE.low, primaryType: 'italian_restaurant', occasion: 'grupo', ambient: 'agitated', venueType: 'bar', photoPoolIndex: 6 },
  { id: '18', name: 'Ristorante Toscano', formattedAddress: 'Rua Haddock Lobo, 1300 - Jardins, São Paulo - SP', location: { latitude: -23.5652, longitude: -46.6662 }, rating: 4.6, userRatingCount: 480, priceLevel: PRICE.mid, primaryType: 'italian_restaurant', occasion: 'familia', ambient: 'cozy', venueType: 'takeout', photoPoolIndex: 4 },

  // Indiana
  { id: '19', name: 'Taj Especiarias', formattedAddress: 'Rua Pamplona, 700 - Jardim Paulista, São Paulo - SP', location: { latitude: -23.5634, longitude: -46.6574 }, rating: 4.5, userRatingCount: 340, priceLevel: PRICE.mid, primaryType: 'indian_restaurant', occasion: 'encontro', ambient: 'cozy', venueType: 'dine-in', photoPoolIndex: 1 },
  { id: '20', name: 'Curry House', formattedAddress: 'Rua Consolação, 2400 - Consolação, São Paulo - SP', location: { latitude: -23.5526, longitude: -46.6656 }, rating: 4.3, userRatingCount: 260, priceLevel: PRICE.mid, primaryType: 'indian_restaurant', occasion: 'familia', ambient: 'relaxed', venueType: 'bar', photoPoolIndex: 4 },
  { id: '21', name: 'Masala & Cia', formattedAddress: 'Alameda Itu, 850 - Jardim Paulista, São Paulo - SP', location: { latitude: -23.5724, longitude: -46.6628 }, rating: 4.4, userRatingCount: 300, priceLevel: PRICE.high, primaryType: 'indian_restaurant', occasion: 'grupo', ambient: 'fancy', venueType: 'takeout', photoPoolIndex: 2 },
  { id: '22', name: 'Namaste Cozinha Indiana', formattedAddress: 'Rua Bela Cintra, 1620 - Jardins, São Paulo - SP', location: { latitude: -23.5706, longitude: -46.668 }, rating: 4.6, userRatingCount: 410, priceLevel: PRICE.mid, primaryType: 'indian_restaurant', occasion: 'familia', ambient: 'cozy', venueType: 'dine-in', photoPoolIndex: 5 },
  { id: '23', name: 'Tandoori Nights', formattedAddress: 'Rua Frei Caneca, 610 - Consolação, São Paulo - SP', location: { latitude: -23.5598, longitude: -46.6602 }, rating: 4.1, userRatingCount: 170, priceLevel: PRICE.low, primaryType: 'indian_restaurant', occasion: 'musica', ambient: 'agitated', venueType: 'bar', photoPoolIndex: 3 },
  { id: '24', name: 'Spice Route', formattedAddress: 'Rua Oscar Freire, 985 - Jardins, São Paulo - SP', location: { latitude: -23.567, longitude: -46.6644 }, rating: 4.7, userRatingCount: 530, priceLevel: PRICE.high, primaryType: 'indian_restaurant', occasion: 'encontro', ambient: 'fancy', venueType: 'takeout', photoPoolIndex: 6 },

  // Chinesa
  { id: '25', name: 'Dragão Dourado', formattedAddress: 'Rua Galvão Bueno, 60 - Liberdade, São Paulo - SP', location: { latitude: -23.5562, longitude: -46.6386 }, rating: 4.2, userRatingCount: 220, priceLevel: PRICE.low, primaryType: 'chinese_restaurant', occasion: 'grupo', ambient: 'agitated', venueType: 'dine-in', photoPoolIndex: 2 },
  { id: '26', name: 'Jardim de Jade', formattedAddress: 'Rua Tomás Gonzaga, 66 - Liberdade, São Paulo - SP', location: { latitude: -23.5544, longitude: -46.6368 }, rating: 4.6, userRatingCount: 480, priceLevel: PRICE.mid, primaryType: 'chinese_restaurant', occasion: 'encontro', ambient: 'cozy', venueType: 'bar', photoPoolIndex: 5 },
  { id: '27', name: 'Panda Wok', formattedAddress: 'Rua Estados Unidos, 1500 - Jardim Paulista, São Paulo - SP', location: { latitude: -23.5616, longitude: -46.661 }, rating: 4.3, userRatingCount: 290, priceLevel: PRICE.low, primaryType: 'chinese_restaurant', occasion: 'familia', ambient: 'relaxed', venueType: 'takeout', photoPoolIndex: 1 },
  { id: '28', name: 'Casa do Bambu', formattedAddress: 'Rua da Glória, 290 - Liberdade, São Paulo - SP', location: { latitude: -23.5634, longitude: -46.6332 }, rating: 4.5, userRatingCount: 350, priceLevel: PRICE.mid, primaryType: 'chinese_restaurant', occasion: 'familia', ambient: 'cozy', venueType: 'dine-in', photoPoolIndex: 4 },
  { id: '29', name: 'Lanterna Vermelha', formattedAddress: 'Rua São Joaquim, 100 - Liberdade, São Paulo - SP', location: { latitude: -23.5616, longitude: -46.6314 }, rating: 4.4, userRatingCount: 310, priceLevel: PRICE.high, primaryType: 'chinese_restaurant', occasion: 'grupo', ambient: 'fancy', venueType: 'bar', photoPoolIndex: 3 },
  { id: '30', name: 'Templo do Sabor', formattedAddress: 'Rua Barão de Iguape, 300 - Liberdade, São Paulo - SP', location: { latitude: -23.5598, longitude: -46.6386 }, rating: 4.0, userRatingCount: 140, priceLevel: PRICE.low, primaryType: 'chinese_restaurant', occasion: 'musica', ambient: 'agitated', venueType: 'takeout', photoPoolIndex: 6 },
];

export const PLACES: AppPlace[] = SEEDS.map(({ name, photoPoolIndex, ...seed }) => ({
  ...seed,
  displayName: { text: name, languageCode: 'pt-BR' },
  types: types(seed.primaryType),
  photos: [photoRef(photoPoolIndex)],
}));
