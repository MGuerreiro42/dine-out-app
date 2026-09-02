import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { Icon, PhotoPlaceholder } from '@/components/ui';
import type { HomeCardData } from '@/features/search/hooks/useHomeDiscovery';
import { useFavoritesStore } from '@/stores/favorites';
import { colors, iconSize } from '@/theme';

type NearbyCardProps = {
  restaurant: HomeCardData;
  onPress: (restaurant: HomeCardData) => void;
};

function NearbyCard({ restaurant, onPress }: NearbyCardProps) {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(restaurant.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const tag = restaurant.tags[0];

  return (
    <Pressable onPress={() => onPress(restaurant)} className="h-[328px] w-[264px] overflow-hidden rounded-lg">
      {restaurant.photo ? (
        <Image source={{ uri: restaurant.photo }} className="absolute inset-0 h-full w-full" />
      ) : (
        <PhotoPlaceholder className="absolute inset-0 h-full w-full" iconSize={iconSize.header} />
      )}
      <View className="absolute inset-0 bg-black/45" />

      <View className="absolute left-sm2 top-sm2 flex-row items-center gap-xs rounded-full bg-white/95 px-sm2 py-xs">
        <Icon spec={{ set: 'Ionicons', name: 'location-outline' }} size={iconSize.micro} color={colors.ink} />
        <Text className="text-caption font-bold text-ink">{restaurant.distanceLabel}</Text>
      </View>
      <Pressable
        onPress={() => toggleFavorite(restaurant.id)}
        className="absolute right-sm2 top-sm2 h-8 w-8 items-center justify-center rounded-full bg-white/95"
      >
        <Icon
          spec={{ set: 'Ionicons', name: 'heart-outline' }}
          size={iconSize.inline}
          color={isFavorite ? colors.danger : colors.ink}
        />
      </Pressable>

      <View className="absolute bottom-md2 left-md right-md">
        {tag ? (
          <View className="mb-sm2 self-start rounded-full border border-white/30 bg-white/15 px-sm2 py-xs">
            <Text className="text-caption font-medium text-white">{tag}</Text>
          </View>
        ) : null}
        <Text className="text-xl font-bold text-white" style={{ letterSpacing: -0.2 }} numberOfLines={1}>
          {restaurant.name}
        </Text>
        <Text className="mt-xs text-body text-white/85">{restaurant.cuisineLabel}</Text>
      </View>
    </Pressable>
  );
}

type NearbySectionProps = {
  restaurants: HomeCardData[];
  onSelectRestaurant: (restaurant: HomeCardData) => void;
  onViewAll: () => void;
};

export function NearbySection({ restaurants, onSelectRestaurant, onViewAll }: NearbySectionProps) {
  if (restaurants.length === 0) return null;

  return (
    <View>
      <View className="flex-row items-end justify-between px-md pb-xs pt-lg">
        <View>
          <Text className="text-xl font-bold text-ink" style={{ letterSpacing: -0.5 }}>
            Nearby You
          </Text>
          <Text className="mt-xs text-body text-muted">Great places, minutes from here</Text>
        </View>
        <Pressable onPress={onViewAll}>
          <Text className="text-caption font-bold text-accent">View all</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 }}
      >
        {restaurants.map((restaurant) => (
          <NearbyCard key={restaurant.id} restaurant={restaurant} onPress={onSelectRestaurant} />
        ))}
      </ScrollView>
    </View>
  );
}
