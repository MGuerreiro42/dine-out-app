import { Image, Pressable, Text, View } from 'react-native';

import { Icon, PhotoPlaceholder } from '@/components/ui';
import type { MapResultData } from '@/features/search/hooks';
import { useFavoritesStore } from '@/stores/favorites';
import { colors, iconSize } from '@/theme';

type MapResultCardProps = {
  restaurant: MapResultData;
  onPress: (restaurant: MapResultData) => void;
};

export function MapResultCard({ restaurant, onPress }: MapResultCardProps) {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(restaurant.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  return (
    <Pressable onPress={() => onPress(restaurant)} className="flex-row gap-sm2">
      <View className="relative overflow-hidden rounded-lg">
        {restaurant.photo ? (
          <Image source={{ uri: restaurant.photo }} className="h-[110px] w-[130px]" />
        ) : (
          <PhotoPlaceholder className="h-[110px] w-[130px]" iconSize={iconSize.ui} />
        )}
        <View className="absolute left-sm top-sm flex-row items-center gap-xs rounded-lg bg-black/70 px-sm py-xs">
          <Icon spec={{ set: 'Ionicons', name: 'location-outline' }} size={iconSize.micro} color={colors.white} />
          <Text className="text-caption font-bold text-white">{restaurant.distance}</Text>
        </View>
        <View className="absolute right-sm top-sm flex-row gap-xs">
          <Pressable
            onPress={() => toggleFavorite(restaurant.id)}
            className={`h-6 w-6 items-center justify-center rounded-full ${isFavorite ? 'bg-danger-tint' : 'bg-white/90'}`}
          >
            <Icon
              spec={{ set: 'Ionicons', name: 'heart-outline' }}
              size={iconSize.micro}
              color={isFavorite ? colors.danger : colors.inkMuted}
            />
          </Pressable>
        </View>
      </View>

      <View className="flex-1 justify-center">
        <Text className="text-sm font-bold text-ink" numberOfLines={1}>
          {restaurant.name}
        </Text>
        {restaurant.rating !== null || restaurant.priceLevel !== null ? (
          <View className="mt-xs flex-row items-center gap-xs">
            <Icon spec={{ set: 'Ionicons', name: 'star' }} size={iconSize.micro} color={colors.rating} />
            <Text className="text-xs text-muted">
              {[restaurant.rating, restaurant.priceLevel].filter((value): value is string => value !== null).join(' · ')}
            </Text>
          </View>
        ) : null}
        <Text className="mt-xs text-xs text-muted">{restaurant.cuisineLabel}</Text>
        {restaurant.tags.length > 0 ? (
          <View className="mt-sm flex-row flex-wrap gap-xs">
            {restaurant.tags.slice(0, 2).map((tag) => (
              <View key={tag} className="rounded-full bg-accent-tint px-sm py-xs">
                <Text className="text-caption font-light text-accent">{tag.toLowerCase()}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
