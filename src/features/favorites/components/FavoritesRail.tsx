import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { HorizontalRail, Icon, RestaurantCard } from '@/components/ui';
import type { Restaurant } from '@/types';

import { useFavoriteRestaurantsQuery } from '../api';

export function FavoritesRail() {
  const router = useRouter();
  const { data: favoriteRestaurants, isLoading } = useFavoriteRestaurantsQuery();

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  // Avoid flashing the empty state while the first fetch is in flight.
  if (isLoading) {
    return null;
  }

  return (
    <View className="border-t border-gray-100 py-5">
      <Text className="mb-3 px-4 text-base font-bold text-ink">Favoritos</Text>

      {favoriteRestaurants.length === 0 ? (
        <View className="px-4">
          <View className="items-center gap-2 px-4 py-2">
            <Icon spec={{ set: 'Ionicons', name: 'heart-outline' }} size={32} color="#8a8580" />
            <Text className="text-center text-sm font-bold text-ink">Você ainda não tem favoritos,</Text>
            <Text className="text-center text-xs text-muted">
              Toque no coração de um restaurante para salvá-lo aqui.
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/')}
            className="flex-row items-center justify-between border-t border-sand py-3.5"
          >
            <Text className="text-sm font-bold text-ink">Explorar restaurantes</Text>
            <Icon spec={{ set: 'Ionicons', name: 'chevron-forward' }} size={16} color="#d1d5db" />
          </Pressable>
        </View>
      ) : (
        <HorizontalRail>
          {favoriteRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} onPress={handleSelectRestaurant} />
          ))}
        </HorizontalRail>
      )}
    </View>
  );
}
