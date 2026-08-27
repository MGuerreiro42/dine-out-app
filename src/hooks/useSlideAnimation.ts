import { useLayoutEffect, useRef, useState } from 'react';
import { Animated, type LayoutChangeEvent } from 'react-native';

import type { CarouselDirection } from '@/hooks/useCarouselIndex';

const SLIDE_DURATION_MS = 320;

export function useSlideAnimation(index: number, direction: CarouselDirection) {
  const [width, setWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const isFirstRender = useRef(true);
  const latest = useRef({ direction, width });
  latest.current = { direction, width };

  const onLayout = (event: LayoutChangeEvent) => {
    const measuredWidth = event.nativeEvent.layout.width;
    setWidth((previous) => (previous === measuredWidth ? previous : measuredWidth));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on index only to retrigger per carousel advance; direction/width are read via the latest ref to avoid a stale closure, and translateX is a stable ref identity that never changes.
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const { direction: currentDirection, width: currentWidth } = latest.current;
    if (currentWidth === 0) {
      translateX.setValue(0);
      return;
    }

    translateX.setValue(currentDirection === 'forward' ? currentWidth : -currentWidth);
    Animated.timing(translateX, {
      toValue: 0,
      duration: SLIDE_DURATION_MS,
      useNativeDriver: true,
    }).start();
  }, [index]);

  return { onLayout, translateX };
}
