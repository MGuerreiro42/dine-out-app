import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const PULSE_DURATION_MS = 700;
const MIN_OPACITY = 0.4;
const MAX_OPACITY = 1;

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = 'h-full w-full' }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(MIN_OPACITY)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: MAX_OPACITY, duration: PULSE_DURATION_MS, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: MIN_OPACITY, duration: PULSE_DURATION_MS, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View style={{ opacity }}>
      <View className={`rounded-xl bg-sand-light ${className}`} />
    </Animated.View>
  );
}
