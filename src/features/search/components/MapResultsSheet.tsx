import { cssInterop } from 'nativewind';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

cssInterop(Animated.View, { className: 'style' });

const EXPANDED_RATIO = 0.93;
const COLLAPSED_VISIBLE_HEIGHT = 130;
const DEFAULT_VISIBLE_HEIGHT = 260;
const SPRING_CONFIG = { damping: 28, stiffness: 260, overshootClamping: true };

type MapResultsSheetProps = {
  count: number;
  containerHeight: number;
  searchQuery?: string;
  children: ReactNode;
};

export function MapResultsSheet({ count, containerHeight, searchQuery, children }: MapResultsSheetProps) {
  const sheetHeight = containerHeight * EXPANDED_RATIO;
  const maxTranslateY = Math.max(sheetHeight - COLLAPSED_VISIBLE_HEIGHT, 0);
  const defaultTranslateY = Math.max(sheetHeight - DEFAULT_VISIBLE_HEIGHT, 0);

  const translateY = useSharedValue(defaultTranslateY);
  const startY = useSharedValue(0);

  useEffect(() => {
    translateY.value = defaultTranslateY;
  }, [defaultTranslateY, translateY]);

  useEffect(() => {
    if (searchQuery?.trim()) {
      translateY.value = withSpring(0, SPRING_CONFIG);
    }
  }, [searchQuery, translateY]);

  const pan = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      const next = startY.value + event.translationY;
      translateY.value = Math.min(maxTranslateY, Math.max(0, next));
    })
    .onEnd(() => {
      const midpoint = maxTranslateY / 2;
      translateY.value = withSpring(translateY.value > midpoint ? maxTranslateY : 0, SPRING_CONFIG);
    });

  const tap = Gesture.Tap().onEnd(() => {
    const midpoint = maxTranslateY / 2;
    translateY.value = withSpring(translateY.value > midpoint ? 0 : maxTranslateY, SPRING_CONFIG);
  });

  const handleGesture = Gesture.Exclusive(pan, tap);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ height: sheetHeight }, animatedStyle]} className="absolute bottom-0 left-0 right-0">
      <View className="h-full rounded-t-3xl bg-white shadow-lg">
        <GestureDetector gesture={handleGesture}>
          <View className="pb-sm pt-md">
            <View className="mx-auto h-1 w-9 rounded-full bg-sand-border" />
            <Text className="mt-sm px-md text-xs font-bold text-ink">{count} restaurantes encontrados</Text>
          </View>
        </GestureDetector>
        <View className="flex-1 px-md pb-md pt-xs">{children}</View>
      </View>
    </Animated.View>
  );
}
