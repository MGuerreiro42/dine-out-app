import { Pressable, ScrollView, Text, View } from 'react-native';

import type { HomeCardData } from '@/features/search/hooks';

type BrandRailProps = {
  restaurants: HomeCardData[];
  onSelectRestaurant: (restaurant: HomeCardData) => void;
};

export function BrandRail({ restaurants, onSelectRestaurant }: BrandRailProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
    >
      {restaurants.map((restaurant) => (
        <Pressable
          key={restaurant.id}
          onPress={() => onSelectRestaurant(restaurant)}
          className="w-24 items-center gap-sm"
        >
          <View className="h-[72px] w-[72px] items-center justify-center rounded-lg border border-sand bg-white shadow-md shadow-black/10">
            <Text className="text-lg font-bold text-accent">
              {(restaurant.brandName ?? '').charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="text-center text-caption font-bold text-ink" numberOfLines={1}>
            {restaurant.brandName}
          </Text>
          <Text className="text-caption text-muted">{restaurant.distanceLabel}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
