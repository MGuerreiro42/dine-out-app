import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet, HorizontalRail, RestaurantCard } from '@/components/ui';
import type { Restaurant } from '@/types';

type RestaurantSectionProps = {
  title?: string;
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
  viewAllMessage?: string;
};

export function RestaurantSection({ title, restaurants, onSelectRestaurant, viewAllMessage }: RestaurantSectionProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <View className="mt-2">
      {title ? (
        <View className="px-4 pb-1.5 pt-5">
          <Text className="text-xl font-bold text-ink">{title}</Text>
        </View>
      ) : null}
      <HorizontalRail>
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} onPress={onSelectRestaurant} />
        ))}
      </HorizontalRail>
      {viewAllMessage ? (
        <View className="px-4 pb-1.5 pt-0.5">
          <Pressable onPress={() => setSheetOpen(true)}>
            <Text className="text-[13px] font-bold text-ink underline">view all</Text>
          </Pressable>
        </View>
      ) : null}

      <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <Text className="text-center text-sm text-gray-600">{viewAllMessage}</Text>
        <Pressable onPress={() => setSheetOpen(false)} className="mt-1.5 rounded-xl bg-ink p-3.5">
          <Text className="text-center text-sm font-bold text-white">Fechar</Text>
        </Pressable>
      </BottomSheet>
    </View>
  );
}
