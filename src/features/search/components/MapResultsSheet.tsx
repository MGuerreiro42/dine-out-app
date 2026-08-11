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
// How much of the sheet is visible by default, before any drag/tap/search —
// enough to see the first result card (and a peek of the next one) so the
// list reads as real, present content the moment the screen opens, instead
// of requiring the user to discover the drag handle first.
const DEFAULT_VISIBLE_HEIGHT = 260;
const SPRING_CONFIG = { damping: 28, stiffness: 260, overshootClamping: true };

type MapResultsSheetProps = {
  count: number;
  containerHeight: number;
  searchQuery?: string;
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
export function MapResultsSheet({ count, containerHeight, searchQuery, children }: MapResultsSheetProps) {
  const sheetHeight = containerHeight * EXPANDED_RATIO;
  const maxTranslateY = Math.max(sheetHeight - COLLAPSED_VISIBLE_HEIGHT, 0);
  const defaultTranslateY = Math.max(sheetHeight - DEFAULT_VISIBLE_HEIGHT, 0);

  const translateY = useSharedValue(defaultTranslateY);
  const startY = useSharedValue(0);

  // Re-syncs to the default reveal whenever the measured containerHeight
  // changes — most notably the one correction from the initial
  // useWindowDimensions() fallback to the real (tab-bar-excluded) height
  // right after mount. Drag/tap and the search-query effect below still
  // fully override this afterward; this only governs the pre-interaction
  // default.
  useEffect(() => {
    translateY.value = defaultTranslateY;
  }, [defaultTranslateY, translateY]);

  // Maximize the sheet so results are actually visible as soon as the user
  // starts searching, instead of requiring a manual drag every time.
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
    // Animated.View carries only the animated transform + explicit numeric
    // height — no Tailwind className here. Mixing an inline `style` array
    // with `className` on the same component is a known NativeWind/
    // Reanimated interop gotcha (className-derived styles can silently no-op,
    // not just colors — same class of bug as Framer Motion's transform-
    // ownership issue). All real styling (bg, radius, shadow) lives on the
    // plain inner View instead, which has no competing style prop at all.
    <Animated.View style={[{ height: sheetHeight }, animatedStyle]} className="absolute bottom-0 left-0 right-0">
      <View className="h-full rounded-t-3xl bg-white shadow-lg">
        <GestureDetector gesture={handleGesture}>
          <View className="pb-1.5 pt-3.5">
            <View className="mx-auto h-1 w-9 rounded-full bg-gray-300" />
            <Text className="mt-2 px-4 text-xs font-bold text-ink">{count} restaurantes encontrados</Text>
          </View>
        </GestureDetector>
        <View className="flex-1 px-4 pb-4 pt-1">{children}</View>
      </View>
    </Animated.View>
  );
}
