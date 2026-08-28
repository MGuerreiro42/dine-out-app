import { Alert, Image, Pressable, Text, View } from 'react-native';

import type { Restaurant } from '@/types';
import { useFavoritesStore } from '@/stores/favorites';

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
  const isOpenNow = restaurant.id % 4 !== 0;

  return (
    <Pressable
      onPress={() => onPress(restaurant)}
      className="w-[150px] overflow-hidden rounded-xl bg-white shadow-md shadow-black/10"
    >
      <View className="relative">
        {restaurant.photo ? (
          <Image source={{ uri: restaurant.photo }} className="h-[110px] w-[150px]" />
        ) : (
          <PhotoPlaceholder className="h-[110px] w-[150px]" iconSize={22} />
        )}
        {isOpenNow ? (
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
            onPress={() => Alert.alert('Share', 'Coming soon.')}
            className="h-6 w-6 items-center justify-center rounded-full bg-white/90"
          >
            <Icon spec={{ set: 'Ionicons', name: 'share-outline' }} size={12} color="#374151" />
          </Pressable>
        </View>
      </View>
      <View className="p-2">
        <Text className="text-sm font-bold">{restaurant.name}</Text>
        <RatingBadge rating={restaurant.rating} priceLevel={restaurant.priceLevel} />
      </View>
    </Pressable>
  );
}
