import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { HorizontalRail } from '@/components/ui/HorizontalRail';
import { HomeRestaurantCard } from '@/features/search/components/HomeRestaurantCard';
import type { HomeCardData } from '@/features/search/hooks';

type RestaurantSectionProps = {
  restaurants: HomeCardData[];
  onSelectRestaurant: (restaurant: HomeCardData) => void;
  viewMoreMessage?: string;
  onViewMore?: () => void;
  viewMoreLabel?: string;
};

export function RestaurantSection({
  restaurants,
  onSelectRestaurant,
  viewMoreMessage,
  onViewMore,
  viewMoreLabel = 'View more',
}: RestaurantSectionProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <View className="mt-2">
      <HorizontalRail>
        {restaurants.map((restaurant) => (
          <HomeRestaurantCard key={restaurant.id} restaurant={restaurant} onPress={onSelectRestaurant} />
        ))}
      </HorizontalRail>
      {onViewMore || viewMoreMessage ? (
        <View className="items-center px-4 pb-1.5 pt-2.5">
          <Pressable
            onPress={onViewMore ?? (() => setSheetOpen(true))}
            className="rounded-full border border-[#e5e7eb] bg-white px-6 py-2.5"
          >
            <Text className="text-[13px] font-bold text-[#111827]">{viewMoreLabel}</Text>
          </Pressable>
        </View>
      ) : null}

      <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <Text className="text-center text-sm text-gray-600">{viewMoreMessage}</Text>
        <Pressable onPress={() => setSheetOpen(false)} className="mt-1.5 rounded-xl bg-ink p-3.5">
          <Text className="text-center text-sm font-bold text-white">Fechar</Text>
        </Pressable>
      </BottomSheet>
    </View>
  );
}
