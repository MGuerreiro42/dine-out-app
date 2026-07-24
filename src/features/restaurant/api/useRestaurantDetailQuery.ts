import { useQuery } from '@tanstack/react-query';

import { ApiError, apiClient } from '@/lib/apiClient';
import {
  GOOGLE_PLACES_BASE_URL,
  PlaceDetailsSchema,
  mapPlaceToRestaurant,
  resolvePlacePhotoUrl,
} from '@/lib/googlePlaces';
import type { GoogleAmenityFields, PlaceDetails } from '@/lib/googlePlaces';
import { RestaurantDetailSchema } from '@/features/restaurant/types';
import type { Amenity, OpeningHours, Review, RestaurantDetail } from '@/features/restaurant/types';

/**
 * Presentation-only lookup: turns Google's real (flat) boolean amenity
 * fields into the icon+label pairs the Amenities section actually renders.
 * Not part of the wire contract — Google doesn't send icons.
 */
const AMENITY_RULES: { flag: keyof GoogleAmenityFields; icon: string; label: string }[] = [
  { flag: 'delivery', icon: '🛵', label: 'Delivery' },
  { flag: 'takeout', icon: '🥡', label: 'Retirada no local' },
  { flag: 'dineIn', icon: '🍽️', label: 'Consumo no local' },
  { flag: 'reservable', icon: '📅', label: 'Aceita reservas' },
  { flag: 'outdoorSeating', icon: '🌳', label: 'Área externa' },
  { flag: 'liveMusic', icon: '🎵', label: 'Música ao vivo' },
  { flag: 'goodForGroups', icon: '👥', label: 'Bom para grupos' },
  { flag: 'goodForChildren', icon: '👶', label: 'Kids friendly' },
  { flag: 'allowsDogs', icon: '🐾', label: 'Aceita pets' },
  { flag: 'wheelchairAccessibleEntrance', icon: '♿', label: 'Acessível' },
  { flag: 'servesVegetarianFood', icon: '🥗', label: 'Opções vegetarianas' },
  { flag: 'restroom', icon: '🚻', label: 'Banheiro' },
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
      try {
        const data = await apiClient.get<unknown>(`${GOOGLE_PLACES_BASE_URL}/places/${id}`);
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
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });
}
