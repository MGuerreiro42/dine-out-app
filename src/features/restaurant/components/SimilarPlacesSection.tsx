import { Text, View } from 'react-native';

import { HorizontalRail, RestaurantCard } from '@/components/ui';
import type { Restaurant } from '@/types';

type SimilarPlacesSectionProps = {
  similarPlaces: Restaurant[];
  onSelect: (restaurant: Restaurant) => void;
};

export function SimilarPlacesSection({ similarPlaces, onSelect }: SimilarPlacesSectionProps) {
  if (similarPlaces.length === 0) {
    return null;
  }

  return (
    <View className="border-t border-gray-100 py-5">
      <View className="mb-3 px-4">
        <Text className="text-base font-bold text-ink">Similar Places</Text>
      </View>
      <HorizontalRail>
        {similarPlaces.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} onPress={onSelect} />
        ))}
      </HorizontalRail>
    </View>
  );
}
