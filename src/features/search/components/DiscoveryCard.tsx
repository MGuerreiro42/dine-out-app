import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';

import type { DiscoveryCardData } from '@/features/search/hooks';

type DiscoveryCardProps = {
  restaurant: DiscoveryCardData;
  onPress: (restaurant: DiscoveryCardData) => void;
};

export function DiscoveryCard({ restaurant, onPress }: DiscoveryCardProps) {
  return (
    <Pressable onPress={() => onPress(restaurant)} className="w-[48%]">
      <View className="overflow-hidden rounded-2xl">
        <Image source={{ uri: restaurant.photo }} className="aspect-[4/3] w-full" />
        <View className="absolute left-2 top-2 flex-row items-center gap-1 rounded-full bg-black/85 px-2 py-1">
          <Ionicons name="star" size={10} color="#fff" />
          <Text className="text-[11px] font-bold text-white">{restaurant.rating}</Text>
        </View>
      </View>
      <Text className="mt-1.5 text-xs font-bold text-ink">{restaurant.name}</Text>
      <Text className="mt-0.5 text-[11px] text-muted">
        {restaurant.cuisineLabel} · {restaurant.priceLevel}
        {restaurant.distance ? ` · ${restaurant.distance}` : ''}
      </Text>
      {restaurant.discount ? (
        <View className="mt-1 self-start rounded-full bg-[#e4f0e6] px-2 py-1">
          <Text className="text-[10px] font-bold text-[#2f7a44]">{restaurant.discount}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
