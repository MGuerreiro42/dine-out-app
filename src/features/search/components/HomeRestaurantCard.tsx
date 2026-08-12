import { Alert, Image, Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui';
import type { HomeCardData } from '@/features/search/hooks';
import { useFavoritesStore } from '@/stores/favorites';

type HomeRestaurantCardProps = {
  restaurant: HomeCardData;
  onPress: (restaurant: HomeCardData) => void;
};

/**
 * Search feature's card — visually distinct from the shared `RestaurantCard`
 * (still used by the restaurant detail screen's Similar Places rail). Used by
 * Home's rails and the generic TypeDetailScreen/TypeOverviewScreen grids.
 */
export function HomeRestaurantCard({ restaurant, onPress }: HomeRestaurantCardProps) {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(restaurant.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  return (
    <Pressable
      onPress={() => onPress(restaurant)}
      className="w-[130px] overflow-hidden rounded-xl bg-white shadow-md shadow-black/10"
    >
      <View className="relative">
        <Image source={{ uri: restaurant.photo }} className="aspect-[4/3] w-full" />
        {restaurant.isOpenNow ? (
          <View className="absolute left-1.5 top-1.5 rounded-full bg-[#dcfce7] px-1.5 py-0.5">
            <Text className="text-[11px] font-light text-[#16a34a]">Open</Text>
          </View>
        ) : null}
        <View className="absolute right-1.5 top-1.5 flex-row gap-1">
          <Pressable
            onPress={() => toggleFavorite(restaurant.id)}
            className={`h-6 w-6 items-center justify-center rounded-full ${isFavorite ? 'bg-[#fee2e2]' : 'bg-white/90'}`}
          >
            <Icon
              spec={{ set: 'Ionicons', name: 'heart-outline' }}
              size={12}
              color={isFavorite ? '#e11d48' : '#374151'}
            />
          </Pressable>
          <Pressable
            onPress={() => Alert.alert('Compartilhar', 'Em breve.')}
            className="h-6 w-6 items-center justify-center rounded-full bg-white/90"
          >
            <Icon spec={{ set: 'Ionicons', name: 'share-outline' }} size={12} color="#374151" />
          </Pressable>
        </View>
      </View>

      <View className="p-2">
        <Text className="text-xs font-bold text-[#111827]" numberOfLines={1}>
          {restaurant.name}
        </Text>
        <View className="mt-xs flex-row items-center gap-1">
          <Icon spec={{ set: 'Ionicons', name: 'star' }} size={10} color="#fbbf24" />
          <Text className="text-[13px] text-[#6b7280]" numberOfLines={1}>
            {restaurant.rating} · {restaurant.priceLevel}
          </Text>
        </View>
        <Text className="mt-xs text-[13px] text-[#6b7280]" numberOfLines={1}>
          {restaurant.cuisineLabel.toLowerCase()}
        </Text>
        {restaurant.tags.length > 0 ? (
          <View className="mt-sm flex-row flex-wrap gap-1">
            {restaurant.tags.slice(0, 1).map((tag) => (
              <View key={tag} className="rounded-full bg-[#e0e7ff] px-1.5 py-0.5">
                <Text className="text-[11px] font-light text-[#4338ca]">{tag.toLowerCase()}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
