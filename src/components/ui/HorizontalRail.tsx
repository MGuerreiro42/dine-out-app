import { ScrollView } from 'react-native';
import type { ReactNode } from 'react';

type HorizontalRailProps = {
  children: ReactNode;
};

export function HorizontalRail({ children }: HorizontalRailProps) {
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
