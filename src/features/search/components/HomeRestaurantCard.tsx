import { Image, Pressable, Text, View } from 'react-native';

import { Icon, PhotoPlaceholder } from '@/components/ui';
import type { HomeCardData } from '@/features/search/hooks';
import { useFavoritesStore } from '@/stores/favorites';
import { colors, iconSize } from '@/theme';

type HomeRestaurantCardProps = {
  restaurant: HomeCardData;
  onPress: (restaurant: HomeCardData) => void;
};

export function HomeRestaurantCard({ restaurant, onPress }: HomeRestaurantCardProps) {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(restaurant.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  return (
    <Pressable
      onPress={() => onPress(restaurant)}
      className="w-[130px] overflow-hidden rounded-lg bg-white shadow-md shadow-black/10"
    >
      <View className="relative">
        {restaurant.photo ? (
          <Image source={{ uri: restaurant.photo }} className="aspect-[4/3] w-full" />
        ) : (
          <PhotoPlaceholder className="aspect-[4/3] w-full" iconSize={iconSize.ui} />
        )}
        <View className="absolute left-sm top-sm flex-row items-center gap-xs rounded-lg bg-black/70 px-sm py-xs">
          <Icon spec={{ set: 'Ionicons', name: 'location-outline' }} size={iconSize.micro} color={colors.white} />
          <Text className="text-caption font-bold text-white">{restaurant.distanceLabel}</Text>
        </View>
        <View className="absolute right-sm top-sm">
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

      <View className="p-sm">
        <Text className="text-xs font-bold text-ink" numberOfLines={1}>
          {restaurant.name}
        </Text>
        {restaurant.websites.length > 0 ? (
          <View className="mt-xs flex-row items-center gap-xs">
            <Icon spec={{ set: 'Ionicons', name: 'globe-outline' }} size={iconSize.micro} color={colors.inkFaint} />
            <Text className="text-caption text-muted" numberOfLines={1}>
              Site
            </Text>
          </View>
        ) : null}
        <Text className="mt-xs text-caption text-muted" numberOfLines={1}>
          {restaurant.cuisineLabel}
        </Text>
        {restaurant.tags.length > 0 ? (
          <View className="mt-sm flex-row flex-wrap gap-xs">
            {restaurant.tags.slice(0, 1).map((tag) => (
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
