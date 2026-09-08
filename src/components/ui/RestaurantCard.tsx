import { Alert, Image, Pressable, Text, View } from 'react-native';

import type { Restaurant } from '@/types';
import { haversineKm, formatDistanceKm } from '@/lib/geo';
import { useFavoritesStore } from '@/stores/favorites';
import { useLocationStore } from '@/stores/location';
import { colors, iconSize } from '@/theme';

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
  const fromLatitude = useLocationStore((s) => s.latitude);
  const fromLongitude = useLocationStore((s) => s.longitude);
  const distanceLabel = formatDistanceKm(
    haversineKm(fromLatitude, fromLongitude, restaurant.latitude, restaurant.longitude),
  );

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
        <View className="absolute left-sm top-sm flex-row items-center gap-xs rounded-lg bg-black/70 px-sm py-xs">
          <Icon spec={{ set: 'Ionicons', name: 'location-outline' }} size={iconSize.micro} color={colors.white} />
          <Text className="text-caption font-bold text-white">{distanceLabel}</Text>
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
