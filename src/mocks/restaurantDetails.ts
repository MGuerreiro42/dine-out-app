import type { AppPlace, GoogleAmenityFields, PlaceDetails } from '@/lib/googlePlaces';
import { PLACES, photoRef, photoUrlForMockName } from '@/mocks/restaurants';

type MenuItem = { name: string; price: string };

const CHURRASCO_MENU: MenuItem[] = [
  { name: 'Picanha na brasa', price: 'R$ 89' },
  { name: 'Fraldinha', price: 'R$ 79' },
  { name: 'Costela no bafo', price: 'R$ 95' },
  { name: 'Buffet de saladas', price: 'incluso' },
  { name: 'Farofa & vinagrete', price: 'incluso' },
  { name: 'Sobremesa: abacaxi grelhado', price: 'R$ 18' },
];

const MEDITERRANEO_MENU: MenuItem[] = [
  { name: 'Mezze compartilhável', price: 'R$ 62' },
  { name: 'Cordeiro grelhado', price: 'R$ 98' },
  { name: 'Homus da casa', price: 'R$ 32' },
  { name: 'Pão sírio artesanal', price: 'incluso' },
];

const ITALIANA_MENU: MenuItem[] = [
  { name: 'Tagliatelle ao ragu', price: 'R$ 68' },
  { name: 'Risoto de funghi', price: 'R$ 74' },
  { name: 'Pizza margherita', price: 'R$ 56' },
];

const INDIANA_MENU: MenuItem[] = [
  { name: 'Frango tikka masala', price: 'R$ 68' },
  { name: 'Curry de cordeiro', price: 'R$ 82' },
  { name: 'Naan de alho', price: 'incluso' },
  { name: 'Samosas de legumes', price: 'R$ 28' },
  { name: 'Arroz basmati', price: 'incluso' },
];

const CHINESA_MENU: MenuItem[] = [
  { name: 'Pato laqueado', price: 'R$ 96' },
  { name: 'Yakisoba de legumes', price: 'R$ 52' },
  { name: 'Dim sum variado', price: 'R$ 46' },
  { name: 'Frango xadrez', price: 'R$ 58' },
  { name: 'Sopa wonton', price: 'R$ 32' },
];

const MENU_BY_PRIMARY_TYPE: Record<string, MenuItem[]> = {
  brazilian_restaurant: CHURRASCO_MENU,
  mediterranean_restaurant: MEDITERRANEO_MENU,
  italian_restaurant: ITALIANA_MENU,
  indian_restaurant: INDIANA_MENU,
  chinese_restaurant: CHINESA_MENU,
};

const EXTRAS_BY_ID: Record<string, { description: string; tags: string[] }> = {
  '1': { description: 'Um rodízio clássico de churrascaria com carnes selecionadas e cortes nobres, grelhados na brasa no estilo tradicional gaúcho. Ambiente descontraído com música ao vivo às sextas e sábados, ideal para famílias e grupos grandes.', tags: ['Churrasco', 'Rodízio', 'Música ao vivo'] },
  '2': { description: 'Espaço amplo para grupos, buffet completo de acompanhamentos e carnes nobres direto da brasa.', tags: ['Grupos grandes', 'Buffet completo', 'Estacionamento'] },
  '3': { description: 'Espetinhos, chope gelado e música ao vivo todo fim de semana — clima de boteco raiz.', tags: ['Música ao vivo', 'Chope gelado', 'Pet friendly'] },
  '4': { description: 'Costela de 12 horas na brasa e acompanhamentos caseiros, num salão intimista pra namorar sem pressa.', tags: ['Costela 12h', 'Ambiente intimista', 'Vinhos selecionados'] },
  '5': { description: 'Buffet rústico de churrasco com foco em família — playground pra crianças e mesas comunitárias.', tags: ['Playground infantil', 'Buffet à vontade', 'Estacionamento'] },
  '6': { description: 'Espetinhos rápidos e porções generosas pra galera que quer comer bem sem gastar muito.', tags: ['Preço justo', 'Porções grandes', 'Delivery rápido'] },
  '7': { description: 'Mezze compartilháveis e terraço iluminado à luz de velas. Cardápio inspirado na costa mediterrânea, com pratos leves e vinhos naturais selecionados a dedo.', tags: ['Terraço', 'Vegetariano-friendly', 'Romântico'] },
  '8': { description: 'Pratos frios turcos e vinhos naturais, ambiente intimista pra uma noite tranquila a dois.', tags: ['Vinhos naturais', 'Intimista', 'Sem glúten'] },
  '9': { description: 'Azeites premiados e pratos gregos simples, feitos pra ficar a tarde toda com a família reunida.', tags: ['Azeite premiado', 'Pratos para dividir', 'Kids menu'] },
  '10': { description: 'Frutos do mar grelhados e vista pro pôr do sol — clima de taverna litorânea em pleno centro.', tags: ['Frutos do mar', 'Terraço com vista', 'Grupos grandes'] },
  '11': { description: 'Mezze libanês tradicional servido em travessas generosas, ótimo pra reunir a família inteira numa mesa só.', tags: ['Mezze libanês', 'Travessas para compartilhar', 'Kids menu'] },
  '12': { description: 'Bouzouki ao vivo às quintas e sextas, taças de vinho grego e petiscos até tarde.', tags: ['Música ao vivo', 'Vinhos gregos', 'Aberto até tarde'] },
  '13': { description: 'Massas artesanais e forno a lenha, clima de trattoria — feito pra ficar a tarde toda.', tags: ['Massas artesanais', 'Forno a lenha', 'Pet friendly'] },
  '14': { description: 'Massas frescas feitas na hora e carta de vinhos italianos extensa, num salão elegante pra ocasiões especiais.', tags: ['Massa fresca', 'Carta de vinhos', 'Romântico'] },
  '15': { description: 'Pizza napolitana de forno a lenha e mesas compridas — o point de família de domingo.', tags: ['Pizza napolitana', 'Forno a lenha', 'Kids menu'] },
  '16': { description: 'Harmonizações de massas autorais com vinhos importados, num salão pequeno e charmoso.', tags: ['Harmonização de vinhos', 'Menu degustação', 'Romântico'] },
  '17': { description: 'Massas rápidas e generosas, preço justo pra quem quer sair em grupo sem complicação.', tags: ['Preço justo', 'Porções generosas', 'Grupos grandes'] },
  '18': { description: 'Cozinha toscana tradicional, ambiente aconchegante e cardápio que muda com a estação.', tags: ['Cozinha toscana', 'Cardápio sazonal', 'Kids menu'] },
  '19': { description: 'Curries aromáticos e naan feito na hora, num salão intimista com luz baixa.', tags: ['Curry autoral', 'Naan artesanal', 'Romântico'] },
  '20': { description: 'Cardápio indiano completo com opções vegetarianas de sobra — ótimo pra levar a família toda.', tags: ['Opções vegetarianas', 'Kids menu', 'Buffet aos domingos'] },
  '21': { description: 'Menu degustação indiano com harmonização de especiarias, pensado pra grupos que querem experimentar de tudo.', tags: ['Menu degustação', 'Grupos grandes', 'Ambiente elegante'] },
  '22': { description: 'Receitas de família passadas de geração em geração, servidas num salão calmo e acolhedor.', tags: ['Receitas de família', 'Ambiente acolhedor', 'Vegetariano-friendly'] },
  '23': { description: 'Forno tandoor a vista, música indiana ao vivo nos fins de semana e drinks especiais.', tags: ['Forno tandoor', 'Música ao vivo', 'Drinks autorais'] },
  '24': { description: 'Cozinha indiana contemporânea com pratos autorais e carta de coquetéis, num salão sofisticado pra um encontro especial.', tags: ['Cozinha autoral', 'Carta de coquetéis', 'Romântico'] },
  '25': { description: 'Wok rápido e porções fartas — clássico point de galera depois do trabalho.', tags: ['Porções generosas', 'Preço justo', 'Delivery rápido'] },
  '26': { description: 'Salão discreto com mesas reservadas, clima perfeito pra uma noite tranquila a dois.', tags: ['Ambiente intimista', 'Chá de cortesia', 'Romântico'] },
  '27': { description: 'Buffet ao quilo com clássicos chineses — ótimo pra almoço em família sem compromisso.', tags: ['Buffet ao quilo', 'Kids menu', 'Almoço rápido'] },
  '28': { description: 'Culinária cantonesa tradicional, mesas redondas grandes feitas pra reunir a família inteira.', tags: ['Mesas grandes', 'Culinária cantonesa', 'Kids menu'] },
  '29': { description: 'Pato laqueado é a estrela da casa, servido num salão elegante decorado com lanternas tradicionais.', tags: ['Pato laqueado', 'Ambiente elegante', 'Grupos grandes'] },
  '30': { description: 'Karaokê nos fundos e petiscos até tarde — point animado de fim de semana.', tags: ['Karaokê', 'Aberto até tarde', 'Petiscos variados'] },
};

// Practical-info fields (opening hours, amenity flags, contact) are derived
// from each place's existing occasion/ambient/priceLevel/primaryType rather
// than hand-authored per restaurant — same efficiency precedent as reusing
// menus per cuisine above.

const OPENING_HOURS_PATTERNS: Record<string, string[]> = {
  STANDARD: [
    'Segunda-feira: 11:30 – 15:00, 18:30 – 23:00',
    'Terça-feira: 11:30 – 15:00, 18:30 – 23:00',
    'Quarta-feira: 11:30 – 15:00, 18:30 – 23:00',
    'Quinta-feira: 11:30 – 15:00, 18:30 – 23:00',
    'Sexta-feira: 11:30 – 15:00, 18:30 – 23:30',
    'Sábado: 12:00 – 23:30',
    'Domingo: 12:00 – 22:00',
  ],
  DINNER_ONLY_CLOSED_MONDAY: [
    'Segunda-feira: Fechado',
    'Terça-feira: 18:00 – 00:00',
    'Quarta-feira: 18:00 – 00:00',
    'Quinta-feira: 18:00 – 00:00',
    'Sexta-feira: 18:00 – 01:00',
    'Sábado: 18:00 – 01:00',
    'Domingo: 18:00 – 23:00',
  ],
  ALL_DAY: [
    'Segunda-feira: 11:00 – 23:00',
    'Terça-feira: 11:00 – 23:00',
    'Quarta-feira: 11:00 – 23:00',
    'Quinta-feira: 11:00 – 23:00',
    'Sexta-feira: 11:00 – 00:00',
    'Sábado: 11:00 – 00:00',
    'Domingo: 11:00 – 22:00',
  ],
  LATE_NIGHT_WEEKEND: [
    'Segunda-feira: Fechado',
    'Terça-feira: 18:00 – 23:00',
    'Quarta-feira: 18:00 – 23:00',
    'Quinta-feira: 18:00 – 23:00',
    'Sexta-feira: 18:00 – 01:00',
    'Sábado: 18:00 – 01:00',
    'Domingo: 12:00 – 17:00',
  ],
};

function weekdayDescriptionsFor(place: AppPlace): string[] {
  if (place.occasion === 'musica') return OPENING_HOURS_PATTERNS.LATE_NIGHT_WEEKEND;
  if (place.ambient === 'fancy') return OPENING_HOURS_PATTERNS.DINNER_ONLY_CLOSED_MONDAY;
  if (place.ambient === 'agitated') return OPENING_HOURS_PATTERNS.ALL_DAY;
  return OPENING_HOURS_PATTERNS.STANDARD;
}

function amenityFieldsFor(place: AppPlace): GoogleAmenityFields {
  return {
    delivery: true,
    takeout: true,
    dineIn: true,
    reservable: place.priceLevel !== 'PRICE_LEVEL_INEXPENSIVE',
    outdoorSeating: place.ambient === 'cozy' || place.ambient === 'relaxed',
    liveMusic: place.occasion === 'musica',
    goodForGroups: place.occasion === 'grupo',
    goodForChildren: place.occasion === 'familia',
    allowsDogs: place.ambient === 'relaxed' || place.ambient === 'cozy',
    wheelchairAccessibleEntrance: true,
    servesVegetarianFood: place.primaryType === 'mediterranean_restaurant' || place.primaryType === 'indian_restaurant',
    restroom: true,
  };
}

type ThingToKnowItem = { title: string; text: string };

const CANCELLATION: ThingToKnowItem = {
  title: 'Política de cancelamento',
  text: 'Cancelamentos com até 2h de antecedência não geram cobrança.',
};
const DRESS_CODE_SMART: ThingToKnowItem = { title: 'Traje', text: 'Traje esporte-fino recomendado à noite.' };
const DRESS_CODE_CASUAL: ThingToKnowItem = { title: 'Traje', text: 'Traje esportivo, sem restrições.' };
const PARKING: ThingToKnowItem = {
  title: 'Estacionamento',
  text: 'Manobrista disponível nos finais de semana.',
};
const KIDS: ThingToKnowItem = {
  title: 'Crianças',
  text: 'Cadeirões disponíveis mediante solicitação.',
};
const SAFETY: ThingToKnowItem = {
  title: 'Segurança e propriedade',
  text: 'Ambiente climatizado, câmeras de segurança no salão.',
};

function thingsToKnowFor(place: AppPlace, amenityFields: GoogleAmenityFields): ThingToKnowItem[] {
  const isUpscale = place.priceLevel === 'PRICE_LEVEL_EXPENSIVE' || place.priceLevel === 'PRICE_LEVEL_VERY_EXPENSIVE';
  const items = [CANCELLATION, isUpscale ? DRESS_CODE_SMART : DRESS_CODE_CASUAL];

  if (amenityFields.reservable) {
    items.push(PARKING);
  } else if (amenityFields.goodForChildren) {
    items.push(KIDS);
  } else {
    items.push(SAFETY);
  }

  return items;
}

function phoneFor(id: string): string {
  const n = Number(id);
  return `+55 11 3${String(1000 + n).padStart(4, '0')}-${String(4000 + n * 3).padStart(4, '0')}`;
}

function whatsappFor(id: string): string {
  const n = Number(id);
  return `+55 11 9${String(5000 + n).padStart(4, '0')}-${String(6000 + n * 3).padStart(4, '0')}`;
}

function instagramHandleFor(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
  return `@${slug}`;
}

// Instagram photos are plain URLs (see schema.ts's note on why \u2014 no Google
// contract to mirror here), cycling the same 6-photo pool everything else
// in the mocks reuses, offset by id so restaurants don't all show the same set.
function instagramPhotosFor(place: AppPlace): string[] {
  const idNum = Number(place.id);
  return Array.from({ length: 6 }, (_, i) => {
    const poolIndex = ((idNum + i) % 6) + 1;
    return photoUrlForMockName(`r${poolIndex}`) as string;
  });
}

// Reviews are composed from a small per-cuisine content pool (rating+text)
// combined with shared reviewer-name/relative-time pools cycled by id, not
// hand-authored per restaurant \u2014 same efficiency precedent as menus/hours.

type ReviewContent = { rating: number; text: string };

const REVIEWS_BY_PRIMARY_TYPE: Record<string, ReviewContent[]> = {
  brazilian_restaurant: [
    { rating: 5, text: 'Melhor rod\u00edzio da cidade! Carnes no ponto certo e atendimento impec\u00e1vel. A picanha estava excelente.' },
    { rating: 5, text: 'Ambiente \u00f3timo, carnes de primeira e o gar\u00e7om sempre atento pra repor. Voltarei com certeza.' },
    { rating: 4, text: 'Comida excelente, s\u00f3 achei o pre\u00e7o um pouco salgado pro que oferece.' },
  ],
  mediterranean_restaurant: [
    { rating: 5, text: 'Mezze maravilhoso e vinhos muito bem escolhidos. Lugar perfeito pra uma noite tranquila.' },
    { rating: 5, text: 'Card\u00e1pio saboroso e bem equilibrado, d\u00e1 pra sentir a qualidade dos ingredientes.' },
    { rating: 4, text: 'Muito bom, mas o atendimento demorou um pouco mais do que eu esperava.' },
  ],
  italian_restaurant: [
    { rating: 5, text: 'Massa fresca impec\u00e1vel, d\u00e1 pra sentir que \u00e9 feita na hora. Melhor italiana da regi\u00e3o.' },
    { rating: 5, text: 'Pizza excelente e ambiente aconchegante, perfeito pra um jantar em fam\u00edlia.' },
    { rating: 4, text: 'Comida muito boa, s\u00f3 achei o sal\u00e3o um pouco apertado nos hor\u00e1rios de pico.' },
  ],
  indian_restaurant: [
    { rating: 5, text: 'Curry maravilhoso, temperos na medida certa. Naan quentinho e fresco.' },
    { rating: 5, text: 'Melhor comida indiana que j\u00e1 comi em S\u00e3o Paulo. Atendimento super atencioso.' },
    { rating: 4, text: 'Muito saboroso, s\u00f3 achei os pratos um pouco picantes pro meu gosto.' },
  ],
  chinese_restaurant: [
    { rating: 5, text: 'Pato laqueado espetacular, crocante por fora e suculento por dentro.' },
    { rating: 5, text: 'Comida chinesa aut\u00eantica, sabores bem definidos e por\u00e7\u00f5es generosas.' },
    { rating: 4, text: 'Muito bom, mas o tempo de espera foi maior do que o esperado num dia de movimento.' },
  ],
};

const REVIEWER_NAMES = [
  'Christina Lamama',
  'Marcos Vin\u00edcius',
  'Ana Beatriz',
  'Rafael Souza',
  'Juliana Prado',
  'Lucas Ferreira',
  'Camila Rocha',
  'Bruno Alves',
  'Fernanda Lima',
  'Diego Martins',
];

const RELATIVE_TIMES = ['2 dias atr\u00e1s', '1 semana atr\u00e1s', '3 semanas atr\u00e1s', '1 m\u00eas atr\u00e1s', '2 meses atr\u00e1s'];

function reviewsFor(place: AppPlace) {
  const idNum = Number(place.id);
  const contents = REVIEWS_BY_PRIMARY_TYPE[place.primaryType];

  return contents.map((content, i) => ({
    relativePublishTimeDescription: RELATIVE_TIMES[(idNum + i) % RELATIVE_TIMES.length],
    rating: content.rating,
    text: { text: content.text, languageCode: 'pt-BR' },
    authorAttribution: { displayName: REVIEWER_NAMES[(idNum + i) % REVIEWER_NAMES.length] },
  }));
}

// Highlights have no Google equivalent \u2014 derived from the same signals as
// amenities/thingsToKnow (priceLevel/primaryType/occasion/amenity flags),
// padded with generic fallbacks so every restaurant gets exactly 3.
function highlightsFor(place: AppPlace, amenityFields: GoogleAmenityFields): string[] {
  const candidates: string[] = [];
  if (place.priceLevel === 'PRICE_LEVEL_INEXPENSIVE') candidates.push('Great value');
  if (place.primaryType === 'brazilian_restaurant') candidates.push('Big Portions');
  if (amenityFields.liveMusic) candidates.push('Live music');
  if (place.occasion === 'encontro') candidates.push('Romantic spot');
  if (amenityFields.goodForChildren) candidates.push('Family friendly');
  if (amenityFields.goodForGroups) candidates.push('Great for groups');
  if (amenityFields.servesVegetarianFood) candidates.push('Vegetarian options');
  candidates.push('Fast service', 'Variety');
  return Array.from(new Set(candidates)).slice(0, 3);
}

export const PLACE_DETAILS: Record<string, PlaceDetails> = Object.fromEntries(
  PLACES.map((place) => {
    const extras = EXTRAS_BY_ID[place.id];
    const primaryPoolIndex = Number(place.photos[0].name.replace('r', ''));
    const secondaryPoolIndex = (primaryPoolIndex % 6) + 1;
    const amenityFields = amenityFieldsFor(place);

    const details: PlaceDetails = {
      ...place,
      ...amenityFields,
      photos: [photoRef(primaryPoolIndex), photoRef(secondaryPoolIndex)],
      editorialSummary: { text: extras.description, languageCode: 'pt-BR' },
      tags: extras.tags,
      menu: MENU_BY_PRIMARY_TYPE[place.primaryType],
      internationalPhoneNumber: phoneFor(place.id),
      regularOpeningHours: { weekdayDescriptions: weekdayDescriptionsFor(place) },
      whatsapp: whatsappFor(place.id),
      instagramHandle: instagramHandleFor(place.displayName.text),
      instagramPhotos: instagramPhotosFor(place),
      thingsToKnow: thingsToKnowFor(place, amenityFields),
      reviews: reviewsFor(place),
      highlights: highlightsFor(place, amenityFields),
    };

    return [place.id, details];
  }),
);
