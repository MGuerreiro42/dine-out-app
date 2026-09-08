import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { HorizontalRail, Icon, RestaurantCard } from '@/components/ui';
import { colors, iconSize } from '@/theme';
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
    <View className="border-t border-sand-border py-md2">
      <Text className="mb-sm2 px-md text-base font-bold text-ink">Favorites</Text>

      {favoriteRestaurants.length === 0 ? (
        <View className="px-md">
          <View className="items-center gap-sm px-md py-sm">
            <Icon spec={{ set: 'Ionicons', name: 'heart-outline' }} size={iconSize.empty} color={colors.inkFaint} />
            <Text className="text-center text-sm font-bold text-ink">You don't have any favorites yet,</Text>
            <Text className="text-center text-xs text-muted">
              Tap the heart icon on a restaurant to save it here.
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/')}
            className="flex-row items-center justify-between border-t border-sand py-md"
          >
            <Text className="text-sm font-bold text-ink">Explore restaurants</Text>
            <Icon spec={{ set: 'Ionicons', name: 'chevron-forward' }} size={iconSize.inline} color={colors.inkSubtle} />
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
