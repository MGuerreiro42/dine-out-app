import { Alert, Image, Pressable, Text, View } from 'react-native';

import type { Restaurant } from '@/types';
import { useLocationOrigin } from '@/hooks/useLocationOrigin';
import { distanceLabelFrom } from '@/lib/geo';
import { useFavoritesStore } from '@/stores/favorites';
import { colors, iconSize } from '@/theme';

import { DistanceChip } from './DistanceChip';
import { Icon } from './Icon';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { RatingBadge } from './RatingBadge';

type RestaurantCardProps = {
  restaurant: Restaurant;
  onPress: (restaurant: Restaurant) => void;
};

export function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(restaurant.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const origin = useLocationOrigin();
  const distanceLabel = distanceLabelFrom(origin, restaurant);

  return (
    <Pressable
      onPress={() => onPress(restaurant)}
      className="w-[150px] overflow-hidden rounded-lg bg-white shadow-md shadow-black/10"
    >
      <View className="relative">
        {restaurant.photo ? (
          <Image source={{ uri: restaurant.photo }} className="h-[110px] w-[150px]" />
        ) : (
          <PhotoPlaceholder className="h-[110px] w-[150px]" />
        )}
        <DistanceChip label={distanceLabel} />
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
          <Pressable
            onPress={() => Alert.alert('Share', 'Coming soon.')}
            className="h-6 w-6 items-center justify-center rounded-full bg-white/90"
          >
            <Icon spec={{ set: 'Ionicons', name: 'share-outline' }} size={iconSize.micro} color={colors.inkMuted} />
          </Pressable>
        </View>
      </View>
      <View className="p-sm">
        <Text className="text-sm font-bold">{restaurant.name}</Text>
        <RatingBadge rating={restaurant.rating} priceLevel={restaurant.priceLevel} />
      </View>
    </Pressable>
  );
}
