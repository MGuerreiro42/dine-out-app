import { Image, Pressable, Text, View } from 'react-native';

import type { Restaurant } from '@/types';

import { RatingBadge } from './RatingBadge';

type RestaurantCardProps = {
  restaurant: Restaurant;
  onPress: (restaurant: Restaurant) => void;
};

export function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  return (
    <Pressable onPress={() => onPress(restaurant)} className="w-[150px]">
      <Image source={{ uri: restaurant.photo }} className="h-[110px] w-[150px] rounded-2xl" />
      <View className="mt-1.5">
        <Text className="text-sm font-bold">{restaurant.name}</Text>
        <RatingBadge rating={restaurant.rating} priceLevel={restaurant.priceLevel} />
      </View>
    </Pressable>
  );
}
