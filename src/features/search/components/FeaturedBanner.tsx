import { Image, Text, View } from 'react-native';

import type { Restaurant } from '@/types';

type FeaturedBannerProps = {
  restaurant: Restaurant;
  tagline: string;
};

export function FeaturedBanner({ restaurant, tagline }: FeaturedBannerProps) {
  return (
    <View>
      <View className="mx-4 mt-1.5 aspect-[16/7] overflow-hidden rounded-2xl">
        <Image source={{ uri: restaurant.photo }} className="h-full w-full" />
        <View className="absolute inset-0 bg-black/35" />
        <View className="absolute left-3.5 top-3.5 rounded-full bg-[#e0e7ff] px-2.5 py-1">
          <Text className="text-[12px] font-light text-[#4338ca]">Featured</Text>
        </View>
        <View className="absolute bottom-3.5 left-4 right-4">
          <Text className="text-lg font-bold text-white">{restaurant.name}</Text>
          <Text className="text-xs text-white/85" numberOfLines={1}>
            {tagline}
          </Text>
        </View>
      </View>
      <View className="mt-2.5 flex-row items-center justify-center gap-1.5">
        <View className="h-1.5 w-4 rounded-full bg-[#6366f1]" />
        <View className="h-1.5 w-1.5 rounded-full bg-[#e5e7eb]" />
        <View className="h-1.5 w-1.5 rounded-full bg-[#e5e7eb]" />
      </View>
    </View>
  );
}
