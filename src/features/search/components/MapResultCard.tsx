import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';

import type { MapResultData } from '@/features/search/hooks';

type MapResultCardProps = {
  restaurant: MapResultData;
  onPress: (restaurant: MapResultData) => void;
};

export function MapResultCard({ restaurant, onPress }: MapResultCardProps) {
  const statusLabel = restaurant.isOpenNow ? 'Aberto' : 'Fechado';
  const statusClassName = restaurant.isOpenNow ? 'bg-[#e4f0e6] text-[#2f7a44]' : 'bg-[#f5e4e4] text-[#a13f3f]';

  return (
    <Pressable onPress={() => onPress(restaurant)} className="flex-row gap-3">
      <Image source={{ uri: restaurant.photo }} className="h-24 w-[84px] rounded-xl" />
      <View className="flex-1">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-xs font-bold text-ink">{restaurant.name}</Text>
          <Text className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${statusClassName}`}>{statusLabel}</Text>
        </View>
        <Text className="mt-0.5 text-[11px] text-muted">
          {restaurant.cuisineLabel} · {restaurant.priceLevel} · {restaurant.distance}
        </Text>
        <View className="mt-0.5 flex-row items-center gap-1">
          <Ionicons name="star" size={10} color="#8a8580" />
          <Text className="text-[11px] text-muted">
            {restaurant.rating} ({restaurant.reviewCount})
          </Text>
        </View>
        <Text className="mt-1 text-xs leading-tight text-ink/80">{restaurant.tagline}</Text>
        <View className="mt-1.5 flex-row flex-wrap gap-1">
          {restaurant.tags.map((tag) => (
            <View key={tag} className="rounded-full bg-sand px-2 py-1">
              <Text className="text-[10px] font-bold text-ink">{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}
