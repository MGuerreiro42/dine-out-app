import { Pressable, Text, View } from 'react-native';

import { HorizontalRail, Icon } from '@/components/ui';
import { HomeRestaurantCard } from '@/features/search/components/HomeRestaurantCard';
import type { HomeCardData } from '@/features/search/hooks';
import { colors, iconSize } from '@/theme';

type RestaurantSectionProps = {
  restaurants: HomeCardData[];
  onSelectRestaurant: (restaurant: HomeCardData) => void;
  onViewMore: () => void;
  viewMoreLabel?: string;
};

export function RestaurantSection({
  restaurants,
  onSelectRestaurant,
  onViewMore,
  viewMoreLabel = 'View more',
}: RestaurantSectionProps) {
  return (
    <View className="mt-md">
      <HorizontalRail>
        {restaurants.map((restaurant) => (
          <HomeRestaurantCard key={restaurant.id} restaurant={restaurant} onPress={onSelectRestaurant} />
        ))}
        <Pressable onPress={onViewMore} className="w-[90px] items-center justify-center gap-sm self-center">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-accent-tint">
            <Icon spec={{ set: 'Ionicons', name: 'arrow-forward' }} size={iconSize.ui} color={colors.accent} />
          </View>
          <Text className="text-xs font-medium text-accent">{viewMoreLabel}</Text>
        </Pressable>
      </HorizontalRail>
    </View>
  );
}
