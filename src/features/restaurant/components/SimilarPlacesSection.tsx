import { Text, View } from 'react-native';

import { HorizontalRail, Icon, RestaurantCard } from '@/components/ui';
import type { Restaurant } from '@/types';
import { colors, iconSize } from '@/theme';

type SimilarPlacesSectionProps = {
  similarPlaces: Restaurant[];
  onSelect: (restaurant: Restaurant) => void;
};

export function SimilarPlacesSection({ similarPlaces, onSelect }: SimilarPlacesSectionProps) {
  if (similarPlaces.length === 0) {
    return null;
  }

  return (
    <View className="border-t border-sand-border py-md2">
      <View className="mb-sm2 flex-row items-center gap-sm px-md">
        <Icon
          spec={{ set: 'MaterialCommunityIcons', name: 'crown-outline' }}
          size={iconSize.inline}
          color={colors.accent}
        />
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
