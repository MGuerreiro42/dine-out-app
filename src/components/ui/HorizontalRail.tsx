import { ScrollView, View } from 'react-native';
import type { ReactNode } from 'react';

import { useBreakpoint } from '@/hooks/useBreakpoint';

type HorizontalRailProps = {
  children: ReactNode;
};

// Phone: unchanged horizontal scroll. Tablet+: the same fixed-width cards
// wrap into a real multi-column grid instead of scrolling — every existing
// call site (RestaurantSection, SimilarPlacesSection) needs no changes,
// since they only ever pass children through this one component.
export function HorizontalRail({ children }: HorizontalRailProps) {
  const breakpoint = useBreakpoint();

  if (breakpoint === 'tablet') {
    return <View className="flex-row flex-wrap gap-3 px-4 pb-1.5">{children}</View>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 12, paddingHorizontal: 16, paddingBottom: 6 }}
    >
      {children}
    </ScrollView>
  );
}
