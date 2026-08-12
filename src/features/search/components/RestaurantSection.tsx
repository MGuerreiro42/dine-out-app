import { Pressable, Text, View } from 'react-native';

import { HorizontalRail, Icon } from '@/components/ui';
import { HomeRestaurantCard } from '@/features/search/components/HomeRestaurantCard';
import type { HomeCardData } from '@/features/search/hooks';

type RestaurantSectionProps = {
  restaurants: HomeCardData[];
  onSelectRestaurant: (restaurant: HomeCardData) => void;
  onViewMore: () => void;
  viewMoreLabel?: string;
};

// "View more" lives as a trailing tile inside the rail itself, rather than a
// full-width button row below it — keeps the CTA reachable without spending
// an extra row of vertical space on every section.
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
        <Pressable onPress={onViewMore} className="w-[90px] items-center justify-center gap-1.5 self-center">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-[#eef2ff]">
            <Icon spec={{ set: 'Ionicons', name: 'arrow-forward' }} size={18} color="#4f46e5" />
          </View>
          <Text className="text-xs font-medium text-[#4f46e5]">{viewMoreLabel}</Text>
        </Pressable>
      </HorizontalRail>
    </View>
  );
}
