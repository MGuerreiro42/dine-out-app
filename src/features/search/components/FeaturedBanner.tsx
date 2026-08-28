import { Animated, Image, Pressable, Text, View } from 'react-native';

import { Icon, PhotoPlaceholder } from '@/components/ui';
import type { HomeCardData } from '@/features/search/hooks/useHomeDiscovery';
import { useCarouselIndex, useSlideAnimation } from '@/hooks';

type FeaturedBannerProps = {
  restaurants: HomeCardData[];
  taglineFor: (restaurant: HomeCardData) => string;
};

export function FeaturedBanner({ restaurants, taglineFor }: FeaturedBannerProps) {
  const { index, direction, goPrev, goNext } = useCarouselIndex(restaurants.length);
  const { onLayout, translateX } = useSlideAnimation(index, direction);
  const hasMultiple = restaurants.length > 1;
  const restaurant = restaurants[index];

  if (!restaurant) return null;

  return (
    <View>
      <View className="mx-4 mt-1.5 aspect-[16/7] overflow-hidden rounded-2xl" onLayout={onLayout}>
        {restaurant.photo ? (
          <Animated.View
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transform: [{ translateX }] }}
          >
            <Image source={{ uri: restaurant.photo }} className="h-full w-full" />
          </Animated.View>
        ) : (
          <PhotoPlaceholder iconSize={26} label="No photo available" />
        )}
        <View className="absolute inset-0 bg-black/35" />
        <View className="absolute left-3.5 top-3.5 rounded-full bg-[#e0e7ff] px-2.5 py-1">
          <Text className="text-[12px] font-light text-[#4338ca]">Featured</Text>
        </View>
        <View className="absolute bottom-3.5 left-4 right-4">
          <Text className="text-lg font-bold text-white">{restaurant.name}</Text>
          <Text className="text-xs text-white/85" numberOfLines={1}>
            {taglineFor(restaurant)}
          </Text>
        </View>
        {hasMultiple ? (
          <>
            <Pressable
              onPress={goPrev}
              className="absolute left-2.5 top-1/2 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40"
            >
              <Icon spec={{ set: 'Ionicons', name: 'chevron-back' }} size={18} color="#fff" />
            </Pressable>
            <Pressable
              onPress={goNext}
              className="absolute right-2.5 top-1/2 h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40"
            >
              <Icon spec={{ set: 'Ionicons', name: 'chevron-forward' }} size={18} color="#fff" />
            </Pressable>
          </>
        ) : null}
      </View>
      {hasMultiple ? (
        <View className="mt-2.5 flex-row items-center justify-center gap-1.5">
          {restaurants.map((r, dotIndex) => (
            <View
              key={r.id}
              className={`h-1.5 rounded-full ${dotIndex === index ? 'w-4 bg-[#6366f1]' : 'w-1.5 bg-[#e5e7eb]'}`}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
