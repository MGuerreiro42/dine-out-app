import { cssInterop } from 'nativewind';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

// NativeWind doesn't recognize third-party components like Reanimated's
// Animated.View out of the box — className would silently no-op on it
// (including position/layout classes, not just colors) without this
// registration. Module-scope, once, not inside the component.
cssInterop(Animated.View, { className: 'style' });

const EXPANDED_RATIO = 0.93;
const COLLAPSED_VISIBLE_HEIGHT = 130;
const SPRING_CONFIG = { damping: 28, stiffness: 260, overshootClamping: true };

type MapResultsSheetProps = {
  count: number;
  containerHeight: number;
  children: ReactNode;
};

// First real use of gesture-handler/reanimated in this codebase beyond the
// mandatory GestureHandlerRootView root wrapper — a two-snap-point
// (collapsed/expanded) drag, not a continuous free-form sheet. Only the
// handle/header area carries the pan gesture; the list below scrolls in its
// own ScrollView, sidestepping the harder drag-vs-scroll gesture handoff.
// `containerHeight` is measured by the parent via onLayout rather than
// `useWindowDimensions()` — the screen's actual content area is smaller than
// the full window (the bottom tab bar eats into it), so the window size
// would overstate how tall the sheet should be.
export function MapResultsSheet({ count, containerHeight, children }: MapResultsSheetProps) {
  const sheetHeight = containerHeight * EXPANDED_RATIO;
  const maxTranslateY = Math.max(sheetHeight - COLLAPSED_VISIBLE_HEIGHT, 0);

  const translateY = useSharedValue(maxTranslateY);
  const startY = useSharedValue(0);

  useEffect(() => {
    translateY.value = maxTranslateY;
  }, [maxTranslateY, translateY]);

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
    <Animated.View
      style={[{ height: sheetHeight }, animatedStyle]}
      className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white shadow-lg"
    >
      <GestureDetector gesture={handleGesture}>
        <View className="pb-1.5 pt-3.5">
          <View className="mx-auto h-1 w-9 rounded-full bg-gray-300" />
          <Text className="mt-2 px-4 text-xs font-bold text-ink">{count} restaurantes encontrados</Text>
        </View>
      </GestureDetector>
      <View className="flex-1 px-4 pb-4 pt-1">{children}</View>
    </Animated.View>
  );
}
