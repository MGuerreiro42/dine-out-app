import type { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';

import type { IconSpec } from '@/components/ui/Icon';
import { PlaceDetailsSchema, mapPlaceToRestaurant, resolvePlacePhotoUrl } from '@/lib/googlePlaces';
import type { GoogleAmenityFields, PlaceDetails } from '@/lib/googlePlaces';
import { getPlaceDetails } from '@/mocks/repository';
import { RestaurantDetailSchema } from '@/features/restaurant/types';
import type { Amenity, OpeningHours, Review, RestaurantDetail } from '@/features/restaurant/types';

function icon(set: 'Ionicons', name: keyof typeof Ionicons.glyphMap): IconSpec;
function icon(set: 'MaterialCommunityIcons', name: keyof typeof MaterialCommunityIcons.glyphMap): IconSpec;
function icon(set: 'MaterialIcons', name: keyof typeof MaterialIcons.glyphMap): IconSpec;
function icon(set: IconSpec['set'], name: string): IconSpec {
  return { set, name } as IconSpec;
}

const AMENITY_RULES: { flag: keyof GoogleAmenityFields; icon: IconSpec; label: string }[] = [
  { flag: 'delivery', icon: icon('MaterialCommunityIcons', 'moped-outline'), label: 'Delivery' },
  { flag: 'takeout', icon: icon('MaterialCommunityIcons', 'food-takeout-box'), label: 'Retirada no local' },
  { flag: 'dineIn', icon: icon('Ionicons', 'restaurant-outline'), label: 'Consumo no local' },
  { flag: 'reservable', icon: icon('Ionicons', 'calendar-outline'), label: 'Aceita reservas' },
  { flag: 'outdoorSeating', icon: icon('Ionicons', 'sunny-outline'), label: 'Área externa' },
  { flag: 'liveMusic', icon: icon('Ionicons', 'musical-notes-outline'), label: 'Música ao vivo' },
  { flag: 'goodForGroups', icon: icon('Ionicons', 'people-outline'), label: 'Bom para grupos' },
  { flag: 'goodForChildren', icon: icon('MaterialIcons', 'child-care'), label: 'Kids friendly' },
  { flag: 'allowsDogs', icon: icon('MaterialCommunityIcons', 'paw'), label: 'Aceita pets' },
  { flag: 'wheelchairAccessibleEntrance', icon: icon('Ionicons', 'accessibility-outline'), label: 'Acessível' },
  { flag: 'servesVegetarianFood', icon: icon('MaterialCommunityIcons', 'leaf'), label: 'Opções vegetarianas' },
  { flag: 'restroom', icon: icon('MaterialIcons', 'wc'), label: 'Banheiro' },
];

function mapAmenities(place: PlaceDetails): Amenity[] {
  return AMENITY_RULES.filter((rule) => place[rule.flag]).map(({ icon, label }) => ({ icon, label }));
}

function mapOpeningHours(weekdayDescriptions: string[]): OpeningHours[] {
  return weekdayDescriptions.map((entry) => {
    const [day, hours] = entry.split(': ');
    return { day, hours: hours ?? '' };
  });
}

function mapReviews(place: PlaceDetails): Review[] {
  return place.reviews.map((review) => ({
    name: review.authorAttribution.displayName,
    time: review.relativePublishTimeDescription,
    rating: review.rating,
    text: review.text.text,
  }));
}

export function useRestaurantDetailQuery(id: number) {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      const data = await getPlaceDetails(String(id));
      if (!data) {
        return null;
      }

      const place = PlaceDetailsSchema.parse(data);

      const photoUrls = await Promise.all(place.photos.map((photo) => resolvePlacePhotoUrl(photo.name)));
      const base = mapPlaceToRestaurant(place, photoUrls[0]);

      const detail: RestaurantDetail = {
        ...base,
        photos: photoUrls,
        description: place.editorialSummary.text,
        tags: place.tags,
        addressShort: place.formattedAddress,
        menu: place.menu,
        amenities: mapAmenities(place),
        openingHours: mapOpeningHours(place.regularOpeningHours.weekdayDescriptions),
        thingsToKnow: place.thingsToKnow,
        phone: place.internationalPhoneNumber,
        whatsapp: place.whatsapp,
        instagramHandle: place.instagramHandle,
        instagramPhotos: place.instagramPhotos,
        reviews: mapReviews(place),
        reviewCount: place.userRatingCount,
        highlights: place.highlights,
      };

      return RestaurantDetailSchema.parse(detail);
    },
  });
}
