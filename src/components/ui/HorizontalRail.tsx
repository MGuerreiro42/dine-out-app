import { ScrollView, View } from 'react-native';
import type { ReactNode } from 'react';

import { useBreakpoint } from '@/hooks/useBreakpoint';

type HorizontalRailProps = {
  children: ReactNode;
};

export function HorizontalRail({ children }: HorizontalRailProps) {
  const breakpoint = useBreakpoint();

  if (breakpoint === 'tablet') {
    return <View className="flex-row flex-wrap gap-sm2 px-md pb-sm">{children}</View>;
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
