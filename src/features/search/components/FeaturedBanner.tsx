import { Animated, Image, Text, View } from "react-native";

import { CarouselArrows, CarouselDots, PhotoPlaceholder } from "@/components/ui";
import type { HomeCardData } from "@/features/search/hooks/useHomeDiscovery";
import { useCarouselIndex, useSlideAnimation } from "@/hooks";
import { iconSize } from "@/theme";

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
      {/* Margin lives on this wrapper, not the aspect-ratio box below — aspect-ratio
          combined with its own horizontal margin doesn't stretch to the correct width
          (measured on-device: ~55px short of every other row's right edge), so the
          aspect box gets a plain w-full of an already-inset, margin-free parent instead. */}
      <View className="mx-md mt-sm">
        <View className="aspect-[16/7] w-full overflow-hidden rounded-lg" onLayout={onLayout}>
          {restaurant.photo ? (
            <Animated.View
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, transform: [{ translateX }] }}
            >
              <Image source={{ uri: restaurant.photo }} className="h-full w-full" />
            </Animated.View>
          ) : (
            <PhotoPlaceholder iconSize={iconSize.header} label="No photo available" />
          )}
          <View className="absolute inset-0 bg-black/35" />
          <View className="absolute left-md top-md rounded-full bg-accent-tint px-sm2 py-xs">
            <Text className="text-caption font-light text-accent">Featured</Text>
          </View>
          <View className="absolute bottom-md left-md right-md">
            <Text className="text-lg font-bold text-white">{restaurant.name}</Text>
            <Text className="text-xs text-white/85" numberOfLines={1}>
              {taglineFor(restaurant)}
            </Text>
          </View>
          {hasMultiple ? <CarouselArrows onPrev={goPrev} onNext={goNext} /> : null}
        </View>
      </View>
      {hasMultiple ? <CarouselDots count={restaurants.length} activeIndex={index} /> : null}
    </View>
  );
}
