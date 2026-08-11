import { Image, Pressable, Text, View } from 'react-native';

import type { Cuisine } from '@/features/search/types';

type CuisineOverviewCardProps = {
  cuisine: Cuisine;
  onPress: (cuisine: Cuisine) => void;
};

export function CuisineOverviewCard({ cuisine, onPress }: CuisineOverviewCardProps) {
  return (
    <Pressable onPress={() => onPress(cuisine)} className="w-[48%] md:w-[31%] lg:w-[23%]">
      <View className="aspect-square overflow-hidden rounded-2xl">
        <Image source={{ uri: cuisine.photo }} className="h-full w-full" />
      </View>
      <Text className="mt-1.5 text-sm font-bold text-ink">{cuisine.label}</Text>
    </Pressable>
  );
}
