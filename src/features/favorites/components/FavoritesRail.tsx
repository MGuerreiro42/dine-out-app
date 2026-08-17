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
        <View className="items-center gap-2 px-8 py-2">
          <Icon spec={{ set: 'Ionicons', name: 'heart-outline' }} size={32} color="#9ca3af" />
          <Text className="text-center text-sm font-bold text-ink">Você ainda não tem favoritos,</Text>
          <Text className="text-center text-xs text-muted">
            Toque no coração de um restaurante para salvá-lo aqui.
          </Text>
          <Pressable onPress={() => router.push('/')} className="mt-1.5">
            <Text className="text-sm font-bold text-[#4f46e5]">Explorar restaurantes</Text>
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
