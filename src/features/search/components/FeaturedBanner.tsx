import { Image, Text, View } from 'react-native';

import type { Restaurant } from '@/types';

type FeaturedBannerProps = {
  restaurant: Restaurant;
};

export function FeaturedBanner({ restaurant }: FeaturedBannerProps) {
  return (
    <View className="mx-4 mt-3.5 aspect-video overflow-hidden rounded-2xl">
      <Image source={{ uri: restaurant.photo }} className="h-full w-full" />
      <View className="absolute inset-0 bg-black/35" />
      <View className="absolute bottom-3.5 left-4">
        <Text className="text-[11px] text-white/85">Featured this week</Text>
        <Text className="text-base font-bold text-white">{restaurant.name}</Text>
      </View>
    </View>
  );
}
