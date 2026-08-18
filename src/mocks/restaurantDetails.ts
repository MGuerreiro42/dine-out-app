import type { AppPlace, GoogleAmenityFields, PlaceDetails } from '@/lib/googlePlaces';
import { PLACES, photoRef, photoUrlForMockName } from '@/mocks/restaurants';

type MenuItem = { name: string; price: string };

const BRAZILIAN_MENU: MenuItem[] = [
  { name: 'Grilled picanha', price: 'R$ 89' },
  { name: 'Flank steak', price: 'R$ 79' },
  { name: 'Slow-roasted short rib', price: 'R$ 95' },
  { name: 'Salad buffet', price: 'included' },
  { name: 'Farofa & vinaigrette', price: 'included' },
  { name: 'Dessert: grilled pineapple', price: 'R$ 18' },
];

const MEDITERRANEAN_MENU: MenuItem[] = [
  { name: 'Sharing mezze', price: 'R$ 62' },
  { name: 'Grilled lamb', price: 'R$ 98' },
  { name: 'House hummus', price: 'R$ 32' },
  { name: 'Artisan Syrian bread', price: 'included' },
];

const ITALIAN_MENU: MenuItem[] = [
  { name: 'Tagliatelle al ragù', price: 'R$ 68' },
  { name: 'Mushroom risotto', price: 'R$ 74' },
  { name: 'Pizza margherita', price: 'R$ 56' },
];

const INDIAN_MENU: MenuItem[] = [
  { name: 'Chicken tikka masala', price: 'R$ 68' },
  { name: 'Lamb curry', price: 'R$ 82' },
  { name: 'Garlic naan', price: 'included' },
  { name: 'Vegetable samosas', price: 'R$ 28' },
  { name: 'Basmati rice', price: 'included' },
];

const CHINESE_MENU: MenuItem[] = [
  { name: 'Peking duck', price: 'R$ 96' },
  { name: 'Vegetable yakisoba', price: 'R$ 52' },
  { name: 'Assorted dim sum', price: 'R$ 46' },
  { name: 'Kung pao chicken', price: 'R$ 58' },
  { name: 'Wonton soup', price: 'R$ 32' },
];

const MENU_BY_PRIMARY_TYPE: Record<string, MenuItem[]> = {
  brazilian_restaurant: BRAZILIAN_MENU,
  mediterranean_restaurant: MEDITERRANEAN_MENU,
  italian_restaurant: ITALIAN_MENU,
  indian_restaurant: INDIAN_MENU,
  chinese_restaurant: CHINESE_MENU,
};

const EXTRAS_BY_ID: Record<string, { description: string; tags: string[] }> = {
  '1': { description: 'A classic all-you-can-eat churrascaria with hand-picked cuts, grilled over charcoal in the traditional gaúcho style. Laid-back atmosphere with live music on Fridays and Saturdays, great for families and large groups.', tags: ['Brazilian BBQ', 'All-you-can-eat', 'Live music'] },
  '2': { description: 'Spacious rooms for groups, a full sides buffet and prime cuts straight off the grill.', tags: ['Large groups', 'Full buffet', 'Parking'] },
  '3': { description: 'Skewers, ice-cold draft beer and live music every weekend — classic neighborhood bar vibe.', tags: ['Live music', 'Draft beer', 'Pet friendly'] },
  '4': { description: '12-hour slow-roasted short rib and homestyle sides, in an intimate room made for lingering over a date.', tags: ['12h short rib', 'Intimate setting', 'Curated wines'] },
  '5': { description: 'Rustic barbecue buffet built for families — a kids’ playground and communal tables.', tags: ['Kids’ playground', 'All-you-can-eat buffet', 'Parking'] },
  '6': { description: 'Quick skewers and generous portions for a crowd that wants to eat well without spending much.', tags: ['Fair prices', 'Big portions', 'Fast delivery'] },
  '7': { description: 'Sharing mezze and a candlelit terrace. A menu inspired by the Mediterranean coast, with light dishes and hand-picked natural wines.', tags: ['Terrace', 'Vegetarian-friendly', 'Romantic'] },
  '8': { description: 'Turkish cold plates and natural wines, an intimate setting for a quiet night for two.', tags: ['Natural wines', 'Intimate', 'Gluten-free'] },
  '9': { description: 'Award-winning olive oils and simple Greek dishes, made for lingering all afternoon with the whole family.', tags: ['Award-winning olive oil', 'Sharing plates', 'Kids menu'] },
  '10': { description: 'Grilled seafood and sunset views — a coastal tavern feel right in the middle of the city.', tags: ['Seafood', 'Terrace with a view', 'Large groups'] },
  '11': { description: 'Traditional Lebanese mezze served on generous platters, great for bringing the whole family to one table.', tags: ['Lebanese mezze', 'Sharing platters', 'Kids menu'] },
  '12': { description: 'Live bouzouki on Thursdays and Fridays, glasses of Greek wine and snacks late into the night.', tags: ['Live music', 'Greek wines', 'Open late'] },
  '13': { description: 'Handmade pasta and a wood-fired oven, trattoria vibe — made for lingering all afternoon.', tags: ['Handmade pasta', 'Wood-fired oven', 'Pet friendly'] },
  '14': { description: 'Fresh pasta made to order and an extensive Italian wine list, in an elegant room for special occasions.', tags: ['Fresh pasta', 'Wine list', 'Romantic'] },
  '15': { description: 'Wood-fired Neapolitan pizza and long tables — the Sunday family spot.', tags: ['Neapolitan pizza', 'Wood-fired oven', 'Kids menu'] },
  '16': { description: 'Signature pasta pairings with imported wines, in a small, charming room.', tags: ['Wine pairings', 'Tasting menu', 'Romantic'] },
  '17': { description: 'Quick, generous pasta at a fair price for a no-fuss night out with the group.', tags: ['Fair prices', 'Generous portions', 'Large groups'] },
  '18': { description: 'Traditional Tuscan cooking, a cozy atmosphere and a menu that changes with the season.', tags: ['Tuscan cuisine', 'Seasonal menu', 'Kids menu'] },
  '19': { description: 'Aromatic curries and naan made to order, in an intimate, low-lit room.', tags: ['Signature curry', 'Handmade naan', 'Romantic'] },
  '20': { description: 'A full Indian menu with plenty of vegetarian options — great for bringing the whole family.', tags: ['Vegetarian options', 'Kids menu', 'Sunday buffet'] },
  '21': { description: 'An Indian tasting menu with spice pairings, built for groups who want to try a bit of everything.', tags: ['Tasting menu', 'Large groups', 'Elegant setting'] },
  '22': { description: 'Family recipes passed down through generations, served in a calm, welcoming room.', tags: ['Family recipes', 'Welcoming atmosphere', 'Vegetarian-friendly'] },
  '23': { description: 'An open tandoor oven, live Indian music on weekends and specialty drinks.', tags: ['Tandoor oven', 'Live music', 'Signature drinks'] },
  '24': { description: 'Contemporary Indian cooking with signature dishes and a cocktail list, in a sophisticated room for a special date.', tags: ['Signature cooking', 'Cocktail list', 'Romantic'] },
  '25': { description: 'Fast wok cooking and hearty portions — the classic after-work spot.', tags: ['Generous portions', 'Fair prices', 'Fast delivery'] },
  '26': { description: 'A discreet room with reserved tables, perfect for a quiet night for two.', tags: ['Intimate setting', 'Complimentary tea', 'Romantic'] },
  '27': { description: 'Pay-by-weight buffet with Chinese classics — great for a casual family lunch.', tags: ['Pay-by-weight buffet', 'Kids menu', 'Quick lunch'] },
  '28': { description: 'Traditional Cantonese cooking, with big round tables made for bringing the whole family together.', tags: ['Large tables', 'Cantonese cuisine', 'Kids menu'] },
  '29': { description: 'Peking duck is the house specialty, served in an elegant room decorated with traditional lanterns.', tags: ['Peking duck', 'Elegant setting', 'Large groups'] },
  '30': { description: 'Karaoke in the back and snacks until late — a lively weekend spot.', tags: ['Karaoke', 'Open late', 'Assorted snacks'] },
};

const OPENING_HOURS_PATTERNS: Record<string, string[]> = {
  STANDARD: [
    'Monday: 11:30 AM – 3:00 PM, 6:30 – 11:00 PM',
    'Tuesday: 11:30 AM – 3:00 PM, 6:30 – 11:00 PM',
    'Wednesday: 11:30 AM – 3:00 PM, 6:30 – 11:00 PM',
    'Thursday: 11:30 AM – 3:00 PM, 6:30 – 11:00 PM',
    'Friday: 11:30 AM – 3:00 PM, 6:30 – 11:30 PM',
    'Saturday: 12:00 – 11:30 PM',
    'Sunday: 12:00 – 10:00 PM',
  ],
  DINNER_ONLY_CLOSED_MONDAY: [
    'Monday: Closed',
    'Tuesday: 6:00 PM – 12:00 AM',
    'Wednesday: 6:00 PM – 12:00 AM',
    'Thursday: 6:00 PM – 12:00 AM',
    'Friday: 6:00 PM – 1:00 AM',
    'Saturday: 6:00 PM – 1:00 AM',
    'Sunday: 6:00 – 11:00 PM',
  ],
  ALL_DAY: [
    'Monday: 11:00 AM – 11:00 PM',
    'Tuesday: 11:00 AM – 11:00 PM',
    'Wednesday: 11:00 AM – 11:00 PM',
    'Thursday: 11:00 AM – 11:00 PM',
    'Friday: 11:00 AM – 12:00 AM',
    'Saturday: 11:00 AM – 12:00 AM',
    'Sunday: 11:00 AM – 10:00 PM',
  ],
  LATE_NIGHT_WEEKEND: [
    'Monday: Closed',
    'Tuesday: 6:00 – 11:00 PM',
    'Wednesday: 6:00 – 11:00 PM',
    'Thursday: 6:00 – 11:00 PM',
    'Friday: 6:00 PM – 1:00 AM',
    'Saturday: 6:00 PM – 1:00 AM',
    'Sunday: 12:00 – 5:00 PM',
  ],
};

function weekdayDescriptionsFor(place: AppPlace): string[] {
  if (place.occasion === 'music') return OPENING_HOURS_PATTERNS.LATE_NIGHT_WEEKEND;
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
    liveMusic: place.occasion === 'music',
    goodForGroups: place.occasion === 'group',
    goodForChildren: place.occasion === 'family',
    allowsDogs: place.ambient === 'relaxed' || place.ambient === 'cozy',
    wheelchairAccessibleEntrance: true,
    servesVegetarianFood: place.primaryType === 'mediterranean_restaurant' || place.primaryType === 'indian_restaurant',
    restroom: true,
  };
}

type ThingToKnowItem = { title: string; text: string };

const CANCELLATION: ThingToKnowItem = {
  title: 'Cancellation policy',
  text: 'Cancellations up to 2h in advance incur no charge.',
};
const DRESS_CODE_SMART: ThingToKnowItem = { title: 'Dress code', text: 'Smart casual recommended in the evening.' };
const DRESS_CODE_CASUAL: ThingToKnowItem = { title: 'Dress code', text: 'Casual, no restrictions.' };
const PARKING: ThingToKnowItem = {
  title: 'Parking',
  text: 'Valet available on weekends.',
};
const KIDS: ThingToKnowItem = {
  title: 'Kids',
  text: 'High chairs available on request.',
};
const SAFETY: ThingToKnowItem = {
  title: 'Safety and property',
  text: 'Air-conditioned room, security cameras on site.',
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

function instagramPhotosFor(place: AppPlace): string[] {
  const idNum = Number(place.id);
  return Array.from({ length: 6 }, (_, i) => {
    const poolIndex = ((idNum + i) % 6) + 1;
    return photoUrlForMockName(`r${poolIndex}`) as string;
  });
}

type ReviewContent = { rating: number; text: string };

const REVIEWS_BY_PRIMARY_TYPE: Record<string, ReviewContent[]> = {
  brazilian_restaurant: [
    { rating: 5, text: 'Best all-you-can-eat in the city! Meat cooked just right and impeccable service. The picanha was excellent.' },
    { rating: 5, text: 'Great atmosphere, top-quality meat and the waiter was always attentive with refills. Definitely coming back.' },
    { rating: 4, text: 'Excellent food, just found the price a bit steep for what it offers.' },
  ],
  mediterranean_restaurant: [
    { rating: 5, text: 'Wonderful mezze and very well-chosen wines. Perfect place for a quiet night.' },
    { rating: 5, text: 'Flavorful, well-balanced menu \u2014 you can tell the ingredients are quality.' },
    { rating: 4, text: 'Very good, but service took a bit longer than I expected.' },
  ],
  italian_restaurant: [
    { rating: 5, text: 'Impeccable fresh pasta, you can tell it\u2019s made to order. Best Italian in the area.' },
    { rating: 5, text: 'Excellent pizza and a cozy atmosphere, perfect for a family dinner.' },
    { rating: 4, text: 'Very good food, just found the dining room a bit cramped at peak hours.' },
  ],
  indian_restaurant: [
    { rating: 5, text: 'Wonderful curry, spices just right. Naan warm and fresh.' },
    { rating: 5, text: 'Best Indian food I\u2019ve had in S\u00e3o Paulo. Super attentive service.' },
    { rating: 4, text: 'Very tasty, just found the dishes a bit too spicy for my taste.' },
  ],
  chinese_restaurant: [
    { rating: 5, text: 'Spectacular Peking duck, crispy outside and juicy inside.' },
    { rating: 5, text: 'Authentic Chinese food, well-defined flavors and generous portions.' },
    { rating: 4, text: 'Very good, but the wait was longer than expected on a busy day.' },
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

const RELATIVE_TIMES = ['2 days ago', '1 week ago', '3 weeks ago', '1 month ago', '2 months ago'];

function reviewsFor(place: AppPlace) {
  const idNum = Number(place.id);
  const contents = REVIEWS_BY_PRIMARY_TYPE[place.primaryType];

  return contents.map((content, i) => ({
    relativePublishTimeDescription: RELATIVE_TIMES[(idNum + i) % RELATIVE_TIMES.length],
    rating: content.rating,
    text: { text: content.text, languageCode: 'en' },
    authorAttribution: { displayName: REVIEWER_NAMES[(idNum + i) % REVIEWER_NAMES.length] },
  }));
}

const HIGHLIGHT_DETAILS: Record<string, { title: string; description: string }> = {
  'Great value': { title: 'Great Value', description: 'Generous portions at a fair price.' },
  'Big Portions': { title: 'Big Portions', description: 'Hearty servings, made to share.' },
  'Live music': { title: 'Live Music', description: 'Enjoy live performances on select nights.' },
  'Romantic spot': { title: 'Romantic Spot', description: 'An intimate setting, perfect for a date night.' },
  'Family friendly': { title: 'Family Friendly', description: 'A relaxed atmosphere that welcomes kids.' },
  'Great for groups': { title: 'Great for Groups', description: 'Spacious seating for larger parties.' },
  'Vegetarian options': { title: 'Vegetarian Options', description: 'A thoughtful selection of plant-based dishes.' },
  'Fast service': { title: 'Fast Service', description: 'Attentive staff, quick to the table.' },
  Variety: { title: 'Great Variety', description: 'A diverse menu with something for everyone.' },
};

function highlightsFor(place: AppPlace, amenityFields: GoogleAmenityFields) {
  const candidates: string[] = [];
  if (place.priceLevel === 'PRICE_LEVEL_INEXPENSIVE') candidates.push('Great value');
  if (place.primaryType === 'brazilian_restaurant') candidates.push('Big Portions');
  if (amenityFields.liveMusic) candidates.push('Live music');
  if (place.occasion === 'date') candidates.push('Romantic spot');
  if (amenityFields.goodForChildren) candidates.push('Family friendly');
  if (amenityFields.goodForGroups) candidates.push('Great for groups');
  if (amenityFields.servesVegetarianFood) candidates.push('Vegetarian options');
  candidates.push('Fast service', 'Variety');
  return Array.from(new Set(candidates))
    .slice(0, 3)
    .map((label) => HIGHLIGHT_DETAILS[label]);
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
      editorialSummary: { text: extras.description, languageCode: 'en' },
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
